/* eslint-disable import/no-anonymous-default-export */
import CoreButton from './CoreButton'
import CoreButtons from './CoreButtons'
import CoreColumn from './CoreColumn'
import CoreColumns from './CoreColumns'
import CoreFreeform from './CoreFreeform'
import CoreGroup from './CoreGroup'
import CoreList from './CoreList'
import CoreParagraph from './CoreParagraph'
import CoreQuote from './CoreQuote'
import CoreSpacer from './CoreSpacer'
import CoreVerse from './CoreVerse'
import AcfAthleteCard from './acf/AcfAthleteCard'
import AcfEventsListing from './acf/AcfEventsListing'
import AcfFacultyCard from './acf/AcfFacultyCard'
import AcfFaqListing from './acf/AcfFaqListing'
import AcfFeaturedDept from './acf/AcfFeaturedDept'
import AcfHomeHero from './acf/AcfHomeHero'
import AcfHomeTab from './acf/AcfHomeTab'
import AcfNewsListing from './acf/AcfNewsListing'
import AcfTestimonialBlock from './acf/AcfTestimonialBlock'
import EabProgramDirectory from './custom/EabProgramDirectory'

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
  CoreFreeform,
  CoreGroup,
  CoreList,
  CoreParagraph,
  CoreQuote,
  CoreSpacer,
  CoreVerse,
  AcfAthleteCard,
  AcfEventsListing,
  AcfFacultyCard,
  AcfFaqListing,
  AcfFeaturedDept,
  AcfHomeHero,
  AcfHomeTab,
  AcfNewsListing,
  AcfTestimonialBlock,
  EabProgramDirectory
}
