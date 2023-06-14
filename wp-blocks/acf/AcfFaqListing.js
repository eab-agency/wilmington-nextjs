import Accordian from '@/components/molecules/Accordian'
import { gql, useQuery } from '@apollo/client'

// component that takes in the id from the block and queries the faq data
function Faq({ id }) {
  const { loading, error, data } = useQuery(AcfFaqListing.query, {
    variables: { id }
  })
  const { title, content } = data?.fAQ ?? {}

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <Accordian title={title} key={id}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Accordian>
  )
}

// eslint-disable-next-line camelcase
export default function AcfFaqListing(props) {
  const attributes = props.attributes

  const { faqs_listing } = JSON.parse(attributes?.data)

  return (
    <>
      {faqs_listing.map((id) => (
        <Faq key={id} id={id} />
      ))}
    </>
  )
}

// fragment to get the data from the block
AcfFaqListing.fragments = {
  entry: gql`
    fragment AcfFaqListingFragment on AcfFaqListing {
      attributes {
        data
      }
    }
  `,
  key: `AcfFaqListingFragment`
}

// query to get the faq data
AcfFaqListing.query = gql`
  query GET_FAQ_BY_ID($id: ID!) {
    fAQ(id: $id, idType: DATABASE_ID) {
      title
      content
      id
    }
  }
`
