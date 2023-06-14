import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const useIsFrontPage = (): boolean => {
  const [isFrontPage, setIsFrontPage] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    setIsFrontPage(router.pathname === '/')
  }, [router.pathname])

  return isFrontPage
}

export default useIsFrontPage
