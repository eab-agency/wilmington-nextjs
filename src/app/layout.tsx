import TopMenu from '@/components/molecules/Navigation/TopMenu/TopMenu';
import AlgoliaSearch from '@/components/molecules/AlgoliaSearch'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import getMenuByLocation from '@/functions/wordpress/menus/getMenuByLocation'

import '@/styles/styles.scss'

export const metadata = {
  title: 'Wilmington College',
  description: 'Wilmington College offers quality hands-on education in disciplines including agriculture, athletic training, occupational therapy and more.',
};


export default async function RootLayout({ children, }: {
  children: React.ReactNode;
}) {
    const mainNavMenuItems = await getMenuByLocation("MAIN_NAV")
    const utilityNavMenuItems = await getMenuByLocation("UTILITY_NAV")
    const footerNavMenuItems = await getMenuByLocation("FOOTER_NAV")
    const resourceNavMenuItems = await getMenuByLocation("UTILITY_NAV")

  return (
    <html lang="en">
    <body>
    {/* @ts-expect-error Async Server Component */}
      <Header menuItems={utilityNavMenuItems} search={<AlgoliaSearch className='' useHistory={true} usePlaceholder={true} />} />
    {/* @ts-expect-error Async Server Component */}
      <MainNavigation menuItems={mainNavMenuItems} enableDropdown={true} />

      <div className={'${styles.mainContainer}'} >
        <main id="page-content">{children}</main>
      </div>
      <Footer menus={{ FOOTER_NAV: footerNavMenuItems, RESOURCE_NAV: resourceNavMenuItems }} />
    </body>
    </html>
  );
}