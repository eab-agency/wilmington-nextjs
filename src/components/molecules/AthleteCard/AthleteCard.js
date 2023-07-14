'use client'

import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
import React from 'react'

const AthleteCard = ({ title, image, description, link }) => {
  return (
    <>
      <Link href={link} className="athleteCard">
        <div className="container">
          {image && (
            <Image
              url={image.mediaItemUrl}
              alt={image.altText}
              imageMeta={{ mediaDetails: image.mediaDetails }}
            />
          )}
          <div className="athleteInfo">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
        </div>
      </Link>
    </>
  )
}

export default AthleteCard
