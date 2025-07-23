#!/usr/bin/env node

// Simple test to verify alerts integration
const fs = require('fs')
const path = require('path')

console.log('🔍 Testing Alerts Integration...\n')

// Check if AlertBar component uses CustomSettingsProvider
const alertBarPath = 'src/components/organisms/AlertBar/AlertBar.tsx'
const alertBarContent = fs.readFileSync(alertBarPath, 'utf8')

if (alertBarContent.includes('useCustomData')) {
  console.log('✅ AlertBar component uses CustomSettingsProvider')
} else {
  console.log('❌ AlertBar component does not use CustomSettingsProvider')
}

// Check if HomepageModal component uses CustomSettingsProvider
const homepageModalPath = 'src/components/HomepageModal.tsx'
const homepageModalContent = fs.readFileSync(homepageModalPath, 'utf8')

if (homepageModalContent.includes('useCustomData')) {
  console.log('✅ HomepageModal component uses CustomSettingsProvider')
} else {
  console.log('❌ HomepageModal component does not use CustomSettingsProvider')
}

// Check if Layout component includes both AlertBar and HomepageModal
const layoutPath = 'src/components/common/Layout.js'
const layoutContent = fs.readFileSync(layoutPath, 'utf8')

if (
  layoutContent.includes('AlertBar') &&
  layoutContent.includes('HomepageModal')
) {
  console.log('✅ Layout component includes both AlertBar and HomepageModal')
} else {
  console.log('❌ Layout component missing AlertBar or HomepageModal')
}

// Check if _app.jsx does NOT include AlertsProvider (since we're using CustomSettingsProvider)
const appPath = 'src/pages/_app.jsx'
const appContent = fs.readFileSync(appPath, 'utf8')

if (!appContent.includes('AlertsProvider')) {
  console.log(
    '✅ _app.jsx correctly uses CustomSettingsProvider (no duplicate AlertsProvider)'
  )
} else {
  console.log('❌ _app.jsx still includes AlertsProvider (should be removed)')
}

// Check if CustomSettingsProvider has the alerts query
const customSettingsPath =
  'src/functions/contextProviders/CustomSettingsProvider.tsx'
const customSettingsContent = fs.readFileSync(customSettingsPath, 'utf8')

if (
  customSettingsContent.includes('alerts {') &&
  customSettingsContent.includes('alertType')
) {
  console.log(
    '✅ CustomSettingsProvider includes alerts query with alertType field'
  )
} else {
  console.log(
    '❌ CustomSettingsProvider missing alerts query or alertType field'
  )
}

console.log('\n🎯 Integration Test Complete!')
