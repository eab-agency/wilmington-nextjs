/* eslint-disable camelcase */
import Button from '@/components/atoms/Buttons/Button'
import ProgramCard from '@/components/molecules/ProgramCard'
import Carousel from 'react-multi-carousel'
import styles from './BlockFeaturedPrograms.module.scss'

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
    breakpoint: { max: 4000, min: 1200 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 1200, min: 900 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 900, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

export default function BlockFeaturedPrograms({ listingData }) {
  const featuredPrograms = listingData.flat().concat()
  return (
    <section className={styles.featuredPrograms}>
      <h2>Featured Programs</h2>
      <Carousel
        containerClass={styles.carouselContainer}
        responsive={responsive}
        infinite
      >
        {featuredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            title={program.title}
            excerpt={program.excerpt}
            link={program.uri}
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
