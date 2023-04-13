import getMediaByID from '@/functions/wordpress/media/getMediaByID'
import getNewsListingData from '@/functions/wordpress/news/getNewsListingData'
import getEventsListingData from '@/functions/wordpress/events/getEventsListingData'
import getFeaturedDeptData from '@/functions/wordpress/departments/getFeaturedDeptData'
import getTestimonialData, {
  getRandomTestimonials
} from '@/functions/wordpress/testimonials/getTestimonialData'
import getCustomPostTypePartialByIds from '@/functions/wordpress/postTypes/getCustomPostTypePartialByIds'
import getPostTypeArchive from '@/functions/wordpress/postTypes/getPostTypeArchive'

/**
 * Format and retrieve expanded block data.
 *
 * @param  {Array} blocks Basic block data.
 * @return {Array}        Formatted block data.
 */
export default async function formatBlockData(blocks) {
  if (!blocks || !blocks.length) {
    return []
  }

  return await Promise.all(
    blocks.map(async (block) => {
      const { name, attributes, innerBlocks } = block
      // adds extra attributes to the block data
      switch (name) {
        case 'core/image':
          // Retrieve additional image meta.
          attributes.imageMeta = await getMediaByID(attributes?.id)
          break

        case 'acf/home-hero':
          attributes.imageMeta = await getMediaByID(
            attributes?.data?.hero_image
          )
          break

        case 'acf/news-listing':
          // an await function to return the news posts that are in the attributes.data.news_listing array
          attributes.listingData = await getNewsListingData(
            attributes?.data?.news_listing
          )
          break

        case 'acf/events-listing':
          // an await function to return the events posts or category events that are in the attributes.data.events_listing array
          attributes.listingData = await getEventsListingData(
            attributes?.data?.events_listing,
            attributes?.data?.event_category
          )
          break

        case 'acf/featured-dept':
          // an await function to return the events posts that are in the attributes.data.events_listing array
          attributes.listingData = await getFeaturedDeptData(
            attributes?.data?.featured_depts
          )
          break

        case 'acf/testimonial-block':
          // an await function to return the events posts that are in the attributes.data.events_listing array
          attributes.featuredTestimonial = await getTestimonialData(
            attributes?.data?.testimonial_post
          )

          // get two random testimonials if testimonial_group === 1
          if (attributes.data.testimonial_group === '1') {
            attributes.random = await getRandomTestimonials(
              attributes?.data?.testimonial_post
            )
          }
          break

        case 'acf/home-tab':
          const count = attributes?.data?.home_tabs
          for (let i = 0; i < count; i++) {
            attributes.data[`home_tabs_${i}_tab_imageData`] =
              await getMediaByID(attributes?.data[`home_tabs_${i}_tab_image`])
          }
          break

        case 'acf/faculty-card':
          // an await function to return the events posts that are in the attributes.data.events_listing array
          attributes.facultyData = await getCustomPostTypePartialByIds(
            'facultyMember',
            attributes?.data?.faculty_member
          )
          break

        case 'acf/faculty-spotlight':
          attributes.facultyData = await getCustomPostTypePartialByIds(
            'facultyMember',
            attributes?.data?.faculty_spotlight
          )
          break

        case 'acf/athlete-card':
          attributes.imageMeta = await getMediaByID(
            attributes?.data?.athlete_image
          )
          break

        case 'acf/faq-listing':
          attributes.faqData = await getCustomPostTypePartialByIds(
            'fAQ',
            attributes?.data?.faqs_listing
          )
          break

        case 'eab/program-directory':
          const { posts } = await getPostTypeArchive('department')
          attributes.departments = posts
          break
      }

      const innerBlocksFormatted = await formatBlockData(innerBlocks)

      return { name, attributes, innerBlocks: innerBlocksFormatted }
    })
  )
}
