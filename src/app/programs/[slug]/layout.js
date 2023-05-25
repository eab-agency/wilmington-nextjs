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
    programOrgRelationship,
    featuredImage
  } = program || {}

  const wpInitialState = {
    departments: departments?.nodes,
    studentOrganizations: programOrgRelationship?.programorg
  }

  return (
    <div>
      <article className="inner-wrap">
        <PageHero
          text={title}
          sourceUrl={featuredImage.node?.sourceUrl}
          altText={featuredImage.node?.altText}
          imageMeta={featuredImage.node?.mediaDetails}
        />
        <ProgramTabs childPages={childPages} uri={uri} />
        <WordPressProvider value={wpInitialState}>{children}</WordPressProvider>
      </article>
    </div>
  )
}

export default programLayout
