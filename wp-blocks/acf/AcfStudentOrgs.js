'use client'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import StudentOrg from '@/components/molecules/StudentOrg'
import { gql } from '@apollo/client'

const AcfStudentOrgs = () => {
  const { studentOrganizations } = useWordPressContext()
  console.log(
    '🚀 ~ file: AcfStudentOrgs.js:8 ~ AcfStudentOrgs ~ studentOrganizations:',
    studentOrganizations
  )

  return (
    <>
      {studentOrganizations &&
        studentOrganizations.map((org, index) => (
          <StudentOrg
            key={index}
            heading={org.title}
            url={org.link}
            quickFact={org.orgFields.quickFacts}
          />
        ))}
    </>
  )
}

export default AcfStudentOrgs

export const StudentOrgFragment = gql`
  fragment StudentOrgFragment on Program {
    programOrgRelationship {
      programorg {
        ... on StudentOrg {
          id
          link
          title
          orgFields {
            quickFacts
          }
        }
      }
    }
  }
`
