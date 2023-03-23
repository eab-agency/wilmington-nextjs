import React from "react"
import Image from 'next/image';

interface FooterItemGraphicProps {
  className?: string
  graphic: string
}

const FooterItemGraphic = ({ className, graphic }: FooterItemGraphicProps) => {
  const graphicName = graphic.replace(/ /g, "-").toLowerCase()

  return (
    <div className={className}>
      {graphicName.includes("apply") ? (
        <Image src="../../../assets/apply-prefooter.jpg" alt={graphic} />
      ) : graphicName.includes("info") ? (
        <Image src="../../../assets/info-prefooter.jpg" alt={graphic} />
      ) : graphicName.includes("visit") ? (
        <Image src="../../../assets/visit-prefooter.jpg" alt={graphic} />
      ) : graphicName.includes("give") ? (
        <Image src="../../../assets/give-prefooter.jpg" alt={graphic} />
      ) : (
        <Image src="../../../assets/img-prefooter.jpg" alt={graphic} />
      )}
    </div>
  )
}

export default FooterItemGraphic
