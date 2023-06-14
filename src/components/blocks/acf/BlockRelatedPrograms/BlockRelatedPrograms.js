'use client'

/* eslint-disable camelcase */
import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import ProgramCard from '@/components/molecules/ProgramCard'
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
      items: 5
    },
    desktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 40
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 40
    }
  }

  return (
    <section className={styles.relatedPrograms}>
      <div className={styles.programsContainer}>
        <MultiCarousel
          responsive={responsive}
          showDots={true}
          containerClass={styles.programsCarousel}
        >
          {flattenedPrograms &&
            flattenedPrograms.map((program, index) => (
              <ProgramCard
                key={index}
                title={program.title}
                excerpt={program.excerpt}
                link={program.uri}
                image={program.featuredImage?.node?.gatsbyImage}
              />
            ))}
        </MultiCarousel>
        <Button url="/programs" text="View All Programs" />
      </div>
    </section>
  )
}
