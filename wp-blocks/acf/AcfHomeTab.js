import Image from '@/components/atoms/Image/Image'
import Preloader from '@/components/atoms/Preloader'
import BlockHomeTabs from '@/components/blocks/acf/BlockHomeTabs'
import { gql, useQuery } from '@apollo/client'

function getImageData(id) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, error, data } = useQuery(Image.query, {
    variables: { id }
  })

  if (loading) return <Preloader />
  if (error) return <p>Error: {error.message}</p>

  return data
}

const AcfHomeTab = (props) => {
  const attributes = props.attributes

  const tabs = JSON.parse(attributes?.data)

  // create an array of objects with the tab title and content based on the length of props.home_tabs
  const count = tabs.home_tabs

  // get the image data for each tab
  for (let i = 0; i < count; i++) {
    tabs[`home_tabs_${i}_tab_imageData`] = getImageData(
      tabs[`home_tabs_${i}_tab_image`]
    )
  }

  const homeTabsArray = []
  // loop through the number of tabs
  for (let i = 0; i < count; i++) {
    // create an object for each tab
    const tab = {
      image_alignment: tabs[`home_tabs_${i}_tab_alignment`],
      content: tabs[`home_tabs_${i}_tab_content`],
      cta: {
        title: tabs[`home_tabs_${i}_tab_cta`].title,
        url: tabs[`home_tabs_${i}_tab_cta`].url,
        target: tabs[`home_tabs_${i}_tab_cta`].target
      },
      icon: tabs[`home_tabs_${i}_tab_icon`],
      image: tabs[`home_tabs_${i}_tab_imageData`],
      title: tabs[`home_tabs_${i}_tab_title`]
    }
    // push the object to the array
    homeTabsArray.push(tab)
  }
  return <BlockHomeTabs tabs={homeTabsArray} />
}

export default AcfHomeTab

AcfHomeTab.fragments = {
  entry: gql`
    fragment AcfHomeTabFragment on AcfHomeTab {
      attributes {
        data
      }
    }
  `,
  key: `AcfHomeTabFragment`
}

AcfHomeTab.displayName = 'AcfHomeTab'
