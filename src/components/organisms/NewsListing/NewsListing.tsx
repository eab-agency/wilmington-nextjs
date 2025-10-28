import NewsPostCard from '@/components/archive/NewsPostCard'
import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'
import useIsFrontPage from '@/functions/useIsFrontPage'
import React from 'react'

// Type definitions for JS components
type ButtonComponent = React.ComponentType<{
  className?: string
  url?: string
  text?: string
  [key: string]: any
}>

// Cast JS components to proper types
const TypedButton = Button as unknown as ButtonComponent

interface FeaturedImage {
  node?: {
    sourceUrl: string
    altText?: string
    mediaDetails?: {
      height?: number
      width?: number
    }
  }
}

interface NewsPost {
  id: string
  title: string
  date: string
  link: string
  uri: string
  excerpt?: string
  featuredImage?: FeaturedImage
}

interface ErrorObject {
  isError: true
  message: string
}

type PostsData = NewsPost[] | ErrorObject

interface NewsListingProps {
  listing_title: string
  posts: PostsData
  showImage?: boolean
  listing_display?: string
}

// Type predicate function to check if a value is an ErrorObject
const isErrorObject = (p: any): p is ErrorObject =>
  p && typeof p === 'object' && 'isError' in p && p.isError

function NewsListing({
  listing_title,
  posts,
  showImage,
  listing_display
}: NewsListingProps) {
  const isFrontPage = useIsFrontPage()

  // Type guard for error object
  if (isErrorObject(posts)) {
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
        <TypedButton
          className={!isFrontPage ? 'secondary' : ''}
          url="/news"
          text="View All News"
        />
      </div>
    </section>
  )
}

export default NewsListing
