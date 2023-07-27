import LoadMorePost from '@/components/LoadMorePosts'
import Container from '@/components/atoms/Container'
import Layout from '@/components/common/Layout'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import * as styles from '@/components/molecules/AlgoliaResults/AlgoliaResults.module.scss'
import NoResults from '@/components/molecules/AlgoliaResults/templates/NoResults'
import SearchResults from '@/components/molecules/AlgoliaResults/templates/SearchResults'
import Search from '@/components/molecules/AlgoliaSearch/components/Search'
import { searchResultsClient } from '@/lib/algolia/connector'
import { Configure, InstantSearch } from 'react-instantsearch-dom'

export default function LoadMore({
  config = {
    query: '',
    hitsPerPage: 15
  }
}) {
  const { algolia } = useWordPressContext()

  return (
    <Layout>
      <Container>
        <LoadMorePost />
        <div className={styles.algoliaResults}>
          <InstantSearch
            searchClient={config.query !== '' ? searchResultsClient : ''}
            indexName={'wil_posts_faculty'}
          >
            <Search indexName={'wil_posts_faculty'} query={config.query} />
            <Configure {...config} />
            <SearchResults indexName={'wil_posts_faculty'} />
          </InstantSearch>
          {config.query === '' && <NoResults query={config.query} />}
        </div>
      </Container>
    </Layout>
  )
}
