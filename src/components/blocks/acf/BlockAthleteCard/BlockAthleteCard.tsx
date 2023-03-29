/* eslint-disable camelcase */
import React from 'react'
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

interface Image {
  altText?: string
  caption?: string
  databaaseId: number
  sourceUrl: string
  gatsbyImage: any
}

interface Props {
  athlete_name: string
  athlete_content: string
  athlete_image: number
  athlete_link: AthleteLink
}

export default function BlockAthleteCard ({
  athlete_name,
  athlete_content,
  athlete_image,
  athlete_link
}: Props) {
  // const image: Image = useImageItem(athlete_image)
  const image: Image = { databaaseId: 0, sourceUrl: '', gatsbyImage: null }

  return (
      <AthleteCard
        description={athlete_content}
        link={athlete_link.url}
        image={image}
        title={athlete_name}
      />
  )
}
