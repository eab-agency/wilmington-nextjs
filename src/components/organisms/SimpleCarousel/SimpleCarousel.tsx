import Image from '@/components/atoms/Image'
import VideoPlayer from '@/components/atoms/VideoPlayer'
import React, { useEffect, useState } from 'react'
import styles from './SimpleCarousel.module.scss'

interface SimpleCarouselProps {
  children: React.ReactNode
  mediaItems: {
    imageId: string
    type: string
    mediaItem: {
      altText: string
      mediaItemUrl: string
    }
  }[]
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({
  mediaItems,
  children
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((currentSlide) => (currentSlide + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className={styles.carouselContainer}>
        {mediaItems.map((item, index) => {
          if (item.type === 'image') {
            return (
              <Image
                key={index}
                src={item.mediaItem.mediaItemUrl}
                alt={item.mediaItem.altText}
                priority={true}
                imageMeta={item.mediaItem}
                className={`${styles.carouselItem} ${styles.heroImage} ${
                  index === currentSlide ? styles.active : ''
                }`}
              />
            )
          } else if (item.type === 'internal') {
            return (
              <VideoPlayer
                key={index}
                className={`${styles.carouselItem} ${styles.heroVideo} ${
                  index === currentSlide ? styles.active : ''
                }`}
                src={item.mediaItem.mediaItemUrl}
                autoPlay={true}
                caption={item.mediaItem.altText}
              />
            )
          } else {
            return null
          }
        })}
      </div>
    </>
  )
}

export default SimpleCarousel
