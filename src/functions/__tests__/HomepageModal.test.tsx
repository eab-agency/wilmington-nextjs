import HomepageModal from '@/components/HomepageModal'
import { AlertsContext } from '@/functions/contextProviders/AlertsProvider'
import { PopupModalData } from '@/types/alerts'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/test-page'
  })
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />
  }
}))

describe('HomepageModal', () => {
  // Sample modal data for testing
  const mockGlobalModal: PopupModalData = {
    id: 1,
    status: 'publish',
    date: '2023-01-01',
    alertType: 'popup-modal',
    popupTitle: 'Global Modal Title',
    popupContent: 'Global modal content',
    popupVisibilityPage: null,
    buttonLabel: 'Learn More',
    buttonUrl: 'https://example.com',
    popupImage: {
      altText: 'Test image',
      id: 1,
      sourceUrl: '/test-image.jpg'
    }
  }

  const mockPageSpecificModal: PopupModalData = {
    id: 2,
    status: 'publish',
    date: '2023-01-01',
    alertType: 'popup-modal',
    popupTitle: 'Page Specific Modal Title',
    popupContent: 'Page specific modal content',
    popupVisibilityPage: 'test-page',
    buttonLabel: 'Learn More',
    buttonUrl: 'https://example.com',
    popupImage: null
  }

  // Mock context values
  const mockDismissAlert = jest.fn()
  const mockIsDismissed = jest.fn().mockReturnValue(false)

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders global modal correctly', async () => {
    render(
      <AlertsContext.Provider
        value={{
          alerts: [mockGlobalModal],
          dismissAlert: mockDismissAlert,
          isDismissed: mockIsDismissed
        }}
      >
        <HomepageModal />
      </AlertsContext.Provider>
    )

    // Wait for the modal to appear (due to the setTimeout in useEffect)
    await waitFor(() => {
      expect(screen.getByText('Global Modal Title')).toBeInTheDocument()
    })

    expect(screen.getByText('Global modal content')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
    expect(screen.getByAltText('Test image')).toBeInTheDocument()
  })

  test('renders page-specific modal correctly', async () => {
    render(
      <AlertsContext.Provider
        value={{
          alerts: [mockPageSpecificModal],
          dismissAlert: mockDismissAlert,
          isDismissed: mockIsDismissed
        }}
      >
        <HomepageModal />
      </AlertsContext.Provider>
    )

    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByText('Page Specific Modal Title')).toBeInTheDocument()
    })

    expect(screen.getByText('Page specific modal content')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
    // No image in this modal
    expect(screen.queryByAltText('Test image')).not.toBeInTheDocument()
  })

  test('dismisses modal when close button is clicked', async () => {
    render(
      <AlertsContext.Provider
        value={{
          alerts: [mockGlobalModal],
          dismissAlert: mockDismissAlert,
          isDismissed: mockIsDismissed
        }}
      >
        <HomepageModal />
      </AlertsContext.Provider>
    )

    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByText('Global Modal Title')).toBeInTheDocument()
    })

    // Click the close button
    fireEvent.click(screen.getByLabelText('Close'))

    // Wait for the dismissal timeout
    await waitFor(
      () => {
        expect(mockDismissAlert).toHaveBeenCalledWith(mockGlobalModal.id)
      },
      { timeout: 400 }
    )
  })

  test('does not render modal when it is dismissed', () => {
    const isDismissedTrue = jest.fn().mockReturnValue(true)

    render(
      <AlertsContext.Provider
        value={{
          alerts: [mockGlobalModal],
          dismissAlert: mockDismissAlert,
          isDismissed: isDismissedTrue
        }}
      >
        <HomepageModal />
      </AlertsContext.Provider>
    )

    // Modal should not be rendered
    expect(screen.queryByText('Global Modal Title')).not.toBeInTheDocument()
  })

  test('does not render modal when status is not publish', () => {
    const unpublishedModal = {
      ...mockGlobalModal,
      status: 'draft'
    }

    render(
      <AlertsContext.Provider
        value={{
          alerts: [unpublishedModal],
          dismissAlert: mockDismissAlert,
          isDismissed: mockIsDismissed
        }}
      >
        <HomepageModal />
      </AlertsContext.Provider>
    )

    // Modal should not be rendered
    expect(screen.queryByText('Global Modal Title')).not.toBeInTheDocument()
  })

  test('renders modal with HTML content correctly', async () => {
    const modalWithHtmlContent = {
      ...mockGlobalModal,
      popupContent: '<p>This is <strong>HTML</strong> content</p>'
    }

    render(
      <AlertsContext.Provider
        value={{
          alerts: [modalWithHtmlContent],
          dismissAlert: mockDismissAlert,
          isDismissed: mockIsDismissed
        }}
      >
        <HomepageModal />
      </AlertsContext.Provider>
    )

    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByText('Global Modal Title')).toBeInTheDocument()
    })

    // Check that HTML is rendered correctly
    expect(screen.getByText('This is', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('HTML', { exact: false })).toBeInTheDocument()
  })
})
