import Logo from '@/components/atoms/Logo'
import Link from '@/components/common/Link'
import TopMenu from '@/components/molecules/Navigation/TopMenu'
import { useEffect, useState } from 'react'
import { MdSearch } from 'react-icons/md'
import * as styles from './Header.module.scss'
// import GlobalStyles from '../../../../src/styles/globalStyles'
// import {createGlobalStyle} from 'styled-components'

const Header = ({ search }) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // NOTE: AO - This is a work in progress. I'm trying to get the header height to be used in the GlobalStyle component below.
  const headerHeight = 153
  // const [headerHeight, setHeaderHeight] = useState(0)
  // useEffect(() => {
  //   const header = document.querySelector('#page-header')
  //   const height = header.offsetHeight
  //   setHeaderHeight(height)
  // }, [])

  // const pageHeaderStickyOffset =() =>{
  //   const heightCalc = () =>  headerHeight / 16

  // }

  // const GlobalStyle = createGlobalStyle`
  //   :root {
  //     --page-header-height: ${pageHeaderStickyOffset}rem;
  //   }
  // `

  return (
    <>
      {/* <GlobalStyle /> */}
      <a className={styles.skip} href="#page-content">
        Skip to Main Content
      </a>
      <header
        id="page-header"
        className={
          scrollPosition > headerHeight
            ? styles.pageHeaderSticky
            : styles.pageHeader
        }
      >
        <div className={styles.headerWrapperSticky}>
          <div className={styles.container}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="click to go home"
            >
              <Logo className={styles.svg} type="dark" />
            </Link>
            <div className={styles.topMenu}>
              <TopMenu location="UTILITY_NAV" />
              <button className={styles.search} type="button">
                Search
                <MdSearch />
              </button>
              {search && <div className={styles.search}>{search}</div>}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
