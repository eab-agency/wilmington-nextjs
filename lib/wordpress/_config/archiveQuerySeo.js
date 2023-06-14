import queryDepartmentsArchive from '@/lib/wordpress/departments/queryDepartmentsArchive'
import queryFacultyArchive from '@/lib/wordpress/faculty/queryFacultyArchive'
import queryPostsArchive from '@/lib/wordpress/posts/queryPostsArchive'
import queryStudentOrgArchive from '@/lib/wordpress/student-orgs/queryStudentOrgArchive'

// Define SEO for archives.
const archiveQuerySeo = {
  post: {
    query: queryPostsArchive,
    title: 'Blog',
    description: ''
  },
  department: {
    query: queryDepartmentsArchive,
    title: 'Departments',
    description: ''
  },
  faculty: {
    query: queryFacultyArchive,
    title: 'Faculty',
    description: ''
  },
  studentOrgs: {
    query: queryStudentOrgArchive,
    title: 'Student Organizations',
    description: ''
  },
  news: {
    // query: queryNewsArchive,
    title: 'News',
    description: ''
  },
  events: {
    // query: queryEventsArchive,
    title: 'Events',
    description: ''
  }
}

export default archiveQuerySeo
