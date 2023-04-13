import React from 'react'
import {PostEntryContent} from '../post/PostEntryContent'
import {FeaturedImage} from '../common/FeaturedImage'
import Button from '@/components/atoms/Buttons/Button'
import TheDate from '@/components/atoms/TheDate'
import * as styles from './NewsPost.module.scss'
import Image from '@/components/atoms/Image'

const NewsPost = ({
  isFirst = false,
  post,
  className = null,
  ctx,
  showImage = true,
  ...props
}) => {
  // if post is null or undefined, return null
  if (!post) return null

  const {title, date, featuredImage, uri} = post

  const {node: {mediaItemUrl, altText, mediaDetails} = {}} = featuredImage || {}

  return (
    <article className={className} {...props}>
      {mediaItemUrl && (
        <Image url={mediaItemUrl} alt={altText} imageMeta={{mediaDetails}} />
      )}
      <TheDate date={date} />
      <h3 className={styles.articleTitle}>{title}</h3>
      {/* <PostEntryTitle post={post} location="news" /> */}
      {/* <PostEntryContent post={post} location="news" /> */}
      <Button
        className={styles.articleLink}
        url={uri}
        type="regularlink"
        text="Read More"
      />
    </article>
  )
}

export default NewsPost
