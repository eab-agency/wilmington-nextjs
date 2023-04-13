/* eslint-disable camelcase */
import React from 'react'
import NewsListing from '@/components/organisms/NewsListing'

interface BlockNewsListingProps {
  data: {
    listing_title: string
    news_listing: string[]
    listing_display: string
    news_category?: string
  }
  listingData: any
}

const BlockNewsListing = ({
  data: { listing_title, news_listing, listing_display, news_category },
  listingData
}: BlockNewsListingProps) => {
  const posts = listingData
  // if posts is an empty array, return null
  if (posts.length === 0) {
    return null
  }
  return (
    <>
      {posts && (
        <NewsListing
          posts={posts}
          listing_title={listing_title}
          listing_display={listing_display}
          showImage={false}
        />
      )}
    </>
  )
}

export default BlockNewsListing
