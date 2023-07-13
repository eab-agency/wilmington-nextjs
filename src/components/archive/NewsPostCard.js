/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'
import TheDate from '@/components/atoms/TheDate'
import Link from 'next/link'

const NewsPost = ({
  isFirst = false,
  post,
  className = null,
  ctx,
  showImage = true,
  isFrontPage = false,
  ...props
}) => {
  // if post is null or undefined, return null
  if (!post) return null

  const { title, date, featuredImage, uri, excerpt } = post

  const { node: { sourceUrl, altText, mediaDetails } = {} } =
    featuredImage || {}

  return (
    <article
      className={`${className !== null ? className : ''} newsPostCard`}
      {...props}
    >
      {!isFrontPage && sourceUrl && showImage ? (
        <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
      ) : null}
      <div className="newsContentContainer">
        <TheDate date={date} />
        <Link href={uri} className="articleTitle">
          <h3>{title}</h3>
        </Link>
        {/* <div dangerouslySetInnerHTML={{ __html: excerpt }}></div> */}
        <Button
          className="articleLink"
          url={uri}
          type="regularlink"
          text="Read More"
        />
      </div>
    </article>
  )
}

export default NewsPost
