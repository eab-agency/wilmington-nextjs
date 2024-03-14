import VideoPlayer from '@/components/atoms/VideoPlayer'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './SimpleCarousel.module.scss'

const MOBILE_BREAKPOINT = 920
const SLIDE_INTERVAL = 5000

interface SimpleCarouselProps {
  children: React.ReactNode
  mediaItems: {
    imageId: string
    type: string
    mediaItem: {
      altText: string
      mediaUrl: string
    }
  }[]
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ mediaItems }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [browserWidth, setBrowserWidth] = useState(0)
  const [numSlides, setNumSlides] = useState(0)

  const mediaTypes = mediaItems.map((item) => item.type)

  const mediaItemCount = mediaItems.length

  useEffect(() => {
    const handleResize = () => {
      setBrowserWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // const mediaItemCount = mediaItems.length
    const isInternalMedia = mediaTypes.includes('internal')

    if (
      mediaItemCount > 1 &&
      browserWidth > MOBILE_BREAKPOINT &&
      !isInternalMedia
    ) {
      setNumSlides(isInternalMedia ? mediaItemCount - 1 : mediaItemCount)
      const interval = setInterval(() => {
        setCurrentSlide((currentSlide) => (currentSlide + 1) % numSlides)
      }, SLIDE_INTERVAL)
      return () => clearInterval(interval)
    } else if (
      mediaItemCount > 1 &&
      browserWidth < MOBILE_BREAKPOINT &&
      isInternalMedia
    ) {
      setCurrentSlide(1)
    } else {
      setCurrentSlide(0)
    }
  }, [mediaItems.length, browserWidth, mediaTypes, numSlides, mediaItemCount])

  const generateItemClassName = (index: number, type: string) => {
    const baseClass = `${styles.carouselItem} ${
      index === currentSlide ? styles.active : ''
    }`
    return type === 'image'
      ? `${baseClass} ${styles.heroImage}`
      : `${baseClass} ${styles.heroVideo}`
  }

  return (
    <div className={styles.carouselContainer}>
      {mediaItems.map((item, index) => {
        const { type, mediaItem } = item

        if (
          mediaItem &&
          ((type && browserWidth < MOBILE_BREAKPOINT) ||
            (type &&
              browserWidth > MOBILE_BREAKPOINT &&
              mediaItems.length > 0) ||
            (type === 'internal' && browserWidth > MOBILE_BREAKPOINT))
        ) {
          const classNames = generateItemClassName(index, type)
          return type === 'image' ? (
            <figure key={index} className={classNames}>
              <Image
                src={mediaItem.mediaUrl}
                alt={mediaItem.altText}
                width={1080}
                height={720}
                priority
              />
            </figure>
          ) : (
            <VideoPlayer
              key={index}
              className={classNames}
              src={mediaItem.mediaUrl}
              autoPlay={true}
              caption={mediaItem.altText}
            />
          )
        }

        return null
      })}
    </div>
  )
}

export default SimpleCarousel
