import React from 'react'
import ArchiveTitle from './ArchiveTitle'
import Description from './Description'
import { Pagination } from './Pagination'
import { PostsList } from './PostsList'

export const Archive = ({ posts, ctx, name, description }) => {
  return (
    <>
      {name && <ArchiveTitle text={name} name="articles" />}
      {description && <Description description={description} />}
      <PostsList posts={posts} />
      <Pagination ctx={ctx} />
    </>
  )
}

export default Archive
