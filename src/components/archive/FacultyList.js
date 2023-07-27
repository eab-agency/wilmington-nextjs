import FacultyCard from '@/components/molecules/FacultyCard'
import React from 'react'

export const FacultyList = ({ posts, ...props }) => {
  return (
    <div {...props}>
      {posts?.map(
        ({
          id,
          title,
          facultyFields: { faculty },
          email,
          phone,
          uri,
          featuredImage
        }) => {
          const image = featuredImage?.node
          return (
            <FacultyCard
              key={id}
              title={title}
              description={faculty.position}
              email={email}
              phone={phone}
              link={uri}
              image={image}
            />
          )
        }
      )}
    </div>
  )
}
