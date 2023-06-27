import Button from '@/components/atoms/Buttons/Button'
import MultiCarousel from '@/components/common/MultiCarousel'
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

export default function BlockRelatedPrograms({ departments }) {
  // TODO: This component stays bc wp-blocks component points to it

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
        <h2 id="jump-related-programs">Related Programs</h2>
        <MultiCarousel
          responsive={responsive}
          infinite
          containerClass={styles.programsCarousel}
        >
          {departments &&
            departments.map((program, index) => (
              <RelatedProgramCard
                key={index}
                title={program.title}
                excerpt={program.excerpt}
                link={program.uri}
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
