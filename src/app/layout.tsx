/* eslint-disable @next/next/no-page-custom-font */
import styles from '@/components/common/Layout.module.scss'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import getMenuByLocation from '@/functions/wordpress/menus/getMenuByLocation'
import React from 'react'

import { Cantarell } from 'next/font/google'

const cantarell = Cantarell({
  weight: ['400', '700'],
  subsets: ['latin']
})

import '@/styles/styles.scss'

export const metadata = {
  title: 'Wilmington College',
  description:
    'Wilmington College offers quality hands-on education in disciplines including agriculture, athletic training, occupational therapy and more.'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const mainNavMenuItems = await getMenuByLocation('MAIN_NAV')
  const utilityNavMenuItems = await getMenuByLocation('UTILITY_NAV')
  const footerNavMenuItems = await getMenuByLocation('FOOTER_NAV')
  const resourceNavMenuItems = await getMenuByLocation('RESOURCE_NAV')

  return (
    <html lang="en">
      <link
        href="https://fonts.googleapis.com/css2?&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
      <body>
        <div className={`${cantarell.className}`}>
          <Header menu={utilityNavMenuItems} />
          <div className={`${styles.mainContainer} std-page`}>
            <MainNavigation
              menuItems={mainNavMenuItems}
              enableDropdown={true}
            />
            <main id="page-content">{children}</main>
          </div>
          <Footer
            menus={{
              FOOTER_NAV: footerNavMenuItems,
              RESOURCE_NAV: resourceNavMenuItems
            }}
          />
        </div>
      </body>
    </html>
  )
}
