/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'
import TheDate from '@/components/atoms/TheDate'

const NewsListCard = ({
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

  return (
    <article
      className={`${className !== null ? className : ''} newsListCard`}
      {...props}
    >
      <div className="newsContentContainer">
        <Button
          className="articleTitle"
          url={uri}
          type="regularlink"
          text={title}
        />
      </div>
    </article>
  )
}

export default NewsListCard
