import { useWordPressContext } from '@/components/common/WordPressProvider'
import { searchResultsClient } from '@/lib/algolia/connector'
import React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import Search from '../AlgoliaSearch/components/Search'
import * as styles from './AlgoliaResults.module.scss'
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
    <div className={styles.algoliaResults}>
      {config.query !== '' && (
        <InstantSearch
          searchClient={config.query !== '' ? searchResultsClient : ''}
          indexName={algolia?.indexName}
        >
          <Search indexName={algolia?.indexName} query={config.query} />
          <Configure {...config} />
          <SearchResults indexName={algolia?.indexName} />
        </InstantSearch>
      )}
      {config.query === '' && <NoResults query={config.query} />}
    </div>
  )
}
