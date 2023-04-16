/* eslint-disable no-unused-vars */
import NewsPost from '@/components/archive/NewsPost'
import Button from '@/components/atoms/Buttons/Button'
import Carousel from 'react-multi-carousel'
import * as styles from './NewsListing.module.scss'

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

function NewsListing({ listing_title, posts, showImage, listing_display }) {
  // if posts.isError is true then return posts.message
  if (posts.isError) {
    return <div>{posts.message}</div>
  }

  return (
    <section className={`${styles.newsSection}  ${styles.homePage}`}>
      {/* <pre>FILE: NewsListing.tsx</pre> */}
      <div className={styles.sectionHead}>
        <div className={styles.sectionTag}>News</div>
        <h2>{listing_title}</h2>
      </div>
      <div className={styles.newsContainer}>
        <Carousel responsive={responsive} showDots={true}>
          {posts.map((item, index) => (
            // <li key={index}>
            <NewsPost
              key={index}
              post={item}
              ctx={undefined}
              showImage={showImage}
            />
            // </li>
          ))}
        </Carousel>
        <Button url="/news" text="View All News" />
      </div>
    </section>
  )
}

export default NewsListing
