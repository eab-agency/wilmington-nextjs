import FeaturedImage from '@/components/common/FeaturedImage'
import getProgramChildrenByID from '@/functions/wordpress/programs/getProgramChildrenById'
import Link from 'next/link'
import WordPressProvider from '@/components/common/WordPressProvider'

const programLayout = async ({ children, params }) => {
    const id = `/programs/${params?.slug}`
    const { program } = await getProgramChildrenByID(id)
    const { featuredImage, children: childPages, uri, title, departments, programOrgRelationship } = program

    const wpInitialState = {
        departments: departments?.nodes,
        studentOrganizations: programOrgRelationship?.programorg
    };

    return (
        <>
            {/* TODO: AO featured image figure is set to object-fit cover. doesn't display but is on the page  */}
            {featuredImage && <FeaturedImage image={featuredImage.node} />}
            <ul>
                <li><Link href={uri}>{title}</Link></li>
                {childPages && childPages.nodes.map((childPage) => {
                    return (
                        <li key={childPage.title}>
                            <Link href={childPage.uri}>{childPage?.title}</Link>
                        </li>
                    )
                })}
            </ul>
            <WordPressProvider value={wpInitialState}>
                {children}
            </WordPressProvider>
        </>
    )
}

export default programLayout