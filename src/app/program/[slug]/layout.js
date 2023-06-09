import ProgramTabs from '@/components/atoms/ProgramTabs'
import WordPressProvider from '@/components/common/WordPressProvider'
import PageHero from '@/components/organisms/PageHero/PageHero'
import getProgramChildrenByID from '@/functions/wordpress/programs/getProgramChildrenById'
import Link from 'next/link'

const programLayout = async ({ children, params }) => {
  const id = `/program/${params?.slug}`
  const { program } = await getProgramChildrenByID(id)
  const {
    children: childPages,
    uri,
    title,
    departments,
    programOrgRelationship,
    featuredImage
  } = program || {}

  const wpInitialState = {
    departments: departments?.nodes,
    studentOrganizations: programOrgRelationship?.programorg
  }

  const altText = featuredImage.node?.altText || 'Image'

  return (
    <div>
      <article className="inner-wrap">
        <PageHero
          text={title}
          sourceUrl={featuredImage.node?.sourceUrl}
          altText={altText}
          imageMeta={featuredImage.node?.mediaDetails}
        />
        {program && (
          <ul>
            <li>
              <Link href={uri}>{title}</Link>
            </li>
            {childPages &&
              childPages.nodes.map((childPage) => {
                return (
                  <li key={childPage.title}>
                    <Link href={childPage.uri}>{childPage?.title}</Link>
                  </li>
                )
              })}
          </ul>
        )}
        <ProgramTabs childPages={childPages} uri={uri} />
        <WordPressProvider value={wpInitialState}>{children}</WordPressProvider>
      </article>
    </div>
  )
}

export default programLayout
