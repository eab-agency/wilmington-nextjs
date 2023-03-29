import React from 'react'
import StudentOrg from '@/components/molecules/StudentOrg'
import { useWordPressContext } from '@/components/common/WordPressProvider'

const BlockStudentOrgs = () => {
  const { studentOrganizations } = useWordPressContext()

  return (
    <>
      {studentOrganizations && studentOrganizations.map((org, index) => <StudentOrg key={index} heading={org.title} url={org.link} quickFact={org.orgFields.quickFacts} />)}
    </>
  )
}

export default BlockStudentOrgs
