'use client'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import StudentOrg from '@/components/molecules/StudentOrg'
import { gql } from '@apollo/client'
import { className } from 'classnames/bind'

const AcfStudentOrgs = () => {
  const wordpressContext = useWordPressContext()

  if (!wordpressContext || !wordpressContext.studentOrganizations) {
    return null
  }
  const { studentOrganizations } = wordpressContext

  return (
    <div className="organizationsContent">
      <div className="organizationsList">
        {studentOrganizations &&
          studentOrganizations.map((org, index) => (
            <StudentOrg
              key={index}
              heading={org.title}
              url={org.link}
              quickFact={org.orgFields.quickFacts}
            />
          ))}
      </div>
    </div>
  )
}

export default AcfStudentOrgs

export const StudentOrgFragment = gql`
  fragment StudentOrgFragment on Program {
    programOrgRelationship {
      programOrg {
        nodes {
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
  }
`
