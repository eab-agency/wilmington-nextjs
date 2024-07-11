'use client'

import { ReactNode } from 'react'
import Carousel, { CarouselProps } from 'react-multi-carousel'
// import 'react-multi-carousel/lib/styles.css'

/**
 * @param {string} containerClass - Class to be applied to the container
 * @param {ReactNode} children - Children to be rendered
 */

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
      {/* @ts-expect-error Server Component */}
      <Carousel containerClass={containerClass} {...carouselProps}>
        {children}
      </Carousel>
    </>
  )
}

export default MultiCarousel
