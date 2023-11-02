/* eslint-disable no-unused-vars */
import NewsPostCard from '@/components/archive/NewsPostCard'
import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'
import useIsFrontPage from '@/functions/useIsFrontPage'

function NewsListing({ listing_title, posts, showImage, listing_display }) {
  const isFrontPage = useIsFrontPage()

  // if posts.isError is true then return posts.message
  if (posts.isError) {
    return <div>{posts.message}</div>
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1800 },
      items: 5
    },
    largeDesktop: {
      breakpoint: { max: 1800, min: 1500 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1500, min: 1100 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1100, min: 464 },
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
    <section className={`newsSection ${isFrontPage ? 'atHomePage' : ''}`}>
      <div className="sectionHead">
        {isFrontPage ? <div className="sectionTag">News</div> : null}
        <h2 id="jump-news-listing">{listing_title}</h2>
      </div>
      <div
        className={`newsContainer ${listing_display == '1' ? 'list' : 'grid'}`}
      >
        <MultiCarousel
          responsive={responsive}
          showDots={false}
          containerClass="newsCarousel"
        >
          {posts.map((item, index) => (
            <NewsPostCard
              key={index}
              post={item}
              ctx={undefined}
              showImage={showImage}
              isFrontPage={isFrontPage}
            />
          ))}
        </MultiCarousel>
        <Button
          className={!isFrontPage && 'secondary'}
          url="/news"
          text="View All News"
        />
      </div>
    </section>
  )
}

export default NewsListing
