import React, { useEffect } from 'react'
import { Hits, useInstantSearch } from 'react-instantsearch'
// import * as styles from '../AlgoliaSearch.module.scss'
import buildSearchUrl from '../functions/buildSearchUrl'
import searchClick from '../functions/searchClick'
import History from './History'
import Hit from './Hit'

/**
 * Component for rendering Algolia `Hits` and search `History` components.
 */
const Results = ({
  displayHistory = true,
  searchHistory,
  clearLocalStorage,
  resultsContainerRef,
  onResultsChange
}) => {
  const { results } = useInstantSearch({
    future: {
      preserveSharedStateOnUnmount: true
    }
  })

  // Notify parent component of the number of results actually displayed
  useEffect(() => {
    if (onResultsChange) {
      const count =
        results && results.hits && results.hits.length > 0
          ? results.hits.length // Number of results actually rendered, not total hits
          : displayHistory
            ? searchHistory.length
            : 0
      onResultsChange(count)
    }
  }, [results, searchHistory, displayHistory, onResultsChange])

  return (
    <div className="dropMenuResults" ref={resultsContainerRef}>
      {results && results.nbHits > 0 ? (
        <Hits className="resultsHits" hitComponent={Hit} />
      ) : (
        displayHistory && (
          <History
            history={searchHistory}
            searchClick={searchClick}
            clearLocalStorage={clearLocalStorage}
            buildSearchUrl={buildSearchUrl}
          />
        )
      )}
    </div>
  )
}

export default Results
