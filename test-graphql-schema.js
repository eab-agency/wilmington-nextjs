#!/usr/bin/env node

// Simple test to check GraphQL schema for alerts
const { gql } = require('@apollo/client')

// Test query to see what's available in the schema
const testQuery = gql`
  query TestAlertsQuery {
    __schema {
      types {
        name
        kind
      }
    }
  }
`

console.log('GraphQL Test Query:', testQuery.loc.source.body)

// Also test a simple query to see if alerts exist
const simpleAlertsQuery = gql`
  query SimpleAlertsTest {
    alerts {
      nodes {
        id
        title
        status
      }
    }
  }
`

console.log('\nSimple Alerts Query:', simpleAlertsQuery.loc.source.body)

console.log(
  '\n🔍 These queries can be tested in GraphQL playground or browser console'
)
