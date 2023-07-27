import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import { use, useEffect } from 'react'

const GET_PAGES = gql`
  query GET_PAGES($first: Int, $after: String) {
    pages(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          databaseId
          slug
          uri
        }
      }
    }
  }
`

const BATCH_SIZE = 5

export default function LoadMorePages() {
  const { data, loading, error, fetchMore } = useQuery(GET_PAGES, {
    variables: { first: BATCH_SIZE, after: null },
    notifyOnNetworkStatusChange: true
  })

  useEffect(() => {
    console.log('data', data)
  }, [data])

  console.log('data🟢🟢🟢', data)

  if (error) return <p>Error: {error.message}</p>

  if (!data && loading) return <p>Loading...</p>

  if (!data.pages.edges.length) {
    return <p>No pages to display.</p>
  }
  const pages = data.pages.edges.map((edge) => edge.node)

  const haveMorePages = Boolean(data?.pages?.pageInfo?.hasNextPage)

  return (
    <>
      <ul>
        {pages.map((pages) => {
          const { id, title, uri } = pages
          return (
            <li key={id}>
              <Link href={uri}>{title}</Link>
            </li>
          )
        })}
      </ul>
      {haveMorePages ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            fetchMore({
              variables: { after: data.pages.pageInfo.endCursor }
            })
          }}
        >
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Load More Posts'}
          </button>
        </form>
      ) : (
        <p>No more posts to load.</p>
      )}
    </>
  )
}
