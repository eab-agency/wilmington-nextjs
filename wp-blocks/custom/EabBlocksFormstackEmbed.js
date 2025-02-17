import FormStack from '@/components/molecules/Form/FormStack'
import { gql } from '@apollo/client'

const EabBlocksFormstackEmbed = (props) => {
  const { formId } = props.attributes
  return <FormStack formId={formId} />
}
export default EabBlocksFormstackEmbed

EabBlocksFormstackEmbed.fragments = {
  entry: gql`
    fragment EabBlocksFormstackEmbedFragment on EabBlocksFormstackEmbed {
      attributes {
        formId
      }
    }
  `,
  key: `EabBlocksFormstackEmbedFragment`
}

EabBlocksFormstackEmbed.displayName = 'EabBlocksFormstackEmbed'
