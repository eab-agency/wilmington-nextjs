import ProgramTabs from '@/components/atoms/ProgramTabs'
// import FeaturedImage from '@/components/common/FeaturedImage'
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

  return (
    <div>
      <article className="inner-wrap">
        {/* TODO: AO featured image figure is set to object-fit cover. doesn't display but is on the page  */}
        {/* {featuredImage && <FeaturedImage image={featuredImage.node} />}
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
        )} */}
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
