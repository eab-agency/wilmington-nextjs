import React from 'react'
import ArchivePost from './ArchivePost'

export const ProgramsList = ({ posts, ...props }) => {
  return (
    <div {...props}>
      {posts?.map((post, index) => {
        return <ArchivePost key={post.id} post={post} isFirst={index === 0} />
      })}
    </div>
  )
}
