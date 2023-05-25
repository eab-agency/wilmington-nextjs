import Link from 'next/link'

const NotFound = () => {
  return (
    <div>
      <h1>
        The link you clicked may be broken or the page may have been removed
      </h1>
      <p>
        Visit the <Link href="/">home page</Link> or{' '}
        <Link href="/contact">contact us</Link> if you think this is a mistake.
      </p>
    </div>
  )
}

export default NotFound
