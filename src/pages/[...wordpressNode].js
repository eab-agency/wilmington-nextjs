import { getWordPressProps, WordPressTemplate } from '@faustwp/core'

export default function Page(props) {
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
