import React from 'react'
// import { ParsedContent } from "~/utils";
import Link from '@/components/common/Link'
import ParsedContent from '@/functions/parsedContent'

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
