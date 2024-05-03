import RichText from '@/components/atoms/RichText'
import PropTypes from 'prop-types'
import React from 'react'
import { connectStateResults, InfiniteHits } from 'react-instantsearch-dom'
import PostType from '../facets/PostType'
import CustomClearRefinements from '../refinements/CustomClearRefinements'
import Hit from './Hit'
import NoResults from './NoResults'

// used for renaming the facets. BH-71
const transformItems = (items) => {
  return items.map((item) => ({
    ...item,
    label: item.label === 'Programs' ? 'Academics' : item.label
  }))
}
/**
 * Refinement config passed into Algolia facets.
 */
const refinements = {
  limit: 2,
  transformItems: transformItems,
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
      {searchResults?.nbHits ? (
        <>
          <div className="resultsHeader">
            {/* <div className="resultsHeader"> */}
            <RichText tag="h1">Search Results</RichText>
            <div className="resultsHeaderContent">
              <p className="total">
                <span>{searchResults.nbHits} Results</span> for{' '}
                {searchResults.query}
              </p>
              {/* <Sort index={indexName} /> */}
            </div>
          </div>
          <aside className="results">
            <div className="filterPanel">
              <PostType refinements={refinements} />
              <CustomClearRefinements clearsQuery={true} />
            </div>
            <div className="content">
              <InfiniteHits
                className="aisHits"
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
