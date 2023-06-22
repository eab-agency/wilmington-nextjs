/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'
import TheDate from '@/components/atoms/TheDate'

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

  const { title, date, featuredImage, uri } = post

  const { node: { sourceUrl, altText, mediaDetails } = {} } =
    featuredImage || {}

  // console.log('mediaDetails', )

  return (
    <article className={className} {...props}>
      {sourceUrl && (
        <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
      )}
      <TheDate date={date} />
      <h3 className="articleTitle">{title}</h3>
      {/* <PostEntryTitle post={post} location="news" /> */}
      {/* <PostEntryContent post={post} location="news" /> */}
      <Button
        className="articleLink"
        url={uri}
        type="regularlink"
        text="Read More"
      />
    </article>
  )
}

export default NewsPost
