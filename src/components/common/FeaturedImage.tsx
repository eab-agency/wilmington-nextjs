import React from "react"
// import { getImage, GatsbyImage } from "gatsby-plugin-image"
import Link from "@/components/common/Link"

interface FeaturedImageProps {
  post: any
  showCaption?: boolean
}

export const FeaturedImage = ({ post, showCaption }: FeaturedImageProps) => {
  // grab featuredImage from post.featuredImage, only if it exists
  const featuredImage = post?.featuredImage?.node?.gatsbyImage && post.featuredImage

  // if featuredImage exists, destructure altText and caption from featuredImage
  if (featuredImage) {
    const { altText, caption } = featuredImage
    // const theImage = getImage(featuredImage.node.gatsbyImage)
    const captionText = caption || "<p>the caption for an image.</p>"
    // TODO: remove this after styling caption for FeaturedImage
    // TODO: ensure that all featured images have alt text then remove alert
    return (
      // <Link to={post.uri}>
      <figure className="featured-image">
        {/* <GatsbyImage image={theImage} alt={altText || ""} loading="eager" /> */}
        {/* {!altText && (
          <span style={{ backgroundColor: "red", color: "white", position: "absolute" }}>
            No alt text
          </span>
        )} */}
        {/* if showCaption and captionText is not null then show <figcaption> */}
        {showCaption && captionText && (
          <figcaption dangerouslySetInnerHTML={{ __html: captionText }} />
        )}
      </figure>
      // </Link>
    )
  } else {
    return null
  }
}
