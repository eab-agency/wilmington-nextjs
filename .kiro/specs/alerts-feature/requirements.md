# Requirements Document

## Introduction

The Alerts Feature will provide the ability to display important notifications to users across the Wilmington College website. The feature will support two types of alerts: a global alert bar that appears at the top of every page, and a modal popup that can be configured to appear on specific pages or globally. Both alert types will be manageable through WordPress, allowing content editors to create, update, and publish alerts as needed. Users will have the ability to dismiss alerts, with their preferences stored in cookies to prevent repeated displays of the same alert.

## Requirements

### Requirement 1: Alert Data Management

**User Story:** As a content editor, I want to create and manage alerts through WordPress, so that I can quickly inform users about important information.

#### Acceptance Criteria

1. WHEN the system fetches data from WordPress THEN it SHALL retrieve all published alerts
2. WHEN an alert has a status of "publish" THEN the system SHALL display it according to its configuration
3. WHEN an alert has a status other than "publish" THEN the system SHALL NOT display it
4. WHEN the system retrieves alerts THEN it SHALL handle both alert-bar and popup-modal types
5. WHEN the system retrives multiple published alerts of the same type (popup-modal or alert-bar) THEN it SHALL only display the most recently published alert of that type. i.e. only one alert-bar should be displayed at a time, and only one popup-modal should be displayed at a time.

### Requirement 2: Alert Bar Implementation

**User Story:** As a site visitor, I want to see important global notifications in an alert bar at the top of the page, so that I'm immediately aware of critical information.

#### Acceptance Criteria

1. WHEN an alert with type "alert-bar" and status "publish" exists THEN the system SHALL display it at the top of every page
2. WHEN an alert bar is displayed THEN the system SHALL show the alert message and any configured button
3. WHEN a user clicks the close button on an alert bar THEN the system SHALL hide the alert and store the dismissed state in a cookie
4. WHEN a user returns to the site after dismissing an alert bar THEN the system SHALL check the cookie and not show the previously dismissed alert
5. WHEN an alert bar has a button configured THEN the system SHALL display the button with the specified label and link
6. Only the most recently published alert bar should be shown.

### Requirement 3: Modal Popup Implementation

**User Story:** As a content editor, I want to create modal popups that can appear on specific pages or globally, so that I can highlight important announcements or promotions.

#### Acceptance Criteria

1. WHEN an alert with type "popup-modal" and status "publish" exists THEN the system SHALL display it as a modal popup
2. WHEN a popup modal has popupVisibilityPage set to null or empty string THEN the system SHALL display it on all pages
3. WHEN a popup modal has popupVisibilityPage set to a specific page slug THEN the system SHALL only display it on that specific page
4. WHEN a popup modal is displayed THEN the system SHALL show the popup title, content, image (if available), and button
5. WHEN a user clicks the close button on a popup modal THEN the system SHALL hide the modal and store the dismissed state in a cookie
6. WHEN a user returns to the site after dismissing a popup modal THEN the system SHALL check the cookie and not show the previously dismissed modal
7. Only the most recently published popup modal should be shown.

### Requirement 4: TypeScript Implementation

**User Story:** As a developer, I want the alerts feature to be implemented in TypeScript, so that it follows the project's code quality standards and provides better type safety.

#### Acceptance Criteria

1. WHEN implementing the HomepageModal component THEN the system SHALL convert it from JavaScript to TypeScript
2. WHEN implementing alert components THEN the system SHALL define proper TypeScript interfaces for all data structures
3. WHEN implementing cookie handling THEN the system SHALL use type-safe methods for storing and retrieving cookie data

### Requirement 5: Integration with Existing Components

**User Story:** As a developer, I want the alerts feature to integrate with existing components, so that we maintain consistency and avoid code duplication.

#### Acceptance Criteria

1. WHEN implementing the alert bar THEN the system SHALL use the existing AlertBar.tsx component
2. WHEN implementing the popup modal THEN the system SHALL use a converted version of HomepageModal.js (converted to TypeScript)
3. WHEN fetching alert data THEN the system SHALL extend the existing CustomSettingsProvider to include the new alert types and fields
