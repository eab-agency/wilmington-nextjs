'use client'

import Image from '@/components/atoms/Image'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import styles from './Tabs.module.scss'

const TabComponent = ({ tabs }) => {
  if (!tabs) return null

  return (
    <>
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
          const image = tab.image.mediaItem
          return (
            <TabPanel className={styles.tabContent} key={index}>
              <div className={styles.tabMainContent}>
                <div
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: tab.content }}
                />
                {tab.cta.url && (
                  <div className={styles.ctaContainer}>
                    <a className="button" href={tab.cta.url}>
                      {tab.cta.title}
                    </a>
                  </div>
                )}{' '}
              </div>

              {image && (
                <Image
                  url={image.mediaItemUrl}
                  alt={image.altText}
                  imageMeta={{
                    mediaDetails: image.mediaDetails
                  }}
                />
              )}
            </TabPanel>
          )
        })}
      </Tabs>
    </>
  )
}

export default TabComponent
