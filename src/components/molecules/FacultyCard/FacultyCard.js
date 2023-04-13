import * as React from 'react'
import Link from '@/components/common/Link'
import Image from '@/components/atoms/Image'

const FacultyCard = ({ title, description, email, phone, link, image }) => {
  return (
    <>
      <pre>FILE: FacultyCard.js</pre>
      {image && (
        <Image
          url={image.sourceUrl}
          alt={image.altText || ''}
          imageMeta={{ mediaDetails: image.mediaDetails }}
        />
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={`mailto:${email}`}>Send Email</a>
      {phone ? <a href={`tel:${phone}`}>{phone}</a> : null}
      <Link href={link}>View Full Bio</Link>
    </>
  )
}

export default FacultyCard
