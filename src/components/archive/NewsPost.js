/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'

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

  // console.log('post excerpt', excerpt)

  return (
    <article className={className} {...props}>
      {!isFrontPage && sourceUrl ? (
        <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
      ) : null}
      <div className="newsContentContainer">
        <h3 className="articleTitle">{title}</h3>
        <Button
          className="articleLink"
          url={uri}
          type="regularlink"
          text="Read More"
          ariaLabel={`Read more about ${title}`}
        />
      </div>
    </article>
  )
}

export default NewsPost
