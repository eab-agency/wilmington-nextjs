/* eslint-disable no-unused-vars */
import Image from '@/components/atoms/Image/Image'
import React from 'react'
// import FeaturedImage from '../common/FeaturedImage'
// import { className } from 'classnames/bind'
import Link from 'next/link'
import { PostEntryContent } from '../post/PostEntryContent'
import { PostEntryMeta } from '../post/PostEntryMeta'
// import { PostEntryTitle } from '../post/PostEntryTitle'
import Button from '@/components/atoms/Buttons/Button'

const ArchivePost = ({
  isFirst = false,
  post,
  className = null,
  ctx,
  ...props
}) => {
  const { altText, sourceUrl, mediaDetails } = post.featuredImage?.node || {}

  const classes = className ? `${className} archiveArticle` : 'archiveArticle'

  return (
    <article className={classes} {...props}>
      <div className="archiveCardHead">
        {post.featuredImage && (
          <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
        )}
        <h2 className="archiveCardTitle">{post.title}</h2>
      </div>
      <div className="archiveCardContent">
        <PostEntryContent post={post} location="archive" />
        <PostEntryMeta post={post} />

        <div className="groupBtn">
          <Button
            className="articleLink"
            url={post.uri}
            type="regularlink"
            text="Read More"
            ariaLabel={`Read more about ${post?.title}`}
          />
        </div>
      </div>
    </article>
  )
}

export default ArchivePost
