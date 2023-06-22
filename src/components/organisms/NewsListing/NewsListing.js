/* eslint-disable no-unused-vars */
import NewsPost from '@/components/archive/NewsPost'
import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'

function NewsListing({ listing_title, posts, showImage, listing_display }) {
  // const isFrontPage = UseIsFrontPage()
  // if posts.isError is true then return posts.message
  if (posts.isError) {
    return <div>{posts.message}</div>
  }

  const responsive = {
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
    <section className="newsSection">
      <div className="sectionHead">
        <div className="sectionTag">News</div>
        <h2 id="jump-news-listing">{listing_title}</h2>
      </div>
      <div className="newsContainer">
        <MultiCarousel
          responsive={responsive}
          showDots={true}
          containerClass="newsCarousel"
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
