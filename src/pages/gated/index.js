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
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Authentication Required</h1>
        <p>You need to be logged in to view this page.</p>
        <a
          href={loginUrl}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#0073aa',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginTop: '20px'
          }}
        >
          Log In with WordPress
        </a>
      </div>
    </>
  )
}
