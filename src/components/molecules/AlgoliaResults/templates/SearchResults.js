import RichText from '@/components/atoms/RichText'
import PropTypes from 'prop-types'
import React from 'react'
import { InfiniteHits, useInstantSearch } from 'react-instantsearch'
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
  limit: 5,
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
const SearchResults = () => {
  const { results } = useInstantSearch()

  return (
    <>
      {results && results.nbHits > 0 ? (
        <>
          <div className="resultsHeader">
            <RichText tag="h1">Search Results</RichText>
            <div className="resultsHeaderContent">
              <p className="total">
                <span>{results.nbHits} Results</span> for {results.query}
              </p>
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
                showPrevious={false}
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
      {results && results.nbHits === 0 && <NoResults query={results.query} />}
    </>
  )
}
export default SearchResults

SearchResults.propTypes = {
  searchResults: PropTypes.any,
  indexName: PropTypes.string
}
