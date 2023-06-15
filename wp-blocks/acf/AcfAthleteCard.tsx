/* eslint-disable camelcase */
// import { useImageItem } from '@hooks/useImageQuery'
import Image from '@/components/atoms/Image/Image'
import AthleteCard from '@/components/molecules/AthleteCard'
import { gql, useQuery } from '@apollo/client'

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
  attributes: {
    data: string
  }
  imageMeta: any
}

export default function AcfAthleteCard(props: Props) {
  const attributes = props.attributes
  const { athlete_name, athlete_content, athlete_link, athlete_image } =
    JSON.parse(attributes?.data)

  // grap the athlete image
  const { loading, error, data } = useQuery(Image.query, {
    variables: { id: athlete_image }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <AthleteCard
        description={athlete_content}
        link={athlete_link?.url}
        image={data?.mediaItem}
        title={athlete_name}
      />
    </>
  )
}

AcfAthleteCard.fragments = {
  entry: gql`
    fragment AcfAthleteCardFragment on AcfAthleteCard {
      attributes {
        data
      }
    }
  `,
  key: `AcfAthleteCardFragment`
}

AcfAthleteCard.displayName = 'AcfAthleteCard'
