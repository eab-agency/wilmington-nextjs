import { SEO } from '@/components'
import LoadMore from '@/components/LoadMore/'
import { FacultyList } from '@/components/archive/FacultyList'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql, useQuery } from '@apollo/client'
import { getNextStaticProps } from '@faustwp/core'
import { useEffect, useState } from 'react'

export default function ArchiveFaculty() {
  const { data, loading, fetchMore } = useQuery(ArchiveFaculty.query, {
    variables: ArchiveFaculty.variables()
  })
  const { faculty } = data

  const { description } = data?.generalSettings ?? {}

  const archiveTitle = `Wilmington College Faculty`

  const [posts, setPosts] = useState([])

  if (loading && !posts.length) {
    return <></>
  }

  return (
    <>
      <SEO seo={{ title: archiveTitle, description: description }} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            {archiveTitle}
          </RichText>
          {/* {description && <RichText>{description}</RichText>} */}
          <FacultyList className="facultyList" posts={faculty.nodes} />
          <LoadMore
            className="text-center"
            hasNextPage={faculty.pageInfo.hasNextPage}
            endCursor={faculty.pageInfo.endCursor}
            isLoading={loading}
            fetchMore={fetchMore}
          />
        </div>
      </Layout>
    </>
  )
}

ArchiveFaculty.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query AllFaculty(
    $imageSize: MediaItemSizeEnum = MEDIUM
    $first: Int
    $after: String
  ) {
    faculty(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        uri
        title
        facultyFields {
          faculty {
            email
            phone
            position
          }
        }
        ...FeaturedImageFragment
      }
    }

    generalSettings {
      ...BlogInfoFragment
    }
  }
`

ArchiveFaculty.variables = () => {
  return {
    first: 2,
    after: ''
  }
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: ArchiveFaculty
  })
}
