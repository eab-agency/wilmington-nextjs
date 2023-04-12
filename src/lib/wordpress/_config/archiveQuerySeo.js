import queryPostsArchive from '@/lib/wordpress/posts/queryPostsArchive'
import queryDepartmentsArchive from '@/lib/wordpress/departments/queryDepartmentsArchive'
import queryFacultyArchive from '@/lib/wordpress/faculty/queryFacultyArchive'

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
  }
}

export default archiveQuerySeo
