import RichText from '@/components/atoms/RichText'
import PropTypes from 'prop-types'
import React from 'react'
import { connectStateResults, InfiniteHits } from 'react-instantsearch-dom'
import styles from '../AlgoliaResults.module.scss'
import PostType from '../facets/PostType'
import Sort from '../facets/Sort'
import CustomClearRefinements from '../refinements/CustomClearRefinements'
import Hit from './Hit'
import NoResults from './NoResults'

/**
 * Refinement config passed into Algolia facets.
 */
const refinements = {
  limit: 3,
  translations: {
    showMore(expanded) {
      return expanded ? 'Less' : 'More'
    }
  }
}

/**
 * Component for rendering search results.
 */
const SearchResults = connectStateResults(({ searchResults, indexName }) => {
  return (
    <>
      {searchResults && searchResults.nbHits ? (
        <>
          <div className={styles.resultsHeader}>
            {/* <div className="resultsHeader"> */}
            <RichText tag="h1">Search Results</RichText>
            <div className={styles.resultsHeaderContent}>
              <p className={styles.total}>
                <span>{searchResults.nbHits} Results</span> for{' '}
                {searchResults.query}
              </p>
              <Sort index={indexName} />
            </div>
          </div>
          <aside className={styles.results}>
            <div className={styles.filterPanel}>
              <PostType refinements={refinements} />
              <CustomClearRefinements clearsQuery={true} />
            </div>
            <div className={styles.content}>
              <InfiniteHits
                className={styles.aisHits}
                hitComponent={Hit}
                translations={{
                  loadMore: 'Load More'
                }}
              />
            </div>
          </aside>
        </>
      ) : (
        <></>
      )}
      {searchResults && searchResults.nbHits === 0 && (
        <NoResults query={searchResults.query} />
      )}
    </>
  )
})
export default SearchResults

SearchResults.propTypes = {
  searchResults: PropTypes.any,
  indexName: PropTypes.string
}
