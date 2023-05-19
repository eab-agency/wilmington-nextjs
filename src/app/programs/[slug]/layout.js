import ProgramTabs from '@/components/atoms/ProgramTabs'
import WordPressProvider from '@/components/common/WordPressProvider'
import PageHero from '@/components/organisms/PageHero/PageHero'
import getProgramChildrenByID from '@/functions/wordpress/programs/getProgramChildrenById'

const programLayout = async ({ children, params }) => {
  const id = `/programs/${params?.slug}`
  const { program } = await getProgramChildrenByID(id)
  const {
    children: childPages,
    uri,
    title,
    departments,
    programOrgRelationship
  } = program

  const { featuredImage = {} } = program || {}

  const wpInitialState = {
    departments: departments?.nodes,
    studentOrganizations: programOrgRelationship?.programorg
  }

  return (
    <>
      <PageHero
        text={title}
        sourceUrl={featuredImage.node?.sourceUrl}
        altText={featuredImage.node?.altText}
        imageMeta={featuredImage.node?.mediaDetails}
      />
      <ProgramTabs childPages={childPages} uri={uri} />

      {/* <ul className="childrenNav">
        <li>
          <Link href={uri}>Overview</Link>
        </li>
        {childPages &&
          childPages.nodes.map((childPage) => {
            return (
              <li key={childPage.title}>
                <Link href={childPage.uri} tabIndex="0">
                  {childPage?.title}
                </Link>
              </li>
            )
          })}
      </ul> */}
      <WordPressProvider value={wpInitialState}>{children}</WordPressProvider>
    </>
  )
}

export default programLayout
