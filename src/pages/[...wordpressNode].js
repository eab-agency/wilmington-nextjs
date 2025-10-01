/* eslint-disable no-console */
import { getWordPressProps, WordPressTemplate } from '@faustwp/core'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page(props) {
  const router = useRouter()

  useEffect(() => {
    // Handle preview requests that landed on the wrong URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)

      if (params.has('preview') && params.get('preview') === 'true') {
        console.log(
          '⚠️ Preview request detected on page route, redirecting to /preview...'
        )

        // Build correct preview URL
        const previewUrl = new URL('/preview', window.location.origin)
        previewUrl.searchParams.set('preview', 'true')

        // Use previewPathname if available, otherwise use current pathname
        const previewPathname =
          params.get('previewPathname') || window.location.pathname
        previewUrl.searchParams.set('previewPathname', previewPathname)

        // Add post ID (try multiple param names)
        const postId =
          params.get('p') || params.get('page_id') || params.get('preview_id')
        if (postId) {
          previewUrl.searchParams.set('p', postId)
        }

        // Add other params
        if (params.get('page_id')) {
          previewUrl.searchParams.set('page_id', params.get('page_id'))
        }
        if (params.get('typeName')) {
          previewUrl.searchParams.set('typeName', params.get('typeName'))
        }

        console.log('Redirecting to:', previewUrl.toString())
        window.location.replace(previewUrl.toString())
      }
    }
  }, [router])

  return <WordPressTemplate {...props} />
}

export async function getStaticProps(ctx) {
  try {
    const props = await getWordPressProps({ ctx })
    return {
      ...props,
      revalidate: 900 // 15 minutes
    }
  } catch (error) {
    // If WordPress returns not found or error, return 404
    return {
      notFound: true,
      revalidate: 60 // Try again in 1 minute
    }
  }
}

export async function getStaticPaths() {
  // Fetch all page/post URIs from WordPress
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?per_page=100`
  )
  if (!res.ok) {
    return {
      paths: [],
      fallback: 'blocking'
    }
  }

  const pages = await res.json()
  const paths = pages.map((page) => ({
    params: {
      wordpressNode: page.slug ? page.slug.split('/') : ['']
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}
