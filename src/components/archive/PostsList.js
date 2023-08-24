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
        }
        if (type === 'news') {
          if (index < 4) {
            return (
              <NewsPostCard
                key={post.id}
                post={post}
                showImage={isFirst}
                className={isFirst ? 'highlightedPost' : undefined}
                isFirst={isFirst}
              />
            )
          } else if (posts.length > 4 && index === 4) {
            return (
              <>
                <h3>More News</h3>
                <NewsListCard key={post.id} post={post} />
              </>
            )
          } else {
            return <NewsListCard key={post.id} post={post} />
          }
        } else {
          return <ArchivePost key={post.id} post={post} isFirst={isFirst} />
        }
      })}
    </div>
  )
}
