import DefaultProfileImg from '@/assets/no-profile-image-default.jpg'
import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
import { className } from 'classnames/bind'
import StaticImage from 'next/image'
import * as React from 'react'
import styles from './FacultyCard.module.scss'

const FacultyCard = ({ title, description, email, phone, link, image }) => {
  const defaultProfileImg = DefaultProfileImg
  return (
    <div className={styles.facultyCard}>
      {image ? (
        <Image
          className={styles.image}
          url={image.sourceUrl}
          alt={image.altText || ''}
          imageMeta={{ mediaDetails: image.mediaDetails }}
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
