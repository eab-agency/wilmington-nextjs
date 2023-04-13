import React from 'react'
import {Link} from 'gatsby'

const Categories = ({categories, ...props}) => (
  <section className="entry-taxonomy entry-tags" {...props}>
    <pre>components/post/Categories.js</pre>
    <div>
      {categories.map((category) => (
        <Link size="xs" key={category.slug} to={category.uri}>
          {category.name}
        </Link>
      ))}
    </div>
  </section>
)

export default Categories
