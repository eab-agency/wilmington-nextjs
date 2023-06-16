import TabComponent from '@/components/organisms/Tabs'
import React from 'react'
import styles from './BlockHomeTabs.module.scss'

const BlockHomeTabs = ({ tabs }) => {
  return (
    <section className={styles.tabsSection}>
      <TabComponent tabs={tabs} />
    </section>
  )
}

export default BlockHomeTabs
