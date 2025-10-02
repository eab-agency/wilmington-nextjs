import Image from 'next/image'

interface FooterItemGraphicProps {
  className?: string
  graphic: string
}

const FooterItemGraphic = ({ className, graphic }: FooterItemGraphicProps) => {
  const graphicName = graphic.replace(/ /g, '-').toLowerCase()

  const width = 300
  const height = 300
  const quality = 65
  const ariaHidden = true

  return (
    <div className={className}>
      {graphicName.includes('apply') ? (
        <Image
          src="/apply-prefooter.jpg"
          alt="Two young female students smiling, looking at an open book together."
          width={width}
          height={height}
          aria-hidden={ariaHidden}
          quality={quality}
        />
      ) : graphicName.includes('info') ? (
        <Image
          src="/info-prefooter.jpg"
          alt="A female student sitting on a chair, writing in a laptop."
          width={width}
          height={height}
          aria-hidden={ariaHidden}
          quality={quality}
        />
      ) : graphicName.includes('visit') ? (
        <Image
          src="/visit-prefooter.jpg"
          alt="A group of students performing a theatrical play on stage."
          width={width}
          height={height}
          aria-hidden={ariaHidden}
          quality={quality}
        />
      ) : graphicName.includes('give') ? (
        <Image
          src="/give-prefooter.jpg"
          alt="A group of students wearing facemasks, while collecting donations."
          width={width}
          height={height}
          aria-hidden={ariaHidden}
          quality={quality}
        />
      ) : (
        <Image
          src="/img-prefooter.jpg"
          alt="Default graphic"
          height={height}
          width={width}
          aria-hidden={ariaHidden}
          quality={quality}
        />
      )}
    </div>
  )
}

export default FooterItemGraphic
