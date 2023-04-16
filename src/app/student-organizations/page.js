import Container from '@/components/atoms/Container'
import StudentOrg from '@/components/molecules/StudentOrg'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'

const StudentOrgPage = async () => {
  const {
    props: { posts: studentOrgs }
  } = await getPostTypeStaticProps({}, 'studentOrgs')

  return (
    <Container>
      <h1>Student Orgs</h1>
      {studentOrgs &&
        studentOrgs.map((studentOrg, index) => {
          return (
            <StudentOrg
              key={index}
              heading={studentOrg.title}
              url={studentOrg.uri}
              quickFact={studentOrg.orgFields?.quickFacts}
            />
          )
        })}
    </Container>
  )
}

export default StudentOrgPage
