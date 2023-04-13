import React from 'react'
import { Taxonomies } from './Taxonomies'

export const PostEntryMeta = ({ post, ...props }) => {
  return (
    <div className="entry-meta" {...props}>
      {post.categories && (
        <Taxonomies post={post} taxName="categories" singularName="category" />
      )}
      <Taxonomies post={post} taxName="tags" singularName="tag" />
    </div>
  )
}
