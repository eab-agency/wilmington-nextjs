import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ArchivePrograms() {
  const { push } = useRouter()
  useEffect(() => {
    push('/academics/program-directory')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <p></p>
}
