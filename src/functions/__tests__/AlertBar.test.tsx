import AlertBar from '@/components/organisms/AlertBar/AlertBar'
import { AlertsContext } from '@/functions/contextProviders/AlertsProvider'
import { fireEvent, render, screen } from '@testing-library/react'

// Mock the AlertsContext
const mockDismissAlert = jest.fn()
const mockIsDismissed = jest.fn().mockReturnValue(false)

const createWrapper = (alerts: any[] = []) => {
  return ({ children }: { children: React.ReactNode }) => (
    <AlertsContext.Provider
      value={{
        alerts,
        dismissAlert: mockDismissAlert,
        isDismissed: mockIsDismissed
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}

describe('AlertBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when there are no alerts', () => {
    const { container } = render(<AlertBar />, {
      wrapper: createWrapper([])
    })
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when the alert is dismissed', () => {
    mockIsDismissed.mockReturnValueOnce(true)
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: 'This is a test alert',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: '',
        buttonUrl: '',
        tags: { edges: [] }
      }
    ]

    const { container } = render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })
    expect(container.firstChild).toBeNull()
  })

  it('renders the alert bar with title', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: '',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: '',
        buttonUrl: '',
        tags: { edges: [] }
      }
    ]

    render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    expect(screen.getByText('Test Alert')).toBeInTheDocument()
  })

  it('renders the alert bar with message', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: 'This is a test alert',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: '',
        buttonUrl: '',
        tags: { edges: [] }
      }
    ]

    render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    expect(screen.getByText('This is a test alert')).toBeInTheDocument()
  })

  it('renders the alert bar with button', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: '',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: 'Click Me',
        buttonUrl: 'https://example.com',
        tags: { edges: [] }
      }
    ]

    render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    const button = screen.getByText('Click Me')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('A')
    expect(button).toHaveAttribute('href', 'https://example.com')
  })

  it('renders the alert bar with legacy button fields', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: '',
        alertButtonLabel: 'Legacy Button',
        alertButtonUri: 'https://legacy-example.com',
        buttonLabel: '',
        buttonUrl: '',
        tags: { edges: [] }
      }
    ]

    render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    const button = screen.getByText('Legacy Button')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('A')
    expect(button).toHaveAttribute('href', 'https://legacy-example.com')
  })

  it('calls dismissAlert when close button is clicked', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: '',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: '',
        buttonUrl: '',
        tags: { edges: [] }
      }
    ]

    render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(mockDismissAlert).toHaveBeenCalledWith(1)
  })

  it('applies tag class when tag is present', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'publish',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: '',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: '',
        buttonUrl: '',
        tags: {
          edges: [
            {
              node: {
                name: 'warning'
              }
            }
          ]
        }
      }
    ]

    const { container } = render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    // This is a bit of a hack since we can't directly test for class names with jest-dom
    // We're checking if the container has a child with a class that includes 'warning'
    const alertBarElement = container.firstChild as HTMLElement
    expect(alertBarElement.className).toContain('warning')
  })

  it('ignores non-alert-bar type alerts', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'popup-modal',
        status: 'publish',
        date: '2023-01-01',
        popupTitle: 'Test Modal',
        popupContent: 'This is a test modal',
        popupVisibilityPage: null,
        buttonLabel: '',
        buttonUrl: '',
        popupImage: null
      }
    ]

    const { container } = render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    expect(container.firstChild).toBeNull()
  })

  it('ignores non-published alerts', () => {
    const mockAlerts = [
      {
        id: 1,
        alertType: 'alert-bar',
        status: 'draft',
        date: '2023-01-01',
        alertMsgTitle: 'Test Alert',
        alertMessage: '',
        alertButtonLabel: '',
        alertButtonUri: '',
        buttonLabel: '',
        buttonUrl: '',
        tags: { edges: [] }
      }
    ]

    const { container } = render(<AlertBar />, {
      wrapper: createWrapper(mockAlerts)
    })

    expect(container.firstChild).toBeNull()
  })
})
