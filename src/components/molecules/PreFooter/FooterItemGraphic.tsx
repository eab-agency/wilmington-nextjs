import Image from 'next/image'

interface FooterItemGraphicProps {
  className?: string
  graphic: string
}

const FooterItemGraphic = ({ className, graphic }: FooterItemGraphicProps) => {
  const graphicName = graphic.replace(/ /g, '-').toLowerCase()

  return (
    <div className={className}>
      {graphicName.includes('apply') ? (
        <Image
          src="/apply-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : graphicName.includes('info') ? (
        <Image
          src="/info-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : graphicName.includes('visit') ? (
        <Image
          src="/visit-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : graphicName.includes('give') ? (
        <Image
          src="/give-prefooter.jpg"
          alt={graphic}
          width={300}
          height={300}
        />
      ) : (
        <Image
          src="/img-prefooter.jpg"
          alt={graphic}
          height={300}
          width={300}
        />
      )}
    </div>
  )
}

export default FooterItemGraphic
