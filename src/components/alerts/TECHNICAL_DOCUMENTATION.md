# Alerts Feature - Technical Documentation

## Overview

This document provides detailed technical information about the alerts feature implementation for developers working on the Wilmington College website.

## Architecture

### Component Hierarchy

```
App (_app.jsx)
├── CustomSettingsProvider (manages alerts data)
│   └── Layout (common/Layout.js)
│       ├── AlertBar (organisms/AlertBar/AlertBar.tsx)
│       └── HomepageModal (HomepageModal.tsx)
```

### Data Flow

1. **Data Fetching**: `CustomSettingsProvider` fetches alerts via GraphQL
2. **State Management**: Provider manages alert state and dismissal logic
3. **Component Rendering**: `AlertBar` and `HomepageModal` consume alert data
4. **User Interaction**: Components handle dismissal and update provider state
5. **Persistence**: Dismissal state stored in browser cookies

## Implementation Details

### TypeScript Interfaces

The alerts system uses comprehensive TypeScript interfaces defined in `src/types/alerts.ts`:

```typescript
// Base interface for all alerts
interface BaseAlert {
  id: number
  status: string
  date: string
  alertType: 'alert-bar' | 'popup-modal'
}

// Alert bar specific data
interface AlertBarData extends BaseAlert {
  alertType: 'alert-bar'
  alertMsgTitle: string
  alertMessage: string
  alertButtonLabel: string
  alertButtonUri: string
  buttonLabel: string
  buttonUrl: string
  tags?: { edges: Array<{ node: { name: string } }> }
}

// Popup modal specific data
interface PopupModalData extends BaseAlert {
  alertType: 'popup-modal'
  popupTitle: string
  popupContent: string
  popupVisibilityPage: string | null
  buttonLabel: string
  buttonUrl: string
  popupImage: {
    altText: string
    id: number
    sourceUrl: string
  } | null
}
```

### GraphQL Integration

The system uses a single GraphQL query to fetch all alert data:

```graphql
query GetLatestAlertAndCustomSettings {
  alerts {
    nodes {
      id
      status
      date
      alertType
      alertMsgTitle
      alertMessage
      alertButtonLabel
      alertButtonUri
      buttonLabel
      buttonUrl
      popupTitle
      popupContent
      popupVisibilityPage
      popupImage {
        altText
        id
        sourceUrl
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
  }
}
```

### Cookie Management

The system uses two cookie utility functions for persistence:

#### Cookie Naming Convention

- Alert bars: `dismissedAlert_{alertId}=true`
- Popup modals: `dismissedModal_{modalId}=true`

#### Cookie Properties

- **Expiration**: 30 days from dismissal
- **Path**: `/` (site-wide)
- **SameSite**: `lax` for security
- **Encoding**: URL-encoded keys and values

#### Implementation

```typescript
// Setting a dismissal cookie
setCookie(`dismissedAlert_${alertId}`, 'true', {
  expires: 30,
  path: '/',
  sameSite: 'lax'
})

// Reading dismissal state
const isDismissed = getCookie(`dismissedAlert_${alertId}`) === 'true'
```

### Alert Processing Logic

The `CustomSettingsProvider` implements sophisticated alert processing:

1. **Filtering**: Only alerts with `status: 'publish'` are considered
2. **Sorting**: Alerts sorted by date (newest first)
3. **Grouping**: Alerts grouped by type (`alert-bar`, `popup-modal`)
4. **Selection**: Only the most recent alert of each type is displayed
5. **Dismissal Check**: Dismissed alerts are filtered out

```typescript
const processAlerts = (): Alert[] => {
  // Filter published alerts
  const publishedAlerts = data.alerts.nodes.filter(
    (alert) => alert.status === 'publish'
  )

  // Sort by date (newest first)
  publishedAlerts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Group by type and select most recent
  const alertsByType = groupBy(publishedAlerts, 'alertType')
  return [
    alertsByType['alert-bar']?.[0],
    alertsByType['popup-modal']?.[0]
  ].filter(Boolean)
}
```

### Component Implementation

#### AlertBar Component

**Location**: `src/components/organisms/AlertBar/AlertBar.tsx`

**Key Features**:

- Renders at the top of the main content area
- Supports tag-based styling via CSS classes
- Handles both legacy and new button field formats
- Integrates with `CustomSettingsProvider` for dismissal

**Styling**: Uses SCSS modules with tag-based class modifiers:

```scss
.alertBar {
  // Base styles

  &.urgent {
    // Urgent alert styling
  }

  &.info {
    // Info alert styling
  }
}
```

#### HomepageModal Component

**Location**: `src/components/HomepageModal.tsx`

**Key Features**:

- Renders as an overlay modal
- Supports page-specific visibility
- Handles optional image display
- Two-column responsive layout
- HTML content rendering with `dangerouslySetInnerHTML`

**Page Visibility Logic**:

```typescript
const shouldShow =
  !modalData.popupVisibilityPage ||
  modalData.popupVisibilityPage === currentPageSlug ||
  modalData.popupVisibilityPage === router.asPath
```

### Performance Considerations

#### GraphQL Polling

- **Interval**: 5 minutes (300,000ms)
- **Purpose**: Check for new alerts without page refresh
- **Impact**: Minimal - only fetches when tab is active

#### Cookie Optimization

- **Parsing**: Cookies parsed once on component mount
- **Storage**: Minimal data stored (only dismissal flags)
- **Cleanup**: Cookies auto-expire after 30 days

#### Conditional Rendering

- Components only render when alerts are available
- Early returns prevent unnecessary DOM updates
- Lazy loading of images in modals

### Error Handling

#### GraphQL Errors

```typescript
if (queryError) {
  console.error('GraphQL Error:', queryError)
  // Graceful degradation - alerts simply don't show
}
```

