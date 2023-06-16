import ArchiveProgram from './archive-program'
import frontPage from './front-page'
import page from './page'
import singular from './single'
import SingleFaculty from './single-faculty'
import SingleProgram from './single-program'

const templates = {
  'front-page': frontPage,
  page,
  singular,
  'single-program': SingleProgram,
  'archive-program': ArchiveProgram,
  'single-faculty': SingleFaculty
}

export default templates
