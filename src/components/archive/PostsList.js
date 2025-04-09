import NewsListCard from '@/components/archive/NewsListCard'
import NewsPostCard from '@/components/archive/NewsPostCard'
import FacultyCard from '@/components/molecules/FacultyCard'
import React from 'react'
import ArchivePost from './ArchivePost'

export const PostsList = ({ posts, type, ...props }) => {
  return (
    <div {...props}>
      {posts?.map((post, index) => {
        const isFirst = index === 0

        if (type === 'faculty') {
          const { id, title, facultyFields, uri, featuredImage } = post
          return (
            <FacultyCard
              key={id}
              title={title}
              description={facultyFields?.faculty?.position}
              email={facultyFields?.faculty?.email}
              phone={facultyFields?.faculty?.phone}
              link={uri}
              image={featuredImage?.node}
            />
          )
        }

        if (type === 'news') {
          if (index < 5) {
            return (
              <NewsPostCard
                key={post.id}
                post={post}
                showImage={isFirst}
                className={isFirst ? 'highlightedPost' : undefined}
                isFirst={isFirst}
              />
            )
          } else {
            return (
              <NewsPostCard
                key={post.id}
                post={post}
                showImage={isFirst}
                isFirst={isFirst}
              />
            )
          }
        } else {
          return <ArchivePost key={post.id} post={post} isFirst={isFirst} />
        }
      })}
    </div>
  )
}
