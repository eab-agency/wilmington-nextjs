/* eslint-disable camelcase */
// import { useImageItem } from '@hooks/useImageQuery'
import AthleteCard from '@/components/molecules/AthleteCard'

/**
 * Athlete Block
 *
 * The acf Athlete Block from colab.
 *
 * @param  {object}  props              Athlete component props.
 * @param  {string}  props.athlete_content         Athlete body text.
 * @param  {string}  props.athlete_link   The link attributes.
 * @param  {object}  props.athlete_image        The image object.
 * @param  {string}  props.athlete_name        The card title.
 * @return {Element}                    The Card component.
 */

interface AthleteLink {
  title: string
  url: string
  target: string
}

interface Props {
  data: {
    athlete_name: string
    athlete_content: string
    athlete_image: number
    athlete_link: AthleteLink
  }
  imageMeta: any
}

export default function BlockAthleteCard({
  data: { athlete_name, athlete_content, athlete_link },
  imageMeta
}: Props) {
  return (
    <AthleteCard
      description={athlete_content}
      link={athlete_link?.url}
      image={imageMeta}
      title={athlete_name}
    />
  )
}
