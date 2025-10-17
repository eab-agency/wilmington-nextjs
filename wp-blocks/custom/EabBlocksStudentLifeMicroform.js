import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

const EabBlocksStudentLifeMicroform = (props) => {
  const {
    bgImageUrl,
    overlayGradient,
    overlayOpacity,
    showOverlay,
    className
  } = props.attributes || {}

  return (
    <div
      className={`${className ?? ''} ${
        showOverlay ? 'show-overlay' : ''
      } wp-block-eab-blocks-student-life-microform`}
      style={{ position: 'relative' }}
    >
      {bgImageUrl && (
        <figure>
          <img src={bgImageUrl} alt="" />
        </figure>
      )}

      {showOverlay && (
        <div
          className="overlay"
          style={{
            backgroundImage: overlayGradient,
            opacity: overlayOpacity,
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <WordPressBlocksViewer blocks={props?.children ?? []} />
      </div>
    </div>
  )
}

export default EabBlocksStudentLifeMicroform

EabBlocksStudentLifeMicroform.displayName = 'EabBlocksStudentLifeMicroform'

EabBlocksStudentLifeMicroform.fragments = {
  entry: gql`
    fragment EabBlocksStudentLifeMicroformFragment on EabBlocksStudentLifeMicroform {
      attributes {
        bgImageUrl
        className
        overlayColor
        overlayGradient
        overlayOpacity
        showOverlay
      }
      innerBlocks {
        name
      }
    }
  `,
  key: `EabBlocksStudentLifeMicroformFragment`
}
