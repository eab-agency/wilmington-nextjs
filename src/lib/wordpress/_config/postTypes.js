// Define valid WP post types (singular and plural GraphQL names).
export const postTypes = {
  page: {
    pluralName: 'pages',
    route: ''
  },
  post: {
    pluralName: 'posts',
    route: ''
  },
  program: {
    pluralName: 'programs',
    route: 'programs'
  },
  department: {
    pluralName: 'departments',
    route: 'departments'
  },
  faq: {
    pluralName: 'faqs',
    route: 'faq'
  },
  facultyMember: {
    pluralName: 'faculty',
    route: 'faculty'
  }
}

// Define hierarchical post types.
export const hierarchicalPostTypes = ['page', 'program']
