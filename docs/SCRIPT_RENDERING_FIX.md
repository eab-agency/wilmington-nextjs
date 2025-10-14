# EAB Form Script Rendering Fix

## Problem Summary

External scripts (specifically `<script src="https://admiss.info/edu/v1/form.js?pid=13225" defer></script>`) placed in WordPress CoreHtml blocks were not executing on the frontend, preventing EAB forms from rendering.

## Root Causes

### 1. React Security Restrictions
React strips `<script>` tags when using `dangerouslySetInnerHTML` for security reasons. Script tags in the HTML string are rendered as inert DOM elements that don't execute.

### 2. React Strict Mode Double Mounting
In development, React Strict Mode mounts components twice, causing:
- Scripts to be processed multiple times
- Race conditions with async operations
- Parent node references becoming stale between mounts

### 3. Timing Issues with EAB Script
The EAB form.js script listens for the `DOMContentLoaded` event to find and process script tags. By the time React components mount and add scripts, this event has already fired, so the script never processes the form.

### 4. Component Lifecycle Issues
- The `defer` attribute on scripts prevented `onload` handlers from firing reliably
- Parent node references were lost after React re-renders
- `setTimeout` callbacks executed after components unmounted, leaving DOM references null

## Solution Implemented

### Modified File: `src/components/blocks/core/BlockHtml/BlockHtml.js`

The solution involves manually extracting and executing scripts from HTML content with special handling for EAB forms:

#### Key Features:

1. **Global Script Registry**
   ```javascript
   window.__EAB_PROCESSED_SCRIPTS = new Set()
   ```
   - Prevents duplicate script processing across component remounts
   - Survives React Strict Mode's double mounting

2. **Script Extraction and Re-creation**
   - Finds all `<script>` tags in the rendered HTML
   - Creates new executable script elements
   - Removes the `defer` attribute to ensure `onload` handlers fire immediately
   - Replaces inert script tags with executable ones using `replaceChild()`

3. **EAB Form Script Detection**
   - Detects scripts containing `form.js?pid=` in the URL
   - Extracts PID (Partner ID), form name, and display type from URL parameters

4. **Manual Form Loading**
   Since the `DOMContentLoaded` event has already fired, we manually replicate what the EAB script does:
   - Fetch form configuration from `https://admiss.info/edu/v1/pid-data/{PID}.json`
   - Extract Mautic domain and form ID from the response
   - Create a container div with `data-form-id` attribute
   - Load the Mautic form script dynamically

5. **Parent Node Reference Preservation**
   ```javascript
   const scriptParent = newScript.parentNode
   ```
   - Captures parent node reference before `setTimeout`
   - Prevents null reference errors when React re-renders

6. **Duplicate Prevention**
   - Checks for existing form containers before creating new ones
   - Uses global registry to track processed scripts
   - Removes duplicate script tags immediately

7. **Hydration Mismatch Prevention**
   ```javascript
   suppressHydrationWarning
   ```
   - Suppresses React hydration warnings for dynamic CMS content
   - Allows server and client HTML to differ safely

## Technical Flow

1. **Component Mount**
   - `BlockHtml` component renders with HTML containing script tags
   - `useEffect` hook runs after DOM is ready

2. **Script Processing**
   - Query for all `<script>` tags in the container
   - Check global registry to skip already-processed scripts
   - Create new executable script elements

3. **EAB Script Handling**
   - Detect EAB form scripts by URL pattern
   - Set up `onload` handler with form loading logic
   - Store parent node reference before async operations

4. **Form Loading**
   - Wait 100ms for EAB object initialization
   - Fetch form configuration from EAB API
   - Create form container div
   - Load Mautic form generation script
   - Mark as processed to prevent duplicates

5. **Script Execution**
   - Replace old inert script with new executable script
   - Browser executes the script immediately
   - `onload` handler triggers form loading sequence

## Files Modified

1. **`src/components/blocks/core/BlockHtml/BlockHtml.js`**
   - Complete rewrite of script handling logic
   - Added EAB form-specific processing
   - Implemented global deduplication registry
   - Only file that needed modification - all script handling is centralized here

**Note**: No changes were needed to `EabBlocksStudentLifeMicroform.js` or `CoreColumns.js`. These components remain unchanged and simply render their children using `WordPressBlocksViewer`, which eventually renders the `CoreHtml` block that contains the script.

## Testing Recommendations

1. **Development Mode**
   - Test with React Strict Mode enabled (double mounting)
   - Verify no duplicate forms appear
   - Check browser console for errors

2. **Production Build**
   - Test without Strict Mode
   - Verify form loads correctly
   - Check network tab for proper API calls

3. **Multiple Forms**
   - Test pages with multiple EAB forms
   - Verify each form loads independently
   - Check for script conflicts

4. **Navigation**
   - Test client-side navigation between pages
   - Verify forms load after navigation
   - Check for memory leaks (scripts not cleaned up)

## Known Limitations

1. **100ms Delay**
   - Small delay added to ensure EAB object initialization
   - Could be optimized with polling or promise-based approach

2. **Inline Display Only**
   - Current implementation only handles `display=inline`
   - Modal forms (`display=modal`) would need additional handling

3. **Error Handling**
   - Errors are logged to console but don't show user-friendly messages
   - Could be enhanced with error UI

## Future Improvements

1. **Dynamic Delay**
   - Replace fixed 100ms timeout with polling for `window.EAB`
   - Reduce unnecessary waiting time

2. **Loading States**
   - Add loading indicators while form is being fetched
   - Improve user experience during form load

3. **Error UI**
   - Display user-friendly error messages when forms fail to load
   - Provide retry mechanisms

4. **Modal Support**
   - Implement handling for modal display type
   - Add modal trigger button support

5. **Performance**
   - Consider lazy loading forms only when visible
   - Implement intersection observer for below-fold forms
