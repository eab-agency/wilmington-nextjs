# Alert Dismissal Testing Guide

This guide provides instructions for testing the alert dismissal functionality to ensure that:

1. Dismissing an alert stores the state in a cookie
2. Dismissed alerts don't reappear on page reload
3. Different alerts are tracked separately
4. Each alert type (alert bar and popup modal) is dismissed independently

## Prerequisites

- A running instance of the Wilmington NextJS application
- Access to the WordPress admin to create/modify alerts
- Browser with developer tools

## Test Environment Setup

### 1. Create Multiple Test Alerts

In the WordPress admin:
1. Create at least two different alerts:
   - One alert-bar type alert
   - One popup-modal type alert
2. Make sure both alerts have "publish" status
3. For the popup-modal, you can set one as global and one as page-specific

### 2. Access Testing Tools

Two testing approaches are available:

**A. Browser Console Method:**
1. Open the website in your browser
2. Open browser developer tools (F12 or Right-click > Inspect)
3. Navigate to the Console tab
4. Copy and paste the content of `/scripts/alert-dismissal-tests.js` into the console
5. Run the function `alertDismissalTests()`

**B. Test Page Method:**
1. Access the test page at `/alert-dismissal-tests.html`
2. Follow the on-screen instructions to test each aspect of alert dismissal

## Test Procedures

### Test 1: Verify Alert Cookies on Dismissal

1. Load the website with alerts visible
2. Check for existing cookies with prefix `dismissedAlert_`
3. Dismiss an alert by clicking its close button
4. Check cookies again to verify a new cookie was created
5. The cookie name should be `dismissedAlert_[ID]` with value `true`

### Test 2: Verify Persistence After Reload

1. Dismiss an alert (if not already dismissed)
2. Reload the page
3. Verify the dismissed alert does not reappear
4. Check that the dismissal cookie still exists

### Test 3: Verify Different Alerts Are Tracked Separately

1. Ensure you have at least two different alerts visible
2. Dismiss one alert
3. Verify only that specific alert is dismissed
4. Verify a cookie was created specifically for that alert
5. Dismiss another alert
6. Verify each alert has its own separate cookie

### Test 4: Verify Independent Dismissal

1. Set up both an alert bar and a popup modal to be visible at the same time
2. Dismiss only the popup modal by clicking its close button
3. Verify that the popup modal disappears but the alert bar remains visible
4. Check that only a cookie for the popup modal was created
5. Now dismiss the alert bar
6. Verify that both the popup modal and alert bar are now dismissed
7. Check that separate cookies exist for each alert type

## Cookie Structure

Each dismissed alert creates a cookie with:
- Name: `dismissedAlert_[alertId]`
- Value: `true`
- Path: `/`
- Expiration: 30 days from creation

## Troubleshooting

If tests fail, check:
1. Cookie storage permissions in your browser
2. Ensure the alert IDs are correctly associated with cookies
3. Verify the cookie expiration is set properly
4. Check console for any JavaScript errors

## Expected Results

✅ **Test 1:** After dismissing an alert, a cookie is created with the alert's ID
✅ **Test 2:** After reload, dismissed alerts remain hidden
✅ **Test 3:** Different alerts have separate dismissal cookies
✅ **Test 4:** Alert bar and popup modal can be dismissed independently
