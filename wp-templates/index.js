import archive from './archive'
import ArchiveFaculty from './archive-faculty'
import ArchiveOrganization from './archive-organization'
import ArchiveProgram from './archive-program'
import frontPage from './front-page'
import page from './page'
import PageRequestInformation from './page-request-information'
import singular from './single'
import SingleEvent from './single-event'
import SingleFaculty from './single-faculty'
import SingleNews from './single-news'
import SingleProgram from './single-program'
import SingleTestimonial from './single-testimonial'
import TaxonomyDepartment from './taxonomy-department'

const templates = {
  'front-page': frontPage,
  page,
  singular,
  archive,
  'single-program': SingleProgram,
  'archive-program': ArchiveProgram,
  'archive-faculty': ArchiveFaculty,
  'single-faculty': SingleFaculty,
  'single-event': SingleEvent,
  'single-news': SingleNews,
  'single-testimonial': SingleTestimonial,
  'taxonomy-department': TaxonomyDepartment,
  'archive-organization': ArchiveOrganization,
  'page-request-information': PageRequestInformation
}

export default templates
