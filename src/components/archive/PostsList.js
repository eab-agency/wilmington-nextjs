import React from 'react'
import ArchivePost from './ArchivePost'

export const PostsList = ({posts, ...props}) => {
  return (
    <div {...props}>
      {posts?.map((post, index) => {
        return <ArchivePost key={post.id} post={post} isFirst={index === 0} />
      })}
    </div>
  )
}
