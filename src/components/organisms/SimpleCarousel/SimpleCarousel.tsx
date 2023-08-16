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
  const [browserWidth, setBrowserWidth] = useState(0)

  useEffect(() => {
    if (mediaItems.length > 1 && browserWidth > 920) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (currentSlide) => (currentSlide + 1) % mediaItems.length
        )
      }, 5000)
      return () => clearInterval(interval)
    } else {
      setCurrentSlide(0)
    }
  }, [mediaItems.length, browserWidth])

  useEffect(() => {
    const handleResize = () => {
      setBrowserWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    // call listener function at initial page load
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
          } else if (item.type === 'internal' && browserWidth > 920) {
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
