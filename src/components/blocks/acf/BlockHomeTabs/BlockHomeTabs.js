import React from 'react'
import TabComponent from '@/components/organisms/Tabs'
import * as styles from './BlockHomeTabs.module.scss'

const BlockHomeTabs = (props) => {
  // create an array of objects with the tab title and content based on the length of props.home_tabs
  const count = props.home_tabs

  const homeTabsArray = []
  // loop through the number of tabs
  for (let i = 0; i < count; i++) {
    // create an object for each tab
    const tab = {
      image_alignment: props[`home_tabs_${i}_tab_alignment`],
      content: props[`home_tabs_${i}_tab_content`],
      cta: {
        title: props[`home_tabs_${i}_tab_cta`].title,
        url: props[`home_tabs_${i}_tab_cta`].url,
        target: props[`home_tabs_${i}_tab_cta`].target
      },
      icon: props[`home_tabs_${i}_tab_icon`],
      image: props[`home_tabs_${i}_tab_imageData`],
      title: props[`home_tabs_${i}_tab_title`]
    }
    // push the object to the array
    homeTabsArray.push(tab)
  }

  return (
    <section className={styles.tabsSection}>
      <TabComponent tabs={homeTabsArray} />
    </section>
  )
}

export default BlockHomeTabs
