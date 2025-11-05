#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Index Archive Pages to Algolia
 *
 * This script indexes Next.js archive template pages to Algolia so they appear in search results.
 * Archive pages are not WordPress entities, so they need to be manually indexed.
 *
 * Usage:
 *   node scripts/index-archive-pages.js
 *
 * Required environment variables:
 *   ALGOLIA_ADMIN_API_KEY - Algolia Admin API key (with write permissions)
 *   NEXT_PUBLIC_ALGOLIA_APPLICATION_ID - Algolia Application ID
 *   NEXT_PUBLIC_ALGOLIA_INDEX_NAME - Target Algolia index name
 *
 * The script will:
 * 1. Connect to Algolia with admin credentials
 * 2. Push archive page metadata to the index
 * 3. Match the data structure of WordPress posts
 */

const algoliasearch = require('algoliasearch')
require('dotenv').config({ path: '.env.local' })

// Configuration
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME

// Base URL - adjust based on environment
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://www.wilmington.edu'

// Archive pages to index
// These match the data structure of WordPress posts in Algolia
//
// IMPORTANT: Archive pages have priority: 1000 to rank above regular posts (priority: 1)
// This ensures archive pages appear first in search results for their keywords
const ARCHIVE_PAGES = [
  {
    objectID: 'archive-faculty',
    post_title: 'Wilmington Faculty and Staff',
    post_type: 'page',
    post_type_label: 'Page',
    permalink: `${BASE_URL}/faculty/`,
    content:
      "Discover Wilmington College's dedicated faculty and staff across academic, administrative, and athletic departments. Find contact information and professional details for our diverse team of educators and professionals. Search by name or department to connect with faculty members.",
    // Ranking boost - higher number = higher priority in search results
    priority: 1000,
    // Mark as archive page for filtering/boosting
    is_archive_page: true,
    // Additional searchable terms
    _tags: [
      'faculty',
      'staff',
      'directory',
      'professors',
      'teachers',
      'instructors',
      'administration'
    ]
  },

  {
    objectID: 'archive-events',
    post_title: 'Wilmington Events',
    post_type: 'page',
    post_type_label: 'Page',
    permalink: `${BASE_URL}/events/`,
    content:
      'Explore upcoming events at Wilmington College including academic lectures, athletic competitions, campus activities, admissions events, and community gatherings. Find dates, times, and locations for all campus events.',
    priority: 1000,
    is_archive_page: true,
    _tags: ['events', 'calendar', 'activities', 'schedule', 'happenings']
  },
  {
    objectID: 'archive-news-and-events',
    post_title: 'Wilmington News & Events',
    post_type: 'page',
    post_type_label: 'Page',
    permalink: `${BASE_URL}/news/`,
    content:
      'Browse the latest news and events from Wilmington College. Stay informed about campus happenings, student stories, upcoming events, and college announcements.',
    priority: 1000,
    is_archive_page: true,
    _tags: ['news', 'events', 'announcements', 'calendar', 'updates']
  },
  {
    objectID: 'archive-organization',
    post_title: 'Wilmington Student Organizations',
    post_type: 'page',
    post_type_label: 'Page',
    permalink: `${BASE_URL}/student-organizations/`,
    content:
      'Explore student organizations and clubs at Wilmington College. Get involved in campus life through academic clubs, social organizations, service groups, honor societies, and special interest organizations.',
    priority: 1000,
    is_archive_page: true,
    _tags: [
      'organizations',
      'clubs',
      'student life',
      'activities',
      'involvement',
      'groups'
    ]
  },
  {
    objectID: 'archive-program',
    post_title: 'Wilmington Program Directory',
    post_type: 'page',
    post_type_label: 'Academics',
    permalink: `${BASE_URL}/academics/program-directory/`,
    content:
      'Browse academic programs at Wilmington College including majors, minors, and certificates. Explore undergraduate and graduate programs across all disciplines and find the right program for your educational goals.',
    priority: 1000,
    is_archive_page: true,
    _tags: [
      'programs',
      'majors',
      'minors',
      'academics',
      'degrees',
      'directory',
      'courses'
    ]
  }
]

async function indexArchivePages() {
  // Validate environment variables
  if (!ALGOLIA_APP_ID) {
    console.error('❌ Error: NEXT_PUBLIC_ALGOLIA_APPLICATION_ID is not set')
    process.exit(1)
  }

  if (!ALGOLIA_ADMIN_KEY) {
    console.error('❌ Error: ALGOLIA_ADMIN_API_KEY is not set')
    console.error(
      '   You need an Algolia Admin API key with write permissions.'
    )
    console.error(
      '   Get it from: https://dashboard.algolia.com/account/api-keys'
    )
    process.exit(1)
  }

  if (!ALGOLIA_INDEX_NAME) {
    console.error('❌ Error: NEXT_PUBLIC_ALGOLIA_INDEX_NAME is not set')
    process.exit(1)
  }

  console.log('📋 Algolia Archive Pages Indexer')
  console.log('================================')
  console.log(`App ID: ${ALGOLIA_APP_ID}`)
  console.log(`Index: ${ALGOLIA_INDEX_NAME}`)
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Pages to index: ${ARCHIVE_PAGES.length}`)
  console.log('')

  try {
    // Initialize Algolia client
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
    const index = client.initIndex(ALGOLIA_INDEX_NAME)

    console.log('🔗 Connected to Algolia')
    console.log('')

    // Index all archive pages
    console.log('📤 Indexing archive pages...')
    const { objectIDs } = await index.saveObjects(ARCHIVE_PAGES)

    console.log('✅ Successfully indexed archive pages!')
    console.log('')
    console.log('Indexed pages:')
    ARCHIVE_PAGES.forEach((page) => {
      console.log(`  ✓ ${page.post_title} → ${page.permalink}`)
    })

    console.log('')
    console.log(
      `🎉 Done! ${objectIDs.length} pages indexed to ${ALGOLIA_INDEX_NAME}`
    )
  } catch (error) {
    console.error('❌ Error indexing pages:', error.message)
    if (error.status === 403) {
      console.error(
        '   → Check that your ALGOLIA_ADMIN_API_KEY has write permissions'
      )
    }
    process.exit(1)
  }
}

// Run the script
indexArchivePages()
