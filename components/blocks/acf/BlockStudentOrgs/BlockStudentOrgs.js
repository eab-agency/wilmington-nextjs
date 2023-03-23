import React from 'react'
import StudentOrg from '@/components/molecules/StudentOrg'

const BlockStudentOrgs = ({ programorg }) => {
  return (
    <>
      {programorg && programorg.map((org, index) => <StudentOrg key={index} heading={org.title} url={org.link} quickFact={org.orgFields.quickFacts} />)}
    </>
  )
}

export default BlockStudentOrgs
