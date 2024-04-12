import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import React, { useEffect, useRef } from 'react'
import * as styles from './VideoPlayer.module.css'

export default function VideoPlayer({ src, autoPlay, caption, className }) {
  const videoRef = useRef(null)

  const videoPlayerClasses = cn(styles.videoPlayer, className)

  useEffect(() => {
    const videoElement = videoRef.current

    if (autoPlay && videoElement) {
      videoElement.play()
    }
  }, [autoPlay])
  return (
    <figure className={videoPlayerClasses}>
      <div className={styles.wrapper}>
        <video ref={videoRef} src={src} muted loop playsInline />
      </div>
      {!!caption && (
        <figcaption className={styles.caption}>
          <RichText tag="span">{caption}</RichText>
        </figcaption>
      )}
    </figure>
  )
}
