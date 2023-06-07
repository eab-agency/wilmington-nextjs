import filterMenusByLocation from '@/functions/wordpress/menus/filterMenusByLocation'
import getMenuByLocation from '@/functions/wordpress/menus/getMenuByLocation'
import menuLocations from '@/lib/wordpress/_config/menuLocations'

/**
 * Get menu data from WPGraphQL.
 *
 * @param  {object} menus     Query response menu data.
 * @param  {Array}  locations The menu locations as an array.
 * @return {Array}            Returns array of menu objects.
 */
export function getMenus(menus, locations = menuLocations) {
  if (!locations || !locations.length || !menus) {
    return [] // Exit if empty.
  }

  // Filter returned menus by specific menu location.
  const filteredMenus = filterMenusByLocation(menus?.nodes, locations)

  return filteredMenus || []
}

export default async function getAllMenus() {
  const menuPromises = menuLocations.map((location) =>
    getMenuByLocation(location)
  )
  const menus = await Promise.all(menuPromises)

  return menuLocations.reduce((menuObj, location, index) => {
    menuObj[location.toLowerCase()] = menus[index]
    return menuObj
  }, {})
}
