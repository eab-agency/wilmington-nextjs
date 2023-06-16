import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import * as styles from './MusicEmbed.module.css'

/**
 * MusicEmbed Block
 *
 * @param  {object}  props           MusicEmbed component props.
 * @param  {string}  props.className Optional className.
 * @param  {string}  props.url       The full URL to the music.
 * @param  {string}  props.type      The type of music (youtube, vimeo).
 * @param  {string}  props.caption   Optional caption.
 * @return {Element}                 The MusicEmbed component.
 */
export default function MusicEmbed({ className, url, type, caption }) {
  /**
   * Create URL embed for YouTube or Vimeo musics.
   *
   * @param  {string} url The music URL.
   * @return {string}     Formatted music URL.
   */
  function createMusicUrl(url) {
    if (!url) {
      return false
    }

    let musicUrl, musicId

    musicId = url.indexOf('v=') !== -1 ? url.split('v=') : url.split('/')
    musicId = musicId[musicId.length - 1]

    // switch statement for url
    switch (type) {
      case 'spotify':
        musicUrl = `//open.spotify.com/embed/track/${musicId}`
        break
      default:
        musicUrl = url
    }

    // musicUrl = url.includes('vimeo')
    //   ? `//player.vimeo.com/music/${musicId}`
    //   : `//youtube.com/embed/${musicId}`

    return musicUrl
  }

  return (
    <div className={cn(styles.MusicEmbed, className)}>
      <div className={styles.wrapper}>
        <iframe
          src={createMusicUrl(url)}
          width="100%"
          height="352"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
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

MusicEmbed.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string.isRequired
}
