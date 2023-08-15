import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import React, { useEffect, useRef } from 'react'
import * as styles from './VideoPlayer.module.css'

export default function VideoPlayer({ src, autoPlay, caption, className }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current

    if (autoPlay && videoElement) {
      videoElement.play()
    }
  }, [autoPlay])
  return (
    <div className={cn(styles.videoPlayer, className)}>
      <div className={styles.wrapper}>
        <video ref={videoRef} src={src} muted loop />
      </div>
      {!!caption && (
        <div className={styles.caption}>
          <RichText tag="span">{caption}</RichText>
        </div>
      )}
    </div>
  )
}
