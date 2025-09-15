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
          alt=""
          width={300}
          height={300}
          aria-hidden="true"
        />
      ) : graphicName.includes('info') ? (
        <Image
          src="/info-prefooter.jpg"
          alt=""
          width={300}
          height={300}
          aria-hidden="true"
        />
      ) : graphicName.includes('visit') ? (
        <Image
          src="/visit-prefooter.jpg"
          alt=""
          width={300}
          height={300}
          aria-hidden="true"
        />
      ) : graphicName.includes('give') ? (
        <Image
          src="/give-prefooter.jpg"
          alt=""
          width={300}
          height={300}
          aria-hidden="true"
        />
      ) : (
        <Image
          src="/img-prefooter.jpg"
          alt=""
          height={300}
          width={300}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default FooterItemGraphic
