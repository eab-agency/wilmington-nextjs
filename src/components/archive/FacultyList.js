import FacultyCard from '@/components/molecules/FacultyCard'
import React from 'react'
import ArchivePost from './ArchivePost'

export const FacultyList = ({ posts, ...props }) => {
  return (
    <div {...props}>
      {posts?.map((post, index) => {
        return <FacultyCard key={post.id} post={post} isFirst={index === 0} />
      })}
    </div>
  )
}
