import FeaturedImage from '@/components/common/FeaturedImage'
import { Link } from 'gatsby'
import parse from 'html-react-parser'
import React from 'react'
import { Layout } from '../Layout'
import Categories from './Categories'

const PostEntry = ({ data: { post } }) => {
  return (
    <Layout page={post} type="post">
      <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <h1>PostEntry.js</h1>
        <header>
          <FeaturedImage post={post} />
          <Categories mt={6} mb={4} categories={post.categories.nodes} />
          <h2>
            <Link to={post.uri} itemProp="url">
              <span itemProp="headline">{parse(post.title)}</span>
            </Link>
          </h2>
          <span>{post.date}</span>
        </header>
        <div>
          {parse(post.excerpt)}
          <div>
            <Link to={post.uri} itemProp="url">
              Continue reading <span>{parse(post.title)}</span>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  )
}

export default PostEntry
