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
          const { id, title, facultyFields, email, uri, featuredImage, phone } =
            post
          const image = featuredImage?.node
          return (
            <FacultyCard
              key={id}
              title={title}
              description={facultyFields?.faculty?.position}
              email={email}
              phone={phone}
              link={uri}
              image={image}
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
              <>
                {/* <NewsListCard key={post.id} post={post} /> */}
                <NewsPostCard
                  key={post.id}
                  post={post}
                  showImage={isFirst}
                  isFirst={isFirst}
                />
              </>
            )
          }
        } else {
          return <ArchivePost key={post.id} post={post} isFirst={isFirst} />
        }
      })}
    </div>
  )
}
