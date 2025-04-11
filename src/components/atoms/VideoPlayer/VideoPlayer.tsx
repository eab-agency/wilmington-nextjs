'use client'
import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import styles from './VideoPlayer.module.scss'

interface VideoPlayerProps {
  src: string
  autoPlay?: boolean
  caption?: string
  className?: string
  id?: string
}

interface PlayerControls {
  play: () => void
  pause: () => void
}

interface VideoElementWithControls extends HTMLVideoElement {
  playerControls?: PlayerControls
}

// Type assertion for RichText since it's a JS component
const TypedRichText = RichText as unknown as React.FC<{
  tag: string
  className?: string
  id?: string
  attributes?: string | Record<string, unknown>
  dropCap?: boolean
  style?: React.CSSProperties
  children?: React.ReactNode
}>

export default function VideoPlayer({
  src,
  autoPlay = false,
  caption,
  className,
  id
}: VideoPlayerProps) {
  const videoRef = useRef<VideoElementWithControls>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay)

  const videoPlayerClasses = cn(styles.videoPlayer, className)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playerControls = {
        play: () => {
          videoRef.current?.play()
          setIsPlaying(true)
        },
        pause: () => {
          videoRef.current?.pause()
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
    if (videoElement?.playerControls) {
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
          <TypedRichText
            tag="span"
            className={styles.captionText}
            id={`${id}-caption`}
            attributes={{}}
            dropCap={false}
            style={{}}
          >
            {caption}
          </TypedRichText>
        </figcaption>
      )}
      <button onClick={handleVideoAction} className={styles.toggleButton}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </figure>
  )
}
