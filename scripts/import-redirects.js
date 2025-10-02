#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD

if (!wpAppUser || !wpAppPass) {
  console.error('❌ WordPress credentials not found in .env.local')
  console.error(
    'Please set WORDPRESS_APPLICATION_USERNAME and WORDPRESS_APPLICATION_PASSWORD'
  )
  process.exit(1)
}

const auth = Buffer.from(`${wpAppUser}:${wpAppPass}`).toString('base64')
const apiUrl =
  'https://wordpress.wilmington.edu/wp-json/redirection/v1/redirect'

// Load redirects from JSON file
const redirectsPath = path.join(__dirname, '..', 'data', 'redirects.json')
let redirectsData

try {
  redirectsData = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'))
  console.log(
    `📁 Loaded ${redirectsData.length} redirects from data/redirects.json`
  )
} catch (error) {
  console.error('❌ Error loading redirects file:', error.message)
  process.exit(1)
}

// Function to create a redirect in WordPress
async function createRedirect(redirect) {
  const payload = {
    url: redirect.source,
    action_type: 'url',
    action_data: {
      url: redirect.destination
    },
    action_code: redirect.permanent ? 301 : 302,
    match_type: 'url',
    title: `Imported redirect: ${redirect.source}`,
    group_id: 1 // Default group
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Wilmington-NextJS-Import-Script'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, id: result.id }
    } else {
      const errorText = await response.text()
      let errorMsg
      try {
        const errorJson = JSON.parse(errorText)
        errorMsg = errorJson.message || `HTTP ${response.status}`
      } catch (e) {
        errorMsg = `HTTP ${response.status}: ${response.statusText}`
      }
      return { success: false, error: errorMsg }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Function to check if redirect already exists
async function checkExistingRedirect(source) {
  try {
    const searchUrl = `${apiUrl}?search=${encodeURIComponent(
      source
    )}&per_page=5`
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Wilmington-NextJS-Import-Script'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data.items.some((item) => item.url === source)
    }
    return false
  } catch (error) {
    console.warn(
      `⚠️  Could not check existing redirect for ${source}: ${error.message}`
    )
    return false
  }
}

// Main import function
async function importRedirects() {
  console.log('🚀 Starting redirect import...')

  let imported = 0
  let skipped = 0
  let errors = 0

  // Remove duplicates from the source data first
  const uniqueRedirects = []
  const seenSources = new Set()

  for (const redirect of redirectsData) {
    if (!seenSources.has(redirect.source)) {
      seenSources.add(redirect.source)
      uniqueRedirects.push(redirect)
    } else {
      console.log(`🔄 Skipping duplicate source: ${redirect.source}`)
      skipped++
    }
  }

  console.log(
    `📊 Processing ${uniqueRedirects.length} unique redirects (${skipped} duplicates removed)`
  )

  for (let i = 0; i < uniqueRedirects.length; i++) {
    const redirect = uniqueRedirects[i]
    const progress = `[${i + 1}/${uniqueRedirects.length}]`

    console.log(`${progress} Checking: ${redirect.source}`)

    // Check if redirect already exists
    const exists = await checkExistingRedirect(redirect.source)
    if (exists) {
      console.log(`${progress} ⏭️  Already exists: ${redirect.source}`)
      skipped++
      continue
    }

    // Create the redirect
    const result = await createRedirect(redirect)
    if (result.success) {
      console.log(
        `${progress} ✅ Created: ${redirect.source} → ${redirect.destination}`
      )
      imported++
    } else {
      console.error(
        `${progress} ❌ Failed: ${redirect.source} - ${result.error}`
      )
      errors++
    }

    // Add a small delay to avoid overwhelming the API
    if (i < uniqueRedirects.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  console.log('\n📈 Import Summary:')
  console.log(`✅ Imported: ${imported}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`📊 Total processed: ${imported + skipped + errors}`)
}

// Run the import
importRedirects().catch((error) => {
  console.error('💥 Import failed:', error.message)
  process.exit(1)
})
