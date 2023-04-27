import Image from '@/components/atoms/Image'
import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import styles from './Tabs.module.scss'

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
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: tab.content }}
            />
            {tab.image && (
              <Image
                url={tab.image.mediaItemUrl}
                alt={tab.image.altText}
                imageMeta={{ mediaDetails: tab.image.mediaDetails }}
              />
            )}
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

export default TabComponent
