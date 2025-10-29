import { searchClient } from '@/lib/algolia/connector'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { Configure, InstantSearch, SearchBox } from 'react-instantsearch'
import { deleteLocalStorage } from '../functions/localStorage'
import searchSubmit from '../functions/searchSubmit'
import Results from './Results'

/**
 * Render the Search component.
 *
 * @param  {object}  props                The component attributes as props.
 * @param  {string}  props.indexName      The search index name stored in Algolia.
 * @param  {string}  props.query          The search query.
 * @param  {boolean} props.useHistory     Whether to display search history.
 * @param  {function} props.onSearchStateChange Callback for search state changes.
 * @param  {function} props.onCloseModal  Callback to close the search modal.
 * @param  {boolean} props.showResults    Whether to display search results.
 * @return {Element}                      The Search component.
 */
export default function Search({
  indexName,
  query,
  useHistory = true,
  onSearchStateChange,
  onCloseModal,
  showResults = true,
  placeholder = 'Enter search term...'
}) {
  const storageName = indexName // Local Storage Name - set to algolia index.
  const historyLength = 6 // Max amount of history items to save to local storage.
  const hitsPerPage = 6 // Amount of hit to render in drop results.
  const [searchState, setSearchState] = useState(query)
  const [searchHistory, setSearchHistory] = useState([])
  const [displayHistory, setDisplayHistory] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [totalResults, setTotalResults] = useState(0)
  const resultsContainerRef = useRef(null)
  const config = {
    query,
    hitsPerPage
  }

  /**
   * Show/Hide the search history.
   *
   * @return {boolean}
   */
  const showHistory = useCallback(() => {
    setDisplayHistory(searchState === '')
  }, [searchState])

  // Track changes in `searchState`.
  useEffect(() => {
    showHistory()
  }, [searchState, showHistory])

  // Get search history on initial page load.
  useEffect(() => {
    if (localStorage && useHistory) {
      const history = localStorage.getItem(storageName)
      if (history) {
        const searchHistory = JSON.parse(history)
        setSearchHistory(searchHistory)
      }
    }
  }, [storageName, useHistory])

  // Notify parent component of search state changes.
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(searchState)
    }
  }, [searchState, onSearchStateChange])

  /**
   * Delete recent searches and clear history.
   */
  function clearLocalStorage() {
    deleteLocalStorage(storageName)
    setSearchHistory([])
  }

  /**
   * Reset focused index when search state changes.
   */
  useEffect(() => {
    setFocusedIndex(-1)
  }, [searchState])

  /**
   * Handle keyboard navigation through search results.
   *
   * @param {KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = useCallback(
    (e) => {
      // Only handle keyboard navigation when results are visible
      if (!showResults || totalResults === 0) return

      // Only handle if the event target is within the search input or results area
      const searchInput = e.target.closest('.ais-SearchBox')
      const searchResults = e.target.closest('.dropMenuResults')
      if (!searchInput && !searchResults) return

      const key = e.key

      // Handle Escape key
      if (key === 'Escape') {
        e.preventDefault()
        // If user is navigating results, return focus to search input
        if (focusedIndex >= 0) {
          setFocusedIndex(-1)
        }
        // If user is already on search input, close the modal
        else if (focusedIndex === -1 && onCloseModal) {
          onCloseModal()
        }
      }
      // Handle ArrowDown
      else if (key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prevIndex) => {
          const nextIndex = prevIndex < totalResults - 1 ? prevIndex + 1 : 0
          return nextIndex
        })
      }
      // Handle ArrowUp
      else if (key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prevIndex) => {
          // If at first result (0), return to search input (-1)
          if (prevIndex === 0) {
            return -1
          }
          // If at search input (-1), wrap to last result
          else if (prevIndex === -1) {
            return totalResults - 1
          }
          // Otherwise move up one result
          else if (prevIndex > 0) {
            return prevIndex - 1
          }
          // Edge case: if somehow negative (shouldn't happen), go to first result
          else {
            return 0
          }
        })
      }
      // Handle Tab (navigate forward through results)
      else if (key === 'Tab' && !e.shiftKey && focusedIndex >= -1) {
        // Allow natural tab behavior through the results
        // The browser will handle focus on the links
      }
      // Handle Enter on focused result
      else if (key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        const resultLinks = resultsContainerRef.current?.querySelectorAll(
          '.ais-Hits-item .button, .history button'
        )
        if (resultLinks && resultLinks[focusedIndex]) {
          resultLinks[focusedIndex].click()
        }
      }
    },
    [focusedIndex, totalResults, showResults, onCloseModal]
  )

  /**
   * Add keyboard event listener to the search container.
   */
  useEffect(() => {
    // Only attach listener when results container exists and is mounted
    if (!resultsContainerRef.current) return

    const searchContainer = resultsContainerRef.current.closest(
      '.searchContainer'
    )
    if (!searchContainer) return

    searchContainer.addEventListener('keydown', handleKeyDown)
    return () => {
      searchContainer.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  /**
   * Focus the appropriate element when focusedIndex changes.
   * Uses requestAnimationFrame to ensure DOM is ready.
   */
  useEffect(() => {
    // Use requestAnimationFrame to ensure React has finished rendering
    const frameId = requestAnimationFrame(() => {
      if (focusedIndex === -1) {
        // Query the input directly each time (don't rely on refs)
        const searchInput = document.querySelector(
          '.searchContainer .ais-SearchBox-input'
        )
        if (searchInput) {
          searchInput.focus()
        }
      } else if (focusedIndex >= 0 && resultsContainerRef.current) {
        // Focus the result at focusedIndex
        const resultLinks = resultsContainerRef.current.querySelectorAll(
          '.ais-Hits-item .button, .history button'
        )
        if (resultLinks[focusedIndex]) {
          resultLinks[focusedIndex].focus()
        }
      }
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [focusedIndex])

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Configure {...config} />
      <div className="searchBox">
        <SearchBox
          /* eslint-disable */
          autoFocus={true}
          /* eslint-enable */
          onSubmit={(e) =>
            searchSubmit(
              e,
              setSearchState,
              searchState,
              storageName,
              historyLength
            )
          }
          onFocus={() => showHistory()}
          onKeyUp={(e) => {
            setSearchState(e.currentTarget.value)
          }}
          onReset={() => {
            setSearchState('')
          }}
          submitIconComponent={() => <MdOutlineSearch />}
          /* TODO (Codemod generated): Move this into `InstantSearch`'s `initialUiState` prop.
          See https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/react/#default-refinements */
          defaultRefinement={query || null}
          translations={{
            submitButtonTitle: 'Submit Search Query.',
            resetButtonTitle: 'Clear Search Query'
          }}
          placeholder={placeholder}
        />
      </div>
      {showResults && (
        <Results
          displayHistory={displayHistory}
          searchHistory={searchHistory}
          clearLocalStorage={clearLocalStorage}
          resultsContainerRef={resultsContainerRef}
          onResultsChange={setTotalResults}
        />
      )}
    </InstantSearch>
  )
}

Search.propTypes = {
  indexName: PropTypes.string.isRequired,
  query: PropTypes.string,
  useHistory: PropTypes.bool,
  onSearchStateChange: PropTypes.func,
  onCloseModal: PropTypes.func,
  showResults: PropTypes.bool
}
