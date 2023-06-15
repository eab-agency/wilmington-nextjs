import ProgramTabs from '@/components/atoms/ProgramTabs'
import WordPressProvider from '@/components/common/WordPressProvider'
import PageHero from '@/components/organisms/PageHero/PageHero'
import getProgramChildrenByID from '@/functions/wordpress/programs/getProgramChildrenById'
// import Link from 'next/link'

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

  let altText = 'Image'
  if (featuredImage) {
    altText = featuredImage.node?.altText || altText
  }

  return (
    <div>
      <article className="inner-wrap">
        {featuredImage && (
          <PageHero
            text={title}
            sourceUrl={featuredImage.node?.sourceUrl}
            altText={altText}
            imageMeta={featuredImage.node?.mediaDetails}
          />
        )}
        {program && <ProgramTabs childPages={childPages} uri={uri} />}
        <WordPressProvider value={wpInitialState}>{children}</WordPressProvider>
      </article>
    </div>
  )
}

export default programLayout
