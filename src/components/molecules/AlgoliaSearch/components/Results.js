import React from 'react'
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
  clearLocalStorage
}) => {
  const { results } = useInstantSearch({
    future: {
      preserveSharedStateOnUnmount: true
    }
  })
  return (
    <div className="dropMenuResults">
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
