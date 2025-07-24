# Alerts Feature Documentation

## Overview

The Alerts Feature provides a comprehensive system for displaying important notifications to users across the Wilmington College website. It supports two types of alerts:

1. **Alert Bar**: A dismissible notification bar that appears at the top of every page
2. **Modal Popup**: A dismissible modal that can appear either globally or on specific pages

## Architecture

The alerts system follows a modular architecture with the following components:

### Core Components

- **AlertsProvider**: React context provider that manages alert state and data fetching
- **AlertBar**: Component that renders alert bars at the top of pages
- **HomepageModal**: Component that renders popup modals
- **cookieUtils**: Utility functions for managing browser cookies

### Data Flow

```
WordPress CMS → GraphQL → AlertsProvider → Alert Components → User Interaction → Cookie Storage
```

## Features

### Alert Bar Features

- Displays at the top of every page when published
- Supports custom styling based on WordPress tags
- Includes optional button with custom label and URL
- Dismissible with cookie persistence
- Only shows the most recently published alert bar

### Modal Popup Features

- Can be displayed globally or on specific pages
- Supports rich content with HTML formatting
- Optional image display
- Dismissible with cookie persistence
- Only shows the most recently published popup modal

### Shared Features

- Cookie-based dismissal persistence (30-day expiration)
- Real-time updates via GraphQL polling (5-minute intervals)
- TypeScript support with comprehensive type definitions
- Responsive design for all device types

## Usage

### Setting up Alerts

1. **Add AlertsProvider to your app**:

```tsx
import { AlertsProvider } from '@/functions/contextProviders/AlertsProvider'

function MyApp({ Component, pageProps }) {
  return (
    <AlertsProvider>
      <Component {...pageProps} />
    </AlertsProvider>
  )
}
```

2. **Add Alert Components to your layout**:

```tsx
import AlertBar from '@/components/organisms/AlertBar/AlertBar'
import HomepageModal from '@/components/HomepageModal'

function Layout({ children }) {
  return (
    <>
      <AlertBar />
      {children}
      <HomepageModal />
    </>
  )
}
```

### Using the Alerts Context

```tsx
import { useAlerts } from '@/functions/contextProviders/AlertsProvider'

function MyComponent() {
  const { alerts, dismissAlert, isDismissed } = useAlerts()

  // Access current alerts
  const alertBarData = alerts.find((alert) => alert.alertType === 'alert-bar')
  const modalData = alerts.find((alert) => alert.alertType === 'popup-modal')

  // Check if an alert is dismissed
  const isAlertDismissed = isDismissed(alertId)

  // Dismiss an alert programmatically
  const handleDismiss = () => {
    dismissAlert(alertId)
  }
}
```

## WordPress Configuration

### Alert Fields

Each alert in WordPress should have the following fields:

#### Common Fields

- `id`: Unique identifier
- `status`: Publication status ('publish' to display)
- `date`: Publication date
- `alertType`: Either 'alert-bar' or 'popup-modal'
- `buttonLabel`: Text for the action button
- `buttonUrl`: URL for the action button

#### Alert Bar Specific Fields

- `alertMsgTitle`: Main alert message
- `alertMessage`: Additional alert content
- `alertButtonLabel`: Legacy button label field
- `alertButtonUri`: Legacy button URL field
- `tags`: WordPress tags for styling

#### Popup Modal Specific Fields

- `popupTitle`: Modal title
- `popupContent`: Modal content (supports HTML)
- `popupVisibilityPage`: Page slug for page-specific display (null for global)
- `popupImage`: Optional image object with `sourceUrl`, `altText`, and `id`

### GraphQL Query

The system uses the following GraphQL query to fetch alerts:

```graphql
query GetAlerts {
  alerts {
    nodes {
      id
      alertMsgTitle
      alertType
      alertMessage
      alertButtonLabel
      alertButtonUri
      buttonLabel
      buttonUrl
      content
      date
      popupContent
      popupTitle
      popupVisibilityPage
      popupImage {
        altText
        id
        sourceUrl
      }
      status
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

## Cookie Management

The alerts system uses cookies to persist user dismissal preferences:

### Cookie Format

- **Alert Bar**: `dismissedAlert_{alertId}=true`
- **Modal**: `dismissedModal_{modalId}=true`

### Cookie Properties

- **Expiration**: 30 days
- **Path**: `/` (site-wide)
- **Secure**: Follows site security settings

## Styling

### Alert Bar Styling

- Base styles in `AlertBar.module.scss`
- Tag-based styling support (e.g., `.urgent`, `.info`)
- Responsive design with mobile-first approach

### Modal Styling

- Base styles in `HomepageModal.module.css`
- Two-column layout with optional image
- Responsive design with mobile adaptations

## Performance Considerations

- **GraphQL Polling**: 5-minute intervals to check for new alerts
- **Cookie Optimization**: Minimal cookie usage with efficient parsing
- **Conditional Rendering**: Components only render when necessary
- **Image Optimization**: Next.js Image component for modal images

## Browser Support

The alerts feature supports all modern browsers with the following considerations:

- **Cookies**: Graceful degradation when cookies are disabled
- **JavaScript**: Requires JavaScript for full functionality
- **CSS**: Progressive enhancement with fallback styles

## Troubleshooting

### Common Issues

1. **Alerts not appearing**: Check WordPress alert status and publication date
2. **Dismissal not persisting**: Verify cookie settings and browser support
3. **Page-specific modals not showing**: Check `popupVisibilityPage` field matches current page slug
4. **Styling issues**: Verify SCSS modules are properly imported

### Debug Mode

To debug alerts, check the browser console for:

- GraphQL query responses
- Cookie values
- Component render states

## Testing

The alerts feature includes comprehensive testing:

### Unit Tests

- Cookie utility functions
- Alert context provider
- Component rendering logic

### Integration Tests

- GraphQL query integration
- Cookie persistence across page loads
- Component interaction with context

### Manual Testing Checklist

- [ ] Alert bar appears on all pages when published
- [ ] Modal appears on correct pages based on visibility settings
- [ ] Dismissal persists across page reloads
- [ ] Only most recent alert of each type is displayed
- [ ] Buttons work correctly with proper URLs
- [ ] Responsive design works on all device sizes

## Migration Notes

If migrating from a previous alert system:

1. Update WordPress alert fields to match new schema
2. Test existing alerts with new component structure
3. Verify cookie migration if changing cookie names
4. Update any custom styling to use new CSS modules

## Documentation

This README provides user-facing documentation for the alerts feature. For detailed technical implementation information, see:

- **[Technical Documentation](./TECHNICAL_DOCUMENTATION.md)** - Comprehensive technical details for developers
- **[JSDoc Comments](../../../functions/contextProviders/AlertsProvider.tsx)** - Inline code documentation
- **[Type Definitions](../../../types/alerts.ts)** - TypeScript interface definitions

## Contributing

When contributing to the alerts feature:

1. Follow TypeScript best practices
2. Add JSDoc comments to all functions
3. Update tests for new functionality
4. Verify responsive design on all breakpoints
5. Test cookie functionality across browsers
6. Update both README files when adding new features
7. Ensure all TypeScript interfaces are properly documented
