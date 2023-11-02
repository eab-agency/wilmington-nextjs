/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'
import TheDate from '@/components/atoms/TheDate/TheDate'
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

  const excerptLimit = sourceUrl
    ? excerpt.split(' ').slice(0, 30).join(' ') + ' [...]'
    : excerpt

  return (
    <article
      className={`${className !== null ? className : ''} newsPostCard ${sourceUrl ? 'wImage' : 'noImage'
        }`}
      {...props}
    >
      <div className="newsContentContainer">
        <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
        <div className="newsPostCardContent">
          <Link href={uri} className="articleTitle">
            <h3>{title}</h3>
            {!isFrontPage && <TheDate date={date} />}
          </Link>
          <div
            className="articleExcerpt"
            dangerouslySetInnerHTML={{ __html: excerptLimit }}
          />
          <Button
            className="articleLink"
            url={uri}
            type="regularlink"
            text="Read More"
            ariaLabel={`Read more about ${title}`}
          />
        </div>
      </div>
    </article>
  )
}

export default NewsPost
