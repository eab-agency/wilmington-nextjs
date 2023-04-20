'use client'

import { ReactNode } from 'react'
import Carousel, { CarouselProps } from 'react-multi-carousel'
// import 'react-multi-carousel/lib/styles.css'

interface MultiCarouselProps extends CarouselProps {
  children: ReactNode
  containerClass?: string
}

const MultiCarousel = ({
  children,
  containerClass = '',
  ...carouselProps
}: MultiCarouselProps) => {
  return (
    <>
      <Carousel containerClass={containerClass} {...carouselProps}>
        {children}
      </Carousel>
    </>
  )
}

export default MultiCarousel
