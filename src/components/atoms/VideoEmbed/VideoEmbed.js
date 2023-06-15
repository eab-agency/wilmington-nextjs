import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import * as styles from './VideoEmbed.module.css'

/**
 * VideoEmbed Block
 *
 * @param  {object}  props           VideoEmbed component props.
 * @param  {string}  props.className Optional className.
 * @param  {string}  props.url       The full URL to the video.
 * @param  {string}  props.type      The type of video (youtube, vimeo).
 * @param  {string}  props.caption   Optional caption.
 * @return {Element}                 The VideoEmbed component.
 */
export default function VideoEmbed({ className, url, type, caption }) {
  /**
   * Create URL embed for YouTube or Vimeo videos.
   *
   * @param  {string} url The video URL.
   * @return {string}     Formatted video URL.
   */
  function createVideoUrl(url) {
    if (!url) {
      return false
    }

    let videoUrl, videoId

    // Extract video ID
    videoId =
      url.indexOf('v=') !== -1
        ? url.split('v=')[1]
        : url.split('/')[url.split('/').length - 1]

    // Strip out anything after the "&" character
    if (videoId.indexOf('&') !== -1) {
      videoId = videoId.substring(0, videoId.indexOf('&'))
    }

    // switch statement for url
    switch (type) {
      case 'youtube':
        videoUrl = `https://youtube.com/embed/${videoId}`
        break
      case 'vimeo':
        videoUrl = `//player.vimeo.com/video/${videoId}`
        break
      case 'tiktok':
        // remove everything after the first question mark in videoId
        videoId = videoId.split('?')[0]
        videoUrl = `//www.tiktok.com/embed/${videoId}`
        break
      default:
        videoUrl = url
    }

    return videoUrl
  }

  return (
    <div className={cn(styles.videoEmbed, className)}>
      <div className={styles.wrapper}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          height="405"
          width="720"
          src={createVideoUrl(url)}
          title={`Embedded content from ${type}`}
          className={className}
        ></iframe>
      </div>
      {!!caption && (
        <div className={styles.caption}>
          <RichText tag="span">{caption}</RichText>
        </div>
      )}
    </div>
  )
}

VideoEmbed.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string.isRequired
}
