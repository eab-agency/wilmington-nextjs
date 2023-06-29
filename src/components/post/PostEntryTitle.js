import Link from 'next/link'

export const PostEntryTitle = ({ post, location, ...props }) => {
  const { title, uri } = post

  return (
    <>
      {location === 'single' ? (
        <h1
          dangerouslySetInnerHTML={{ __html: title }}
          {...props}
          className="uppercase"
        />
      ) : (
        <h2 {...props}>
          <Link href={`${uri}`} dangerouslySetInnerHTML={{ __html: title }} />
        </h2>
      )}
    </>
  )
}
