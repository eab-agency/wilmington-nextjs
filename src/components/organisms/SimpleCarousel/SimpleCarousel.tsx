// import Image from '@/components/atoms/Image'
import VideoPlayer from '@/components/atoms/VideoPlayer'
import Image from 'next/image'
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

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ mediaItems }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  // const [mediaType, setMediaType] = useState('image')
  const types = mediaItems.map((item) => item.type).join(', ')

  useEffect(() => {
    if (mediaItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (currentSlide) => (currentSlide + 1) % mediaItems.length
        )
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [mediaItems.length])

  return (
    <>
      <div className={styles.carouselContainer}>
        {mediaItems.map((item, index) => {
          if (item.type === 'image') {
            return (
              <figure
                key={index}
                className={`${styles.carouselItem} ${styles.heroImage} ${
                  index === currentSlide ? styles.active : ''
                }`}
              >
                <Image
                  src={item.mediaItem.mediaItemUrl}
                  alt={item.mediaItem.altText}
                  width={1080}
                  height={720}
                />
              </figure>
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
