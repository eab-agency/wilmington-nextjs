/* eslint-disable import/no-anonymous-default-export */
import CoreButton from './CoreButton'
import CoreButtons from './CoreButtons'
import CoreColumn from './CoreColumn'
import CoreColumns from './CoreColumns'
import CoreGroup from './CoreGroup'
import CoreList from './CoreList'
import CoreParagraph from './CoreParagraph'
import CoreQuote from './CoreQuote'
import CoreVerse from './CoreVerse'
import AcfAthleteCard from './acf/AcfAthleteCard'
import AcfEventsListing from './acf/AcfEventsListing'
import AcfFaqListing from './acf/AcfFaqListing'
import AcfFeaturedDept from './acf/AcfFeaturedDept'
import AcfNewsListing from './acf/AcfNewsListing'
import AcfTestimonialBlock from './acf/AcfTestimonialBlock'

/**
 * This object acts as the registry of blocks in your React Gutenberg Bridge.
 * Any block that is added here may be used when rendering contentBlocks from
 * WPGraphQL Content Blocks.
 *
 * @see https://faustjs.org/docs/gutenberg/getting-started
 */
export default {
  CoreButton,
  CoreButtons,
  CoreColumn,
  CoreColumns,
  CoreGroup,
  CoreList,
  CoreParagraph,
  CoreQuote,
  CoreVerse,
  AcfAthleteCard,
  AcfEventsListing,
  AcfFaqListing,
  AcfFeaturedDept,
  AcfNewsListing,
  AcfTestimonialBlock
}
