import { useWordPressContext } from '@/components/common/WordPressProvider'
import { searchResultsClient } from '@/lib/algolia/connector'
import React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import Search from '../AlgoliaSearch/components/Search'
import Department from './facets/Department'
import NoResults from './templates/NoResults'
import SearchResults from './templates/SearchResults'

/**
 * Render the AlgoliaResults component.
 *
 * @param  {object}  props        The component attributes as props.
 * @param  {object}  props.config Algolia configuration.
 * @return {Element}              The AlgoliaResults component.
 */
export default function AlgoliaResults({
  config = {
    query: ''
  }
}) {
  const { algolia } = useWordPressContext()

  // Dispatch console warning if Index Name missing.
  if (!algolia?.indexName) {
    console.warn('Algolia: Index Name is missing from env variables.')
  }

  return (
    <div className="algoliaResults">
      {config.query !== '' && (
        <InstantSearch
          searchClient={config.query !== '' ? searchResultsClient : ''}
          indexName={algolia?.indexName}
        >
          <Configure {...config} />
          <div className="searchResults">
            <div className="facets">
              <Department
                attribute="faculty_departments"
                limit={10}
                showMore={true}
              />
            </div>
            <div className="results">
              <SearchResults indexName={algolia?.indexName} />
            </div>
          </div>
        </InstantSearch>
      )}
      {config.query === '' && <NoResults query={config.query} />}
    </div>
  )
}
