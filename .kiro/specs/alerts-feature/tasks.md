# Implementation Plan

- [ ] 1. Create TypeScript interfaces for alert data types

  - Define interfaces for BaseAlert, AlertBarData, PopupModalData, and Alert union type
  - Define interface for AlertsContextType
  - _Requirements: 4.2_

- [ ] 2. Create cookie utility module

  - Implement setCookie, getCookie, and removeCookie functions with TypeScript support
  - Add proper typing for cookie options
  - Create unit tests for cookie functions
  - _Requirements: 2.3, 2.4, 3.5, 3.6, 4.3_

- [ ] 3. Update GraphQL query for alerts

  - Modify the existing query to include all required fields for both alert types
  - Ensure the query handles the new alert structure
  - _Requirements: 1.1, 1.4_

- [ ] 4. Create AlertsContext provider

  - Implement context provider with alerts state management
  - Add methods for dismissing alerts and checking dismissed state
  - Connect to the GraphQL query to fetch alerts data
  - Implement cookie integration for persisting dismissed alerts
  - _Requirements: 1.2, 1.3, 2.3, 2.4, 3.5, 3.6_

- [ ] 5. Convert HomepageModal.js to TypeScript

  - Rename file to HomepageModal.tsx
  - Add proper TypeScript types and interfaces
  - Refactor to use the new AlertsContext
  - _Requirements: 3.4, 4.1, 5.2_

- [ ] 6. Update HomepageModal component functionality

  - Implement page-specific visibility logic
  - Add support for dynamic content from WordPress
  - Ensure proper handling of the dismiss action
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 7. Update AlertBar component

  - Modify to use the new AlertsContext
  - Update to handle the new alert data structure
  - Ensure proper handling of the dismiss action
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1_

- [ ] 8. Integrate alerts components into the application

  - Add AlertsProvider to the application's provider hierarchy
  - Ensure AlertBar and HomepageModal are rendered at the appropriate level
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 9. Test alert dismissal functionality

  - Verify that dismissing an alert stores the state in a cookie
  - Verify that dismissed alerts don't reappear on page reload
  - Verify that different alerts are tracked separately
  - _Requirements: 2.3, 2.4, 3.5, 3.6_

- [ ] 10. Test page-specific modal functionality

  - Verify that global modals appear on all pages
  - Verify that page-specific modals only appear on the specified pages
  - _Requirements: 3.2, 3.3_

- [ ] 11. Implement alert status filtering

  - Ensure only alerts with "publish" status are displayed
  - Add filtering logic in the AlertsContext
  - _Requirements: 1.2, 1.3_

- [ ] 12. Add documentation
  - Document the alerts feature in the codebase
  - Add JSDoc comments to functions and components
  - Update any existing documentation to reflect the new alerts functionality
  - _Requirements: 4.2, 5.3_
