import { SEO } from '@/components'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import { InfiniteHits } from '@/components/molecules/AlgoliaResults/templates/InfiniteHits.js'
import FacultyCard from '@/components/molecules/FacultyCard'
import { searchResultsClient } from '@/lib/algolia/connector'
import { HierarchicalMenu, InstantSearch, SearchBox } from 'react-instantsearch'
import CustomHierarchicalMenu from '../src/components/archive/CustomHierarchicalMenu'

function Hit({ hit }) {
  const featuredImage = {
    node: hit.image?.medium
      ? {
          sourceUrl: hit.image.medium.url,
          mediaDetails: {
            width: hit.image.medium.width,
            height: hit.image.medium.height
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

const FACULTY_INDEX_NAME =
  process.env.NODE_ENV === 'production'
    ? 'wil_posts_faculty'
    : 'wil_dev_posts_faculty'

export default function Archive() {
  const archiveTitle = 'Faculty and Staff'

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
            indexName={FACULTY_INDEX_NAME}
          >
            <div className="facultySearch">
              <div className="algoliaResults">
                <div className="searchBox">
                  <SearchBox
                    placeholder="Search Faculty and Staff"
                    className="searchbox"
                  />
                </div>
                <div className="departments">
                  <div className="wrapper">
                    <div className="label">
                      Find faculty and staff by entering a name or selecting a
                      department:
                    </div>
                    <CustomHierarchicalMenu
                      attributes={[
                        'departments.lvl0',
                        'departments.lvl1',
                        'departments.lvl2'
                      ]}
                      limit={10}
                      showMore={true}
                      showMoreLimit={100}
                    />
                  </div>
                </div>
              </div>
            </div>

            <InfiniteHits
              hitComponent={Hit}
              classNames={{
                root: 'ais-InfiniteHits',
                list: 'facultyList',
                item: 'FacultyCard'
              }}
            />
          </InstantSearch>
        </div>
      </Layout>
    </>
  )
}
