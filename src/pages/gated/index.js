import { gql, useQuery } from '@apollo/client'
import { getApolloAuthClient, useAuth, useLogout } from '@faustwp/core'
import Head from 'next/head'

function AuthenticatedView() {
  const client = getApolloAuthClient()
  const { logout } = useLogout()
  const { data, loading } = useQuery(
    gql`
      {
        viewer {
          posts {
            nodes {
              id
              title
            }
          }
          name
        }
      }
    `,
    { client }
  )

  if (loading) {
    return <>Loading...</>
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>
      <p>Welcome {data?.viewer?.name}!</p>
      <button onClick={() => logout('/')}>Logout</button>
    </>
  )
}

export default function Page() {
  const { isAuthenticated, isReady, loginUrl } = useAuth()

  if (!isReady) {
    return <>Loading...</>
  }

  if (isAuthenticated === true) {
    return <AuthenticatedView />
  }

  return (
    <>
      <p>Welcome!</p>
      <a href={loginUrl}>Login</a>
    </>
  )
}
