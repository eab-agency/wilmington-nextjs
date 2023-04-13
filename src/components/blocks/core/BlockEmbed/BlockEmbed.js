'use client'

import React, {useEffect, useState} from 'react'
import VideoEmbed from '@/components/atoms/VideoEmbed'
import PropTypes from 'prop-types'

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
export default function BlockEmbed({
  className,
  url,
  caption,
  providerNameSlug
}) {
  const [loadTweet, setLoadTweet] = useState(0)
  const supportedVideoTypes = ['youtube', 'vimeo', 'tiktok', 'vimeo']
  const supportedMusicTypes = ['spotify']

  useEffect(() => {
    if (providerNameSlug === 'twitter') {
      setLoadTweet(1)
    }
  }, [providerNameSlug])

  if (!url) {
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
      {supportedVideoTypes.includes(providerNameSlug) && (
        <VideoEmbed
          className={className}
          url={url}
          caption={caption}
          type={providerNameSlug}
        />
      )}
    </>
  )
}

BlockEmbed.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
  caption: PropTypes.string,
  providerNameSlug: PropTypes.string
}
