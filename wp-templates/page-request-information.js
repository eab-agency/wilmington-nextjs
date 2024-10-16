/* eslint-disable no-console */
import Container from '@/components/atoms/Container'
import Layout from '@/components/common/Layout'
import FormStack from '@/components/molecules/Form/FormStack'

// FOR TESTING ONLY. DELETE THIS PAGE IN PRODUCTION

export default function Component(props) {
  return (
    <>
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <div className="page-content">
              <FormStack formId="3222784" />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}
