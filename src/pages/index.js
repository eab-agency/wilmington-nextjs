import { getWordPressProps, WordPressTemplate } from '@faustwp/core'

export default function Page(props) {
  return (
    <>
      <WordPressTemplate {...props} />
    </>
  )
}

export async function getStaticProps(ctx) {
  const props = await getWordPressProps({ ctx })
  return {
    ...props,
    revalidate: 30 // Revalidate homepage every 30 seconds
  }
}
