import EventsPostCard from '@/components/archive/EventsPostCard'
import Button from '@/components/atoms/Buttons/Button'
import Heading from '@/components/atoms/Heading'
import useIsFrontPage from '@/functions/useIsFrontPage'
import React from 'react'

// Type definitions for JS components
type ButtonComponent = React.ComponentType<{
  className?: string
  url?: string
  text?: string
  [key: string]: any
}>

type HeadingComponent = React.ComponentType<{
  tag?: string
  id?: string
  children?: React.ReactNode
  [key: string]: any
}>

// Cast JS components to proper types
const TypedButton = Button as unknown as ButtonComponent
const TypedHeading = Heading as unknown as HeadingComponent

interface EventsFields {
  event: {
    startDate: string
    startTime?: string
    endDate?: string
    endTime?: string
    locationName?: string
    locationAddress?: string
    featured?: string
  }
}

interface FeaturedImage {
  node?: {
    sourceUrl: string
    altText?: string
    mediaDetails?: any
  }
}

interface EventPost {
  id: string
  title: string
  date: Date | string
  endDate?: Date | string | null
  link: string
  uri: string
  eventsFields: EventsFields
  multiDay?: boolean
  featuredImage?: FeaturedImage
}

interface ErrorObject {
  isError: true
  message: string
}

type PostsData = EventPost[] | ErrorObject | null | Record<string, never>

interface EventsListingProps {
  listing_title: string
  posts: PostsData
  showImage?: boolean
  listing_display?: string
}

function EventsListing({
  listing_title,
  posts,
  showImage,
  listing_display
}: EventsListingProps) {
  const isFrontPage = useIsFrontPage()

  if (posts === null || Object.keys(posts).length === 0) {
    return null
  }

  // Type guard for error array
  if (
    Array.isArray(posts) &&
    posts.length > 0 &&
    'isError' in posts[0] &&
    posts[0].isError
  ) {
    const errorPost = posts[0] as unknown as ErrorObject
    return <div>{errorPost.message}</div>
  }

  // Type guard for error object
  if (!Array.isArray(posts) && 'isError' in posts && posts.isError) {
    const errorObj = posts as unknown as ErrorObject
    return <div>{errorObj.message}</div>
  }

  // Type guard to ensure posts is an array of EventPost
  if (!Array.isArray(posts)) {
    return null
  }

  return (
    <section className="eventsSection">
      <div className="sectionHead">
        <div className="sectionTag">Events</div>
        <TypedHeading tag="h2" id="jump-news-listing">
          {listing_title}
        </TypedHeading>
      </div>
      <ul className="eventsList">
        {posts.map((item, index) => (
          <li key={index}>
            <EventsPostCard post={item} ctx={undefined} showImage={showImage} />
          </li>
        ))}
      </ul>
      <TypedButton
        className={!isFrontPage ? 'secondary' : ''}
        url="/events"
        text="View All Events"
      />
    </section>
  )
}

export default EventsListing
