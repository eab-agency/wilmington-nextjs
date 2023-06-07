import getMenuByLocation from '@/functions/wordpress/menus/getMenuByLocation'
import formatDefaultSeoData from '@/functions/wordpress/seo/formatDefaultSeoData'
import frontendPageSeo from '@/lib/wordpress/_config/frontendPageSeo'
import { initializeWpApollo } from '@/lib/wordpress/connector'
import queryDefaultPageData from '@/lib/wordpress/pages/queryDefaultPageData'
import formatManualSeoMeta from '../seo/formatManualSeoMeta'

/**
 * Retrieve data for Frontend-only route (i.e., page does not exist in WordPress).
 *
 * @param  {string} route Frontend route.
 * @return {object}       Object containing Apollo client instance and post data or error object.
 */
export default async function getFrontendPage(route) {
  // Get/create Apollo instance.
  const apolloClient = initializeWpApollo()

  // Set up return object.
  const response = {
    apolloClient,
    error: false,
    errorMessage: null
  }

  const mainNavMenuItems = await getMenuByLocation('MAIN_NAV')
  const utilityNavMenuItems = await getMenuByLocation('UTILITY_NAV')
  const footerNavMenuItems = await getMenuByLocation('FOOTER_NAV')
  const resourceNavMenuItems = await getMenuByLocation('RESOURCE_NAV')

  // Execute query.
  response.post = await apolloClient
    .query({ query: queryDefaultPageData })
    .then((res) => {
      const { generalSettings, siteSeo } = res.data

      // Retrieve menus.
      response.menus = {
        mainNav: mainNavMenuItems,
        utilityNav: utilityNavMenuItems,
        footerNav: footerNavMenuItems,
        resourceNav: resourceNavMenuItems
      }

      // Retrieve default SEO data.
      response.defaultSeo = formatDefaultSeoData({ siteSeo })

      // Determine SEO.
      return {
        seo: formatManualSeoMeta(frontendPageSeo?.[route]?.title, route, {
          generalSettings,
          siteSeo
        })
      }
    })
    .catch((error) => {
      response.error = true
      response.errorMessage = error.message

      return null
    })

  return response
}
