import React from 'react'
import Block from '@/utils/getWpBlocks'
import Seo from 'gatsby-plugin-wpgraphql-seo'

import { Link } from 'gatsby'
import { Layout } from '../Layout'
import { PostEntryMeta } from './PostEntryMeta'
import { FeaturedImage } from '../common/FeaturedImage'

const PostEntryFull = ({ data, pageContext: ctx }) => {
  const {
    post,
    post: { blocksJSON = [] }
  } = data

  const blocks = JSON.parse(blocksJSON)
  const {
    breadcrumb: { crumbs }
  } = ctx
  return (
    <Layout page={post} type="post" crumbs={crumbs}>
      <Seo post={post} />
      <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <pre>PostEntryFull.js</pre>
        <header>
          <FeaturedImage post={post} />
          <PostEntryMeta post={post} />
          <h1>
            <span itemProp="headline">{post.title}</span>
          </h1>
          <small>{post.date}</small>
        </header>
        <div className="entry-content">
          {blocks
            ? (
                blocks.map((block, index) => {
                  return <Block block={block} key={index} index={index} />
                })
              )
            : (
            <p style={{ backgroundColor: 'red' }}>blocks came back empty</p>
              )}
        </div>
        {ctx && (
          <div>
            <nav className="blog-post-nav">
              {ctx.next && (
                <Link as={Link} to={ctx.next} rel="next">
                  Older Post
                </Link>
              )}
              {ctx.prev && (
                <Link as={Link} to={ctx.prev} rel="prev">
                  Newer Post
                </Link>
              )}
            </nav>
          </div>
        )}
      </article>
    </Layout>
  )
}

export default PostEntryFull