#### Cookie Failures

```typescript
if (typeof document === 'undefined') {
  return null // SSR safety
}

// Graceful handling of disabled cookies
try {
  setCookie(name, value, options)
} catch (error) {
  // Continue without persistence
}
```

#### Missing Data

```typescript
// Safe property access with optional chaining
const buttonUrl = alertData?.buttonUrl || alertData?.alertButtonUri
const hasImage = modalData?.popupImage?.sourceUrl
```

### Testing Strategy

#### Unit Tests

Test files should be created for:

- `cookieUtils.ts` - Cookie operations
- `AlertsProvider.tsx` - Context logic
- `AlertBar.tsx` - Component rendering
- `HomepageModal.tsx` - Modal behavior

#### Integration Tests

- GraphQL query integration
- Cookie persistence across page loads
- Component interaction with providers

#### Manual Testing

Use the following checklist for manual testing:

- [ ] Alert bar appears on all pages when published
- [ ] Modal appears on correct pages based on visibility settings
- [ ] Dismissal persists across browser sessions
- [ ] Only most recent alert of each type displays
- [ ] Buttons navigate to correct URLs
- [ ] Images load correctly in modals
- [ ] Responsive design works on mobile devices
- [ ] Accessibility features work with screen readers

### Browser Compatibility

#### Supported Features

- **Cookies**: All modern browsers
- **CSS Grid/Flexbox**: IE11+ with fallbacks
- **ES6 Features**: Transpiled for IE11+
- **Next.js Image**: Automatic optimization

#### Fallback Behavior

- **No JavaScript**: Alerts won't appear (graceful degradation)
- **Cookies Disabled**: Alerts will reappear on each page load
- **Old Browsers**: Basic styling with CSS fallbacks

### Security Considerations

#### XSS Prevention

- Modal content uses `dangerouslySetInnerHTML` - content should be sanitized in WordPress
- Button URLs should be validated in WordPress admin
- Cookie values are URL-encoded to prevent injection

#### CSRF Protection

- No sensitive operations performed via alerts
- Dismissal actions are idempotent
- No user data transmitted

### Deployment Considerations

#### Environment Variables

No environment-specific configuration required for alerts.

#### Build Process

- TypeScript compilation validates interfaces
- SCSS compilation generates CSS modules
- Next.js optimizes images automatically

#### CDN Considerations

- Alert images served through Next.js Image component
- Automatic optimization and WebP conversion
- Responsive image generation

### Monitoring and Analytics

#### Error Tracking

GraphQL errors are logged to console and can be captured by error tracking services:

```typescript
console.error('GraphQL Error:', queryError)
```

#### Usage Analytics

Consider tracking:

- Alert dismissal rates
- Modal interaction rates
- Button click-through rates

### Future Enhancements

#### Potential Improvements

1. **A/B Testing**: Support for multiple alert variants
2. **Scheduling**: Time-based alert display
3. **Targeting**: User role-based alert visibility
4. **Analytics**: Built-in interaction tracking
5. **Animation**: Enhanced modal transitions
6. **Accessibility**: Improved screen reader support

#### Migration Path

When updating the alerts system:

1. Update TypeScript interfaces first
2. Modify GraphQL queries
3. Update component implementations
4. Test cookie compatibility
5. Update documentation

### Troubleshooting

#### Common Issues

1. **Alerts not appearing**

   - Check WordPress alert status
   - Verify GraphQL query response
   - Check browser console for errors

2. **Dismissal not persisting**

   - Verify cookie settings in browser
   - Check cookie expiration dates
   - Ensure consistent cookie naming

3. **Modal not showing on specific pages**

   - Verify `popupVisibilityPage` field value
   - Check current page slug matching logic
   - Test with browser developer tools

4. **Styling issues**
   - Verify SCSS module imports
   - Check CSS class name generation
   - Test responsive breakpoints

#### Debug Tools

Use browser developer tools to debug:

```javascript
// Check current alerts data
console.log(window.__APOLLO_CLIENT__.cache.data.data)

// Check cookie values
document.cookie.split(';').filter((c) => c.includes('dismissed'))

// Check current page slug
window.location.pathname.split('/').pop()
```

### Integration Points

#### Application Level (`_app.jsx`)

The alerts system is integrated at the application level through the `CustomSettingsProvider`:

```jsx
<CustomSettingsProvider>
  <MenuProvider>
    <WordPressProvider value={wp}>
      <Component {...pageProps} />
    </WordPressProvider>
  </MenuProvider>
</CustomSettingsProvider>
```

This ensures alert data is available to all pages and components.

#### Layout Level (`Layout.js`)

Alert components are rendered in the main layout:

```jsx
<main>
  <AlertBar />        {/* Renders within main content */}
  {children}
</main>
<HomepageModal />     {/* Renders as overlay */}
```

This ensures alerts appear consistently across all pages.

#### WordPress Integration

Alerts are managed as a custom post type in WordPress with the following structure:

- **Post Type**: `alert`
- **Status**: Must be `publish` to display
- **Custom Fields**: Managed through ACF or similar
- **GraphQL**: Exposed through WPGraphQL plugin

## Conclusion

The alerts feature provides a robust, type-safe system for displaying notifications across the Wilmington College website. The implementation follows React best practices, provides excellent performance, and maintains backward compatibility while supporting future enhancements.

Key strengths of the implementation:

- **Type Safety**: Comprehensive TypeScript interfaces
- **Performance**: Efficient GraphQL polling and cookie management
- **User Experience**: Persistent dismissal state and responsive design
- **Developer Experience**: Extensive documentation and JSDoc comments
- **Maintainability**: Modular architecture with clear separation of concerns
