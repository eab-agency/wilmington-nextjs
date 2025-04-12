'use client'
import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import styles from './VideoPlayer.module.scss'

export default function VideoPlayer({ src, autoPlay, caption, className, id }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const videoPlayerClasses = cn(styles.videoPlayer, className)

  // Create an object with methods that can be accessed via ref
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playerControls = {
        play: () => {
          videoRef.current.play()
          setIsPlaying(true)
        },
        pause: () => {
          videoRef.current.pause()
          setIsPlaying(false)
        }
      }
    }
  }, [])

  useEffect(() => {
    const videoElement = videoRef.current

    if (autoPlay && videoElement) {
      videoElement.play()
      setIsPlaying(true)
    }
  }, [autoPlay])

  const handleVideoAction = () => {
    const videoElement = videoRef.current
    if (videoElement) {
      if (isPlaying) {
        videoElement.playerControls.pause()
      } else {
        videoElement.playerControls.play()
      }
    }
  }

  return (
    <figure className={videoPlayerClasses}>
      <div className={styles.wrapper}>
        <video id={id} ref={videoRef} src={src} muted loop playsInline />
      </div>
      {!!caption && (
        <figcaption className={styles.caption}>
          <RichText tag="span">{caption}</RichText>
        </figcaption>
      )}
      <button onClick={handleVideoAction} className={styles.toggleButton}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </figure>
  )
}
