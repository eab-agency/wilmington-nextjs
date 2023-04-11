import FeaturedImage from '@/components/common/FeaturedImage'
import getProgramChildrenByID from '@/functions/wordpress/programs/getProgramChildrenById'
import Link from 'next/link'

const programLayout = async ({ children, params }) => {
    const id = `/programs/${params?.slug}`
    const { program } = await getProgramChildrenByID(id)
    const { featuredImage, children: childPages, uri, title } = program

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
            {children}
        </>
    )
}

export default programLayout