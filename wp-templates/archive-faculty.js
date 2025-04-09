import { SEO } from '@/components'
import LoadMore from '@/components/LoadMore'
import { PostsList } from '@/components/archive/PostsList'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import Department from '@/components/molecules/AlgoliaResults/facets/Department'
import Search from '@/components/molecules/AlgoliaSearch/components/Search'
import FacultyCard from '@/components/molecules/FacultyCard'
import { searchResultsClient } from '@/lib/algolia/connector'
import { useCallback, useEffect, useState } from 'react'

import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  SearchBox
} from 'react-instantsearch-dom'
import appConfig from '../app.config'

function Hit({ hit }) {
  console.log('🚀 ~ Hit ~ hit:', hit.images)
  const featuredImage = {
    node: hit.images?.thumbnail
      ? {
          sourceUrl: hit.images.thumbnail.url,
          mediaDetails: {
            width: hit.images.thumbnail.width,
            height: hit.images.thumbnail.height
          }
        }
      : null
  }
  return (
    <FacultyCard
      className="_facultyCard"
      key={hit.post_id}
      title={hit.faculty_full_name}
      description={hit.faculty_position}
      email={hit.faculty_email}
      phone={hit.faculty_phone}
      link={hit.permalink}
      image={featuredImage?.node}
    />
  )
}

const DEFAULT_SETTINGS = {
  title: 'Faculty and Staff | Wilmington University',
  description:
    "Discover Wilmington College's dedicated faculty and staff across academic, administrative, and athletic departments. Find contact information and professional details for our diverse team of educators and professionals."
}

export default function Archive() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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

  const transformFacultyData = (hits) => {
    return hits.map((hit) => ({
      id: hit.post_id,
      title: hit.faculty_full_name,
      facultyFields: {
        faculty: {
          position: hit.faculty_position,
          email: hit.faculty_email,
          phone: hit.faculty_phone,
          departments: hit.faculty_departments || []
        }
      },
      uri: hit.permalink,
      featuredImage: {
        node: hit.images?.thumbnail
          ? {
              sourceUrl: hit.images.thumbnail.url,
              mediaDetails: {
                width: hit.images.thumbnail.width,
                height: hit.images.thumbnail.height
              }
            }
          : null
      }
    }))
  }

  const fetchFaculty = useCallback(async (currentPage, query = '') => {
    try {
      setLoading(true)
      const { results } = await searchResultsClient.search([
        {
          indexName: 'wil_dev_posts_faculty',
          query,
          page: currentPage,
          hitsPerPage: appConfig.postsPerPage
        }
      ])

      const hits = results[0].hits
      const hasMore = currentPage < results[0].nbPages - 1
      const transformedHits = transformFacultyData(hits)

      if (currentPage === 0) {
        setPosts(transformedHits)
      } else {
        setPosts((prevPosts) => [...prevPosts, ...transformedHits])
      }

      setHasNextPage(hasMore)
      setIsInitialLoad(false)
    } catch (error) {
      console.error('Error fetching faculty:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(0)
    fetchFaculty(0, searchQuery)
  }, [searchQuery, fetchFaculty])

  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchFaculty(nextPage, searchQuery)
    }
  }, [loading, hasNextPage, page, searchQuery, fetchFaculty])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const archiveTitle = 'Faculty and Staff'

  if (isInitialLoad) {
    return (
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            {archiveTitle}
          </RichText>
          <div className="loading-indicator">Loading...</div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <SEO
        seo={{
          title: `${archiveTitle} | ${DEFAULT_SETTINGS.title}`,
          description: DEFAULT_SETTINGS.description
        }}
      />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            {archiveTitle}
          </RichText>

          <InstantSearch
            searchClient={searchResultsClient}
            indexName="wil_dev_posts_faculty"
            insights={true}
          >
            <div className="facultySearch">
              <SearchBox placeholder="Search..." className="searchbox" />

              <Search
                indexName="wil_dev_posts_faculty"
                useHistory={false}
                onSearchStateChange={handleSearch}
                showResults={false}
                placeholder="Search Faculty and Staff"
              />
              {/* <RefinementList attribute="faculty_departments" /> */}
              <Department
                attribute="faculty_departments"
                refinements={refinements}
                className="facultyDepartments"
              />
            </div>

            <Configure hitsPerPage={appConfig.postsPerPage} />
            <div className="facultyList">
              <Hits
                hitComponent={Hit}
                classNames={{
                  root: 'MyCustomHits',
                  list: 'MyCustomHitsList MyCustomHitsList--subclass'
                }}
              />
            </div>

            {/* <PostsList posts={posts} type="faculty" className="facultyList" /> */}
            {hasNextPage && (
              <LoadMore
                className="text-center"
                hasNextPage={hasNextPage}
                isLoading={loading}
                fetchMore={handleLoadMore}
                useInfiniteScroll={true}
              />
            )}
          </InstantSearch>
        </div>
      </Layout>
    </>
  )
}
