import { searchClient } from '@/lib/algolia/connector'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { Configure, InstantSearch, SearchBox } from 'react-instantsearch-dom'
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
 * @param  {boolean} props.showResults    Whether to display search results.
 * @return {Element}                      The Search component.
 */
export default function Search({
  indexName,
  query,
  useHistory = true,
  onSearchStateChange,
  showResults = true,
  placeholder = 'Enter search term...'
}) {
  const storageName = indexName // Local Storage Name - set to algolia index.
  const historyLength = 6 // Max amount of history items to save to local storage.
  const hitsPerPage = 6 // Amount of hit to render in drop results.
  const [searchState, setSearchState] = useState(query)
  const [searchHistory, setSearchHistory] = useState([])
  const [displayHistory, setDisplayHistory] = useState(0)
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
          submit={<MdOutlineSearch />}
          defaultRefinement={query || null}
          translations={{
            submitTitle: 'Submit Search Query.',
            resetTitle: 'Clear Search Query',
            placeholder: placeholder
          }}
        />
      </div>
      {showResults && (
        <Results
          displayHistory={displayHistory}
          searchHistory={searchHistory}
          clearLocalStorage={clearLocalStorage}
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
  showResults: PropTypes.bool
}
