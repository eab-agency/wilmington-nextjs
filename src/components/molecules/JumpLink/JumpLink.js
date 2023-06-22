import { gql } from '@apollo/client'

const JumpLink = ({ jumpLinks, heading }) => {
  if (!jumpLinks) return null
  return (
    <div className="wc-jump-links">
      <h3>{heading || 'On this page'}</h3>
      <ul>
        {jumpLinks.map((block, index) => (
          <li key={index}>
            <a href={`#${block.anchor}`}>{block.content}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JumpLink
