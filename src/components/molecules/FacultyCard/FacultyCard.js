import DefaultProfileImg from '@/assets/no-profile-image-default.jpg'
import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
import StaticImage from 'next/image'
import * as React from 'react'
import { useState } from 'react'
import styles from './FacultyCard.module.scss'

const FacultyCard = ({ title, description, email, phone, link, image }) => {
  const defaultProfileImg = DefaultProfileImg
  const [imageError, setImageError] = useState(false)

  // Transform the image URL from pantheonsite.io to wilmington.edu
  const transformImageUrl = (url) => {
    if (!url) return url
    return url.replace(
      'dev-wilmington-college.pantheonsite.io',
      'wordpress.wilmington.edu'
    )
  }

  const imageUrl = image?.sourceUrl ? transformImageUrl(image.sourceUrl) : null

  return (
    <div className={styles.facultyCard}>
      {imageUrl && !imageError ? (
        <Image
          className={styles.image}
          url={imageUrl}
          alt={image.altText || ''}
          imageMeta={{ mediaDetails: image.mediaDetails }}
          onError={() => setImageError(true)}
        />
      ) : (
        <figure className={styles.image}>
          <StaticImage
            src={defaultProfileImg.src}
            alt="Faculty Profile Image Placeholder"
            width={defaultProfileImg.width}
            height={defaultProfileImg.height}
          />
        </figure>
      )}
      <div className={styles.facultyContent}>
        <div className={styles.nameAndRole}>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className={styles.contactDetails}>
          {email ? (
            <a className={styles.email} href={`mailto:${email}`}>
              Send Email
            </a>
          ) : null}
          {phone ? (
            <a className={styles.phone} href={`tel:${phone}`}>
              {phone}
            </a>
          ) : null}
          <Link className={styles.fullBioBtn} href={link}>
            View Full Bio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FacultyCard
