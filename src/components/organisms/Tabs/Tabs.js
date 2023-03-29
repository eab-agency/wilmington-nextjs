import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as styles from './Tabs.module.scss'
import Image from '@/components/atoms/Image';

const TabComponent = ({ tabs }) => {

  return (
    <Tabs className={styles.tabsContainer}>
      <TabList>
        {tabs.map((tab, index) => {
          return (
            <Tab key={index}>
              <span className={tab.icon}>{tab.title}</span>
            </Tab>
          )
        })}
      </TabList>

      {tabs.map((tab, index) => {
        return (
          <TabPanel className={styles.tabContent} key={index}>
            <div dangerouslySetInnerHTML={{ __html: tab.content }} />
            {tab.image && (
              <Image url={tab.image.mediaItemUrl} alt={tab.image.altText} imageMeta={{ mediaDetails: tab.image.mediaDetails }} />
            )}
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

export default TabComponent
