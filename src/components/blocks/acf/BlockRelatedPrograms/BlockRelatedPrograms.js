'use client'

/* eslint-disable camelcase */
import Link from '@/components/common/Link'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import ProgramCard from '@/components/molecules/ProgramCard'

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

  return (
    <>
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
      <div>
        <Link href="/programs">View All Programs</Link>
      </div>
    </>
  )
}
