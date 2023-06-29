import Button from '@/components/atoms/Buttons/Button'
import Heading from '@/components/atoms/Heading'
import QuickFact from '@/components/atoms/QuickFact'

function StudentOrg({ heading, url, quickFact }) {
  return (
    <article className="studentOrg">
      <div className="studentOrgContent">
        <Heading tag="h3">{heading}</Heading>
        {quickFact && <QuickFact fact={quickFact} />}
      </div>
      <Button url={url} text="Visit Org" />
    </article>
  )
}

export default StudentOrg
