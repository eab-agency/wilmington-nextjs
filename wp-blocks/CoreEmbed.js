/* eslint-disable no-unused-vars */
'use client'

import VideoEmbed from '@/components/atoms/VideoEmbed'
import { gql } from '@apollo/client'
import { useEffect, useState } from 'react'

// import Tweet from '@/components/atoms/TwitterEmbed'
// import MusicEmbed from '@/components/atoms/MusicEmbed'

/**
 * Embed Block
 *
 * The core Embed block from Gutenberg.
 *
 * @param  {object}  props                  The component properties.
 * @param  {string}  props.className        Optional classnames.
 * @param  {string}  props.url              The URL of the video.
 * @param  {string}  props.caption          Optional caption.
 * @param  {string}  props.providerNameSlug The type of embed.
 * @return {Element}                        The component to embed.
 */
export default function CoreEmbed(props) {
  const attributes = props.attributes
  const [loadTweet, setLoadTweet] = useState(0)
  const supportedVideoTypes = ['youtube', 'vimeo', 'tiktok', 'vimeo']
  const supportedMusicTypes = ['spotify']

  useEffect(() => {
    if (attributes?.providerNameSlug === 'twitter') {
      setLoadTweet(1)
    }
  }, [attributes?.providerNameSlug])

  if (!attributes?.url) {
    return
  }

  return (
    <>
      {/* {!!loadTweet && (
        <Tweet className={className} url={url} caption={caption} />
      )}
      {supportedMusicTypes.includes(providerNameSlug) && (
        <MusicEmbed
          className={className}
          url={url}
          caption={caption}
          type={providerNameSlug}
        />
      )} */}
      {supportedVideoTypes.includes(attributes?.providerNameSlug) && (
        <VideoEmbed
          className={attributes?.className}
          url={attributes?.url}
          caption={attributes?.caption}
          type={attributes?.providerNameSlug}
        />
      )}
    </>
  )
}

CoreEmbed.fragments = {
  entry: gql`
    fragment CoreEmbedFragment on CoreEmbed {
      attributes {
        className
        url
        caption
        providerNameSlug
      }
    }
  `,
  key: `CoreEmbedFragment`
}

CoreEmbed.displayName = 'CoreEmbed'
