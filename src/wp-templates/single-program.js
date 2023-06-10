import { gql } from "@apollo/client";

export default function SingleProgram(props) {
  const { title, content } = props.data.nodeByUri;

  return (
    <>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}

SingleProgram.variables = ({ uri }) => {
  return { uri };
};

SingleProgram.query = gql`
  query GetProgramByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on NodeWithTitle {
        title
      }
      ... on NodeWithContentEditor {
        content
      }
    }
  }
`;
