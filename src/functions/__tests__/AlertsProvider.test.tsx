import {
  AlertsProvider,
  useAlerts
} from '@/functions/contextProviders/AlertsProvider'
import { Alert } from '@/types/alerts'
import { MockedProvider } from '@apollo/client/testing'
import {
  act,
  render,
  renderHook,
  screen,
  waitFor
} from '@testing-library/react'
import { gql } from 'graphql-tag'
import React from 'react'
import { getCookie, setCookie } from '../cookieUtils'

// Mock the cookieUtils module
jest.mock('../cookieUtils', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  removeCookie: jest.fn()
}))

// GraphQL query used in the AlertsProvider
const ALERTS_QUERY = gql`
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
`

// Mock data for testing
const mockAlerts = {
  alerts: {
    nodes: [
      {
        id: 1,
        alertMsgTitle: 'Test Alert Bar',
        alertType: 'alert-bar',
        alertMessage: 'This is a test alert message',
        alertButtonLabel: 'Learn More',
        alertButtonUri: 'https://example.com',
        buttonLabel: 'Learn More',
        buttonUrl: 'https://example.com',
        content: null,
        date: '2023-01-01T00:00:00',
        popupContent: null,
        popupTitle: null,
        popupVisibilityPage: null,
        popupImage: null,
        status: 'publish',
        tags: {
          edges: []
        }
      },
      {
        id: 2,
        alertMsgTitle: null,
        alertType: 'popup-modal',
        alertMessage: null,
        alertButtonLabel: null,
        alertButtonUri: null,
        buttonLabel: 'Learn More',
        buttonUrl: 'https://example.com',
        content: null,
        date: '2023-01-02T00:00:00',
        popupContent: 'This is a test popup content',
        popupTitle: 'Test Popup Modal',
        popupVisibilityPage: 'home',
        popupImage: {
          altText: 'Test Image',
          id: 123,
          sourceUrl: 'https://example.com/image.jpg'
        },
        status: 'publish',
        tags: {
          edges: []
        }
      },
      {
        id: 3,
        alertMsgTitle: 'Older Alert Bar',
        alertType: 'alert-bar',
        alertMessage: 'This is an older alert message',
        alertButtonLabel: 'Learn More',
        alertButtonUri: 'https://example.com',
        buttonLabel: 'Learn More',
        buttonUrl: 'https://example.com',
        content: null,
        date: '2022-01-01T00:00:00',
        popupContent: null,
        popupTitle: null,
        popupVisibilityPage: null,
        popupImage: null,
        status: 'publish',
        tags: {
          edges: []
        }
      },
      {
        id: 4,
        alertMsgTitle: 'Draft Alert Bar',
        alertType: 'alert-bar',
        alertMessage: 'This is a draft alert message',
        alertButtonLabel: 'Learn More',
        alertButtonUri: 'https://example.com',
        buttonLabel: 'Learn More',
        buttonUrl: 'https://example.com',
        content: null,
        date: '2023-02-01T00:00:00',
        popupContent: null,
        popupTitle: null,
        popupVisibilityPage: null,
        popupImage: null,
        status: 'draft',
        tags: {
          edges: []
        }
      }
    ]
  }
}

// Mock for the Apollo Client
const mocks = [
  {
    request: {
      query: ALERTS_QUERY
    },
    result: {
      data: mockAlerts
    }
  }
]

// Test component that uses the alerts context
const TestComponent = () => {
  const { alerts, dismissAlert, isDismissed } = useAlerts()

  return (
    <div>
      <div data-testid="alert-count">{alerts.length}</div>
      {alerts.map((alert: Alert) => (
        <div key={alert.id} data-testid={`alert-${alert.id}`}>
          <div data-testid={`alert-type-${alert.id}`}>{alert.alertType}</div>
          <button
            data-testid={`dismiss-${alert.id}`}
            onClick={() => dismissAlert(alert.id)}
          >
            Dismiss
          </button>
          <div data-testid={`dismissed-${alert.id}`}>
            {isDismissed(alert.id) ? 'Yes' : 'No'}
          </div>
        </div>
      ))}
    </div>
  )
}

describe('AlertsProvider', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    })
  })

  it('should provide alerts context with the latest published alerts of each type', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AlertsProvider>
          <TestComponent />
        </AlertsProvider>
      </MockedProvider>
    )

    // Wait for the query to complete
    await waitFor(() => {
      expect(screen.getByTestId('alert-count').textContent).toBe('2')
    })

    // Check that we have the latest alert-bar and popup-modal
    expect(screen.getByTestId('alert-1')).toBeInTheDocument()
    expect(screen.getByTestId('alert-2')).toBeInTheDocument()

    // Check that older and draft alerts are not included
    expect(screen.queryByTestId('alert-3')).not.toBeInTheDocument()
    expect(screen.queryByTestId('alert-4')).not.toBeInTheDocument()
  })

  it('should dismiss an alert and save to cookie', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AlertsProvider>
          <TestComponent />
        </AlertsProvider>
      </MockedProvider>
    )

    // Wait for the query to complete
    await waitFor(() => {
      expect(screen.getByTestId('alert-count').textContent).toBe('2')
    })

    // Check that the alert is not dismissed initially
    expect(screen.getByTestId('dismissed-1').textContent).toBe('No')

    // Dismiss the alert
    act(() => {
      screen.getByTestId('dismiss-1').click()
    })

    // Check that the alert is now dismissed
    expect(screen.getByTestId('dismissed-1').textContent).toBe('Yes')

    // Check that setCookie was called with the correct parameters
    expect(setCookie).toHaveBeenCalledWith(
      'dismissedAlert_1',
      'true',
      expect.objectContaining({
        expires: 30,
        path: '/'
      })
    )
  })

  it('should load dismissed alerts from cookies on mount', async () => {
    // Mock document.cookie to include a dismissed alert
    document.cookie = 'dismissedAlert_1=true'

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AlertsProvider>
          <TestComponent />
        </AlertsProvider>
      </MockedProvider>
    )

    // Wait for the query to complete
    await waitFor(() => {
      expect(screen.getByTestId('alert-count').textContent).toBe('2')
    })

    // Check that the alert is marked as dismissed
    expect(screen.getByTestId('dismissed-1').textContent).toBe('Yes')
    expect(screen.getByTestId('dismissed-2').textContent).toBe('No')
  })
})
