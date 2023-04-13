import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'
import FacultyCard from '@/components/molecules/FacultyCard/FacultyCard'

import Container from '@/components/atoms/Container'

const FacultyPage = async () => {
  const {
    props: {posts: faculty}
  } = await getPostTypeStaticProps({}, 'faculty')
  return (
    <Container>
      {faculty &&
        faculty.map((faculty, index) => {
          return (
            <FacultyCard
              key={index}
              title={`${faculty.facultyFields.faculty.first} ${faculty.facultyFields.faculty.last}`}
              description={faculty.facultyFields.faculty.position}
              image={faculty.featuredImage && faculty.featuredImage.node}
              link={faculty.uri}
              phone={faculty.facultyFields.faculty.phone}
              email={faculty.facultyFields.faculty.email}
            />
          )
        })}
    </Container>
  )
}

export default FacultyPage
