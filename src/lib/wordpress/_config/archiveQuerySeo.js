import queryPostsArchive from '@/lib/wordpress/posts/queryPostsArchive'
import queryDepartmentsArchive from '@/lib/wordpress/departments/queryDepartmentsArchive'

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
  }
}

export default archiveQuerySeo
