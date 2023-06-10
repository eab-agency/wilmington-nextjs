import { gql } from '@apollo/client'
import Link from 'next/link'

export default function ArchivePrograms(props) {
  const { label, contentNodes } = props.data.nodeByUri

  return (
    <>
      <h1>{label}</h1>

      <ul>
        {contentNodes.nodes.map((node) => (
          <li key={node.title}>
            <Link href={node.uri}>{node.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

ArchivePrograms.variables = ({ uri }) => {
  return { uri }
}

ArchivePrograms.query = gql`
  query ProgramArchive($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on ContentType {
        label
        description
        contentNodes {
          nodes {
            databaseId
            uri
            ... on NodeWithTitle {
              title
            }
          }
        }
      }
    }
  }
`
