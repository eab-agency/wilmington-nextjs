# Incident Report: WPGraphQL Plugin Update Breaking Changes

**Date:** July 24, 2025
**Reporter:** Elias Rufe via partner
**Severity:** High
**Status:** Resolved

## Summary

A WordPress WPGraphQL plugin update introduced breaking changes to the GraphQL schema structure, causing multiple pages on the Wilmington University website to fail with 404 errors and data rendering issues.

## Impact

### Affected Pages/Components

- **Program single pages** - Returning 404 errors
- **Faculty card components** - CV links not displaying
- **Student organization listings** - Data not rendering properly
- **Program organization relationships** - Broken data fetching

### Affected Files

- `wp-templates/single-program.js`
- `wp-blocks/acf/AcfFacultyCard.js`
- `wp-blocks/acf/AcfStudentOrgs.js`
- `src/lib/wordpress/programs/queryProgramById.js`
- `src/lib/wordpress/_query-partials/facultyAcfFields.js`

## Root Cause

The WPGraphQL plugin update changed the schema structure for several GraphQL relationships:

1. **Node wrapping**: Media items (like CV files) now require accessing data through a `node` wrapper instead of directly
2. **Relationship field changes**: Program organization relationships changed from `programorg` to `programOrg` and now require accessing data through a `nodes` array
3. **Schema restructuring**: Several ACF field relationships now use nested node structures

## Timeline

### Detection and Initial Response

- **10:43 AM** - Program single pages and faculty single pages began returning 404 errors
- **10:58 AM** - Temporary fix: Commented out problematic `StudentOrgFragment` in GraphQL query to restore basic page functionality

### Investigation and Fixes

- **11:56 AM** - Fixed faculty CV field access by adding `node` wrapper structure
- **12:11 PM** - Comprehensive fix for program organization relationships:
  - Updated `programorg` to `programOrg`
  - Added `nodes` array wrapper for organization data
  - Re-enabled `StudentOrgFragment` with corrected structure
  - Fixed data access patterns in single program template

## Resolution

### Changes Made

#### 1. Faculty CV Fields Fix (`d84570c`)

```diff
cv {
-  mediaItemUrl
+  node {
+    mediaItemUrl
+  }
}
```

#### 2. Program Organization Relationships Fix (`4d16a37`)

```diff
programOrgRelationship {
-  programorg {
-    ... on StudentOrg {
-      id
-      title
-      link
-      orgFields {
-        quickFacts
+  programOrg {
+    nodes {
+      ... on StudentOrg {
+        id
+        title
+        link
+        orgFields {
+          quickFacts
+        }
       }
     }
   }
 }
```

#### 3. Data Access Pattern Updates

- Updated `programOrgRelationship?.programorg` to `programOrgRelationship?.programOrg.nodes`
- Re-enabled `StudentOrgFragment` with corrected schema structure

## Prevention Measures

### Immediate Actions

1. ✅ All affected GraphQL queries updated to match new schema
2. ✅ Data access patterns corrected throughout codebase
3. ✅ Functionality restored across all affected components

### Future Prevention

1. **Schema Monitoring**: Implement GraphQL schema change detection before WordPress plugin updates
2. **Staging Testing**: Ensure thorough testing of plugin updates in staging environment before production deployment
3. **Graceful Degradation**: Add error boundaries and fallback handling for GraphQL query failures
4. **Documentation**: Maintain documentation of GraphQL schema dependencies for faster incident response

## Lessons Learned

1. **Plugin Updates**: WordPress plugin updates can introduce breaking changes to GraphQL schemas without major version changes
2. **Dependency Management**: Frontend applications need robust error handling for external schema changes
3. **Testing Coverage**: Need better integration tests that would catch these schema mismatches
4. **Rollback Strategy**: Consider implementing GraphQL query versioning or fallback mechanisms

## Post-Incident Actions

- [ ] Add GraphQL schema validation to CI/CD pipeline
- [ ] Create documentation for common WPGraphQL schema patterns
- [ ] Implement monitoring for GraphQL query failures
- [ ] Review other potential breaking changes from recent plugin updates

---

**Incident resolved at:** 12:11 PM EST, July 24, 2025
**Total downtime:** ~30 minutes
**Next review:** September 1, 2025
