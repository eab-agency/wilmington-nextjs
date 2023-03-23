import React from 'react'
// import { ParsedContent } from "~/utils";
import ParsedContent from '@/functions/parsedContent'
import Link from '@/components/common/Link'

export const PostEntryContent = ({ post, location, ...props }) => {
  const content = location === 'single' ? post.content : post.excerpt

  return (
    <div {...props}>
      <Link to={post.uri}>
        <ParsedContent content={content} />
      </Link>
    </div>
  )
}
