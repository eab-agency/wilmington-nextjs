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
            zIndex: 2
          }}
        />
      )}

      <WordPressBlocksViewer blocks={props?.children ?? []} />
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
    }
  `,
  key: `EabBlocksStudentLifeMicroformFragment`
}

// <div class="show-overlay wp-block-eab-blocks-student-life-microform">

// 					<figure><img width="1024" height="541" src="https://wordpress.wilmington.edu/wp-content/uploads/2023/06/175-FinancialAidHERO-scaled-e1698166807306-1024x541.jpg" class="attachment-large size-large" alt="" decoding="async" loading="lazy" srcset="https://wordpress.wilmington.edu/wp-content/uploads/2023/06/175-FinancialAidHERO-scaled-e1698166807306-1024x541.jpg 1024w, https://wordpress.wilmington.edu/wp-content/uploads/2023/06/175-FinancialAidHERO-scaled-e1698166807306-500x264.jpg 500w, https://wordpress.wilmington.edu/wp-content/uploads/2023/06/175-FinancialAidHERO-scaled-e1698166807306-768x406.jpg 768w, https://wordpress.wilmington.edu/wp-content/uploads/2023/06/175-FinancialAidHERO-scaled-e1698166807306-1536x811.jpg 1536w, https://wordpress.wilmington.edu/wp-content/uploads/2023/06/175-FinancialAidHERO-scaled-e1698166807306-2048x1082.jpg 2048w" sizes="auto, (max-width: 1024px) 100vw, 1024px"></figure>

// 					<div class="overlay" style="
// 				background-image:linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 100%);
// 				opacity: 0.5;
// 				display: block;
// 				width: 100%;
// 				height: 100%;
// 				position: absolute;
// 				top: 0;
// 				left: 0;
// 				z-index: 2;
// 				"></div>

// <div class="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-9d6595d7 wp-block-columns-is-layout-flex">
// <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
// <h2 class="wp-block-heading">Ask Us Anything About Admission or Financial Aid at Wilmington</h2>

// <p>Interested in learning more about our admission process? Or have questions about financial aid? Reach out to us today and get the answers you need. We would be happy to help!</p>

// <div class="wp-block-buttons is-vertical is-layout-flex wp-container-core-buttons-is-layout-8cf370e7 wp-block-buttons-is-layout-flex">
// <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="https://www.wilmington.edu/admission/apply">LEARN HOW TO APPLY</a></div>

// <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="https://www.wilmington.edu/financial-aid/types-of-aid">DISCOVER TYPES OF AID</a></div>
// </div>
// </div>

// <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow"><div class="formstack-embed">
// 			<script type="text/javascript" src="https://wilmingtoncollege.formstack.com/forms/js.php/request_for_information_lite"></script>
// 			<noscript><a href='https://wilmingtoncollege.formstack.com/forms/request_for_information_lite' title='Online Form'>Online Form - request_for_information_lite</a></noscript>
// 			<div style="text-align:right; font-size:x-small;"></div>
// 		</div></div>
// </div>

// 	</div>
