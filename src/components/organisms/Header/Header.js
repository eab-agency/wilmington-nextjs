'use client'

import Logo from '@/components/atoms/Logo'
import Link from '@/components/common/Link'
import AlgoliaSearch from '@/components/molecules/AlgoliaSearch/AlgoliaSearch'
import TopMenu from '@/components/molecules/Navigation/TopMenu'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import styles from './Header.module.scss'

const Header = ({ menu }) => {
  const [scrollDirection, setScrollDirection] = useState(null)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset

      setScrollDirection(currentScrollPos > prevScrollPos ? 'down' : 'up')

      setPrevScrollPos(currentScrollPos)
      setScrollPosition(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const header = document.querySelector('#page-header')
    const height = header.offsetHeight
    setHeaderHeight(height)
  }, [])

  const headerClass = classNames({
    [styles.scrollUp]: scrollDirection === 'up'
  })

  const pageHeaderClass = classNames({
    [styles.pageHeaderSticky]: scrollPosition > headerHeight,
    [styles.pageHeader]: scrollPosition <= headerHeight,
    [headerClass]: headerClass
  })

  return (
    <>
      <a className={styles.skip} href="#page-content">
        Skip to Main Content
      </a>
      <header id="page-header" className={pageHeaderClass}>
        <div className={styles.headerWrapperSticky}>
          <div className={styles.container}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="click to go home"
            >
              <Logo type="dark" />
            </Link>
            <div className={styles.topMenu}>
              <TopMenu menuItems={menu} />
              <div className={styles.search}>
                <AlgoliaSearch
                  className=""
                  useHistory={true}
                  usePlaceholder={true}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
