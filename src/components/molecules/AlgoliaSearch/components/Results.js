import React from 'react'
import {connectStateResults, Hits} from 'react-instantsearch-dom'
import * as styles from '../AlgoliaSearch.module.scss'
import buildSearchUrl from '../functions/buildSearchUrl'
import searchClick from '../functions/searchClick'
import History from './History'
import Hit from './Hit'

/**
 * Component for rendering Algolia `Hits` and search `History` components.
 */
const Results = connectStateResults(
  ({
    searchResults,
    searchState,
    displayHistory,
    searchHistory,
    clearLocalStorage
  }) => {
    return (
      <div className={styles.dropMenu}>
        {searchState &&
        searchState.query &&
        searchState.query.length > 0 &&
        searchResults &&
        searchResults.nbHits > 0 ? (
          <Hits className={styles.hits} hitComponent={Hit} />
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
)
export default Results
