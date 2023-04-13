import React from 'react'
import Image from 'next/image'

interface FooterItemGraphicProps {
  className?: string
  graphic: string
}

const FooterItemGraphic = ({className, graphic}: FooterItemGraphicProps) => {
  const graphicName = graphic.replace(/ /g, '-').toLowerCase()

  // Note: AO fix these images

  return (
    <div className={className}>
      {graphicName.includes('apply') ? (
        <Image
          src="/../../../assets/apply-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : graphicName.includes('info') ? (
        <Image
          src="/../../../assets/info-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : graphicName.includes('visit') ? (
        <Image
          src="/../../../assets/visit-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : graphicName.includes('give') ? (
        <Image
          src="/../../../assets/give-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : (
        <Image
          src="/../../../assets/img-prefooter.jpg"
          alt={graphic}
          width={300}
        />
      )}
    </div>
  )
}

export default FooterItemGraphic
