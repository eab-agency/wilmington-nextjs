import FacultyCard from '@/components/molecules/FacultyCard'
import React from 'react'
import ArchivePost from './ArchivePost'

export const PostsList = ({ posts, type, ...props }) => {
  return (
    <div {...props}>
      {posts?.map((post, index) => {
        if (type === 'faculty') {
          const { id, title, faculty, email, uri, featuredImage, phone } = post
          const image = featuredImage?.node
          return (
            <FacultyCard
              key={id}
              title={title}
              description={faculty?.position}
              email={email}
              phone={phone}
              link={uri}
              image={image}
            />
          )
        } else {
          return <ArchivePost key={post.id} post={post} isFirst={index === 0} />
        }
      })}
    </div>
  )
}
