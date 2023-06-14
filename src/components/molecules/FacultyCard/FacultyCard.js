import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
import * as React from 'react'
import styles from './FacultyCard.module.scss'

const FacultyCard = ({ title, description, email, phone, link, image }) => {
  return (
    <div className={styles.facultyCard}>
      {image && (
        <Image
          className={styles.image}
          url={image.sourceUrl}
          alt={image.altText || ''}
          imageMeta={{ mediaDetails: image.mediaDetails }}
        />
      )}
      <div className={styles.facultyContent}>
        <div className={styles.nameAndRole}>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className={styles.contactDetails}>
          <a className={styles.email} href={`mailto:${email}`}>
            Send Email
          </a>
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
