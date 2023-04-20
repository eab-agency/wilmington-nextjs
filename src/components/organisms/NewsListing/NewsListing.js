/* eslint-disable no-unused-vars */
import NewsPost from '@/components/archive/NewsPost'
import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'
// import { useRouter } from 'next/router'
import styles from './NewsListing.module.scss'

function NewsListing({ listing_title, posts, showImage, listing_display }) {
  // const router = useRouter()
  // const isFrontPage = router.asPath === '/'

  // if posts.isError is true then return posts.message
  if (posts.isError) {
    return <div>{posts.message}</div>
  }

  const responsive = {
    // [isFrontPage ? 'superLargeDesktop' : 'desktop']: {},
    // superLargeDesktop: {
    //   breakpoint: { max: 4000, min: 1200 },
    //   items: [isFrontPage ? 5 : 4]
    // },
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 40
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 40
    }
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTag}>News</div>
        <h2>{listing_title}</h2>
      </div>
      <div className={styles.newsContainer}>
        <MultiCarousel
          responsive={responsive}
          showDots={true}
          containerClass={styles.newsCarousel}
          // containerClass={`${styles.newsCarousel} ${
          //   isFrontPage ? styles.frontPage : ''
          // }`}
        >
          {posts.map((item, index) => (
            <NewsPost
              key={index}
              post={item}
              ctx={undefined}
              showImage={showImage}
            />
          ))}
        </MultiCarousel>
        <Button url="/news" text="View All News" />
      </div>
    </section>
  )
}

export default NewsListing
