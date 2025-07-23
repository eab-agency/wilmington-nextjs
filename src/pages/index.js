import { getWordPressProps, WordPressTemplate } from '@faustwp/core'
import HomepageModal from '../components/HomepageModal'

export default function Page(props) {
  return (
    <>
      <HomepageModal />
      <WordPressTemplate {...props} />
    </>
  )
}

export function getStaticProps(ctx) {
  return getWordPressProps({ ctx })
}
