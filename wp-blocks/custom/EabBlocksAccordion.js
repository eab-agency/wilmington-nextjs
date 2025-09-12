import RichText from '@/components/atoms/RichText'
import Accordion from '@/components/molecules/Accordian/Accordian'
import { gql } from '@apollo/client'

const EabBlocksAccordion = (props) => {
  // For now, let's log the props to see the actual structure
  console.log('EabBlocksAccordion props:', props.attributes)

  // Extract title and content from the props structure
  const attributes = props.attributes || {}
  const { accordionTitle = 'Accordion Title', accordionContent = 'Accordion Content' } = attributes

  console.log('Accordion title:', accordionTitle)

  return (
    <Accordion title={accordionTitle}>
      <RichText>{accordionContent}</RichText>
    </Accordion>
  )
}

export default EabBlocksAccordion

EabBlocksAccordion.fragments = {
  entry: gql`
    fragment EabBlocksAccordionBlockFragment on EabBlocksAccordion {
      attributes {
        accordionTitle
        accordionContent
      }
    }
  `,
  key: `EabBlocksAccordionBlockFragment`
}

EabBlocksAccordion.displayName = 'EabBlocksAccordion'
