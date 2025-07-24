import { gql } from '@apollo/client'

const EabBlocksHeroSlide = () => {}
export default EabBlocksHeroSlide

EabBlocksHeroSlide.fragments = {
  entry: gql`
    fragment EabBlocksHeroSlideFragment on EabBlocksHeroSlide {
      attributes {
        mediaId
        media
        mediaAltHeroSlide: mediaAlt
        mediaUrl
      }
    }
  `,
  key: `EabBlocksHeroSlideFragment`
}

EabBlocksHeroSlide.displayName = 'EabBlocksHeroSlide'
