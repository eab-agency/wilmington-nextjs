import { gql } from '@apollo/client';

const EabProgramJumplinks = (props) => {
  const { jumpLinks } = props.attributes
  const parsedJumpLinks = JSON.parse(jumpLinks);
  return (
    <div className="wp-block-eab-program-jumplinks">
      <section>
        <h3 className="wp-block-eab-program-jumplinks">On this page</h3>
        <ul>
          {parsedJumpLinks.map((block, index) => (
            <li key={index}>
              <a href={`#${block.id}`}>{block.rawHtml}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>)
}

export default EabProgramJumplinks

EabProgramJumplinks.fragments = {
  entry: gql`
    fragment EabProgramJumplinksFragment on EabProgramJumplinks {
      attributes {
        jumpLinks
      }
    }
  `,
  key: `EabProgramJumplinksFragment`
}

EabProgramJumplinks.displayName = 'EabProgramJumplinks'
