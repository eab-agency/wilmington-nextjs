/* eslint-disable camelcase */
import React from "react"
import ProgramCard from "@/components/molecules/ProgramCard"
import Button from "@/components/atoms/Buttons/Button"
import * as styles from "./BlockFeaturedPrograms.module.scss"
import Carousel from "react-multi-carousel"

/**
 * Featured Programs Block
 *
 * The acf featured program block from colab.
 *
 * @param  {object}  props              featured component props.
 * @return {Element}                    The Card component.
 */

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

export default function BlockFacultyCards({ data, listingData }) {
  const featuredPrograms = listingData.flat().concat()
  return (
    <section className={styles.featuredPrograms}>
      <h2>Featured Programs</h2>
      <Carousel className={styles.carousel} responsive={responsive}>
        {featuredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            title={program.title}
            excerpt={program.excerpt}
            link={program.link}
            image={program.featuredImage?.node}
          />
        ))}
      </Carousel>
      <div className={styles.viewAllCta}>
        <Button url="/programs" text="View All Programs" secondary />
      </div>
    </section>
  )
}
