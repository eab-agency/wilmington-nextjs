import getPostTypeArchive from '@/functions/wordpress/postTypes/getPostTypeArchive'
import Link from 'next/link'

// TODO: AO: We probably want to make these into their own components

const Programs = ({ programs }: { programs: any[] }) => {
  return (
    <div>
      {programs.map((program, index) => (
        <div key={index}>
          <h3>
            <Link href={program.uri}>{program.title}</Link>
          </h3>
        </div>
      ))}
    </div>
  )
}

const DepartmentItem = ({ department }: { department: any }) => {
  const { programs } = department

  if (programs.nodes.length === 0) {
    return null
  }
  return (
    <div key={department.databaseId}>
      <h2>{department.name}</h2>
      <p>{department.description}</p>
      <Programs programs={programs.nodes} />
    </div>
  )
}

export default async function NotFound() {
  const { posts }: { posts?: any[] } = await getPostTypeArchive('department')

  return (
    <>
      <h1>Uh oh! This program could not be found</h1>
      <p>Here are some other programs you might be interested in:</p>
      {posts &&
        posts.map((department, index) => (
          <DepartmentItem department={department} key={index} />
        ))}
    </>
  )
}
