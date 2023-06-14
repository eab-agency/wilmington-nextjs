'use client'

/* eslint-disable camelcase */
import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import RelatedProgramCard from '@/components/molecules/RelatedProgramCard'
import styles from './BlockRelatedPrograms.module.scss'

/**
 * Featured Programs Block
 *
 * The acf featured program block from colab.
 *
 * @param  {object}  props              featured component props.
 * @return {Element}                    The Card component.
 */

export default function BlockRelatedPrograms() {
  // flatten all the programs in the needToFlatten array
  const { departments } = useWordPressContext()

  if (!departments) {
    return null
  }

  const flattenedPrograms = departments.reduce((acc, item) => {
    return [...acc, ...item.programs.nodes]
  }, [])

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

  return (
    <section className={styles.relatedPrograms}>
      <div className={styles.programsContainer}>
        <h2>Related Programs</h2>
        <MultiCarousel
          responsive={responsive}
          infinite
          containerClass={styles.programsCarousel}
        >
          {flattenedPrograms &&
            flattenedPrograms.map((program, index) => (
              <RelatedProgramCard
                key={index}
                title={program.title}
                excerpt={program.excerpt}
                link={program.uri}
                image={program.featuredImage?.node?.gatsbyImage}
              />
            ))}
        </MultiCarousel>
        <div className={styles.viewAllCta}>
          <Button
            url="/programs"
            className="secondary"
            text="View All Programs"
          />
        </div>
      </div>
    </section>
  )
}
