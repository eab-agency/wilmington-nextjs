import { gql } from '@apollo/client'

const EabBlocksHeroSlide = () => {}
export default EabBlocksHeroSlide

EabBlocksHeroSlide.fragments = {
  entry: gql`
    fragment EabBlocksHeroSlideFragment on EabBlocksHeroSlide {
      attributes {
        mediaId
        media
        slideMediaAlt: mediaAlt
        mediaUrl
      }
    }
  `,
  key: `EabBlocksHeroSlideFragment`
}

EabBlocksHeroSlide.displayName = 'EabBlocksHeroSlide'
