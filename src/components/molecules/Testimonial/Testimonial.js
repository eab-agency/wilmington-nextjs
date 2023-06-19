/* eslint-disable no-unsafe-optional-chaining */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'
import Quote from '@/components/atoms/Quote'
import cn from 'classnames'
import styles from './Testimonial.module.scss'

const Citation = (fullName, desc) => {
  return (
    <>
      <span>{fullName}</span>
      {desc && <span>{desc}</span>}
    </>
  )
}

function Testimonial({ post, viewAllLink, imageOnly, featuredTestimonial }) {
  // if no post, return null
  if (!post || Object.keys(post).length === 0 || !post.featuredImage?.node) {
    return null
  }
  // destructure first, last, desc from post.testimonialFields.testimonial, set default values
  const {
    altText = '',
    mediaDetails,
    sourceUrl
  } = post?.featuredImage?.node || {}
  const { first, last, desc } = post?.testimonialFields?.testimonial ?? {}
  const fullName = `${first} ${last}`

  return (
    <article
      className={cn(
        styles.singleQuote,
        featuredTestimonial && styles.featuredTestimonial
      )}
    >
      <div className={styles.blockQuote}>
        <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
      </div>
      {!imageOnly && (
        <>
          <Quote
            citation={Citation(fullName, desc)}
            className={styles.quoteText}
          >
            <span
              className={styles.quoteContent}
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </Quote>
          {!viewAllLink && (
            <Button text="View All Testimonials" url="/testimonials/" />
          )}
        </>
      )}
    </article>
  )
}

export default Testimonial
