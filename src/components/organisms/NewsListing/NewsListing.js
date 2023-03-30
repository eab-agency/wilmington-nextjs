import React from "react"
import NewsPost from "@/components/archive/NewsPost"
import Button from "@/components/atoms/Buttons/Button"
import * as styles from "./NewsListing.module.scss"

function NewsListing({
  listing_display,
  listing_title,
  posts,
  showImage,
}) {

  // if posts.isError is true then return posts.message
  if (posts.isError) {
    return <div>{posts.message}</div>
  }

  // // if no posts, return null
  // if (!posts || posts.length === 0) {
  //   return null
  // }
  return (
    <section className={styles.newsSection}>
      {/* <pre>FILE: NewsListing.tsx</pre> */}
      <div className={styles.sectionHead}>
        <div className={styles.sectionTag}>News</div>
        <h2>{listing_title}</h2>
      </div>
      <div className={styles.newsContainer}>
        <ul>
          {posts.map((item, index) => (
            <li key={index}>
              <NewsPost post={item} ctx={undefined} showImage={showImage} />
            </li>
          ))}
        </ul>
        <Button url="/news" text="View All News" />
      </div>
    </section>
  )
}

export default NewsListing
