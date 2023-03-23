import Button from "@/components/atoms/Buttons/Button"
import React from "react"
import { FeaturedImage } from "@/components/common/FeaturedImage"
import Quote from "@/components/atoms/Quote"
import cn from "classnames"
import * as styles from "./Testimonial.module.scss"
import Image from "@/components/atoms/Image"


const Citation = (fullName, desc) => {
  return (
    <>
      <span>{fullName}</span>
      {desc && <span>{desc}</span>}
    </>
  )
}

function Testimonial({
  post,
  viewAllLink,
  imageOnly,
  featuredTestimonial,
}) {
  // destructure first, last, desc from post.testimonialFields.testimonial, set default values
  const { altText = '', mediaDetails, mediaItemUrl } = post?.featuredImage?.node
  const { first, last, desc } = post?.testimonialFields?.testimonial ?? {}
  const fullName = `${first} ${last}`

  return (
    <article
      className={cn(
        styles.singleQuote,
        featuredTestimonial && styles.featuredTestimonial
      )}
    >
      {/* <pre>FILE: Testimonial.js</pre> */}
      <FeaturedImage post={post} />
      <Image url={mediaItemUrl} alt={altText} imageMeta={{ mediaDetails }} />
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
