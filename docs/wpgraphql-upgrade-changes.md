# WPGraphQL Upgrade Changes

This document outlines the changes made to accommodate the latest WPGraphQL plugin upgrade.

## Breaking Changes Addressed

### 1. Error Response Structure Changes

- **"category" field removal**: The "category" field has been removed from GraphQL error responses.
  - Solution: Updated error handling to no longer rely on this field.

- **Debug entries moved**: Debug information is now placed under the `extensions` key of the error response.
  - Solution: Updated error handling to extract debug information from the new location.

- **Serialization errors**: Errors during leaf value serialization now throw `SerializationError`.
  - Solution: Added specific handling for serialization errors.

### 2. HTTP Status Code Change

- For GraphQL requests made over HTTP using the POST method without the `Content-Type: application/json` header, the response now has HTTP Status of 415 instead of 500.
  - Solution: Ensured all GraphQL requests include the proper Content-Type header.

### 3. GraphQL Endpoint Configuration

- Updated the GraphQL endpoint path to use `/index.php?graphql` instead of just `/graphql`.
  - Changed in `.env.local` and `faust.config.js`.

## Files Modified

1. `.env.local` - Updated `NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT` to use `index.php?graphql`
2. `src/lib/wordpress/connector.js` - Added custom error handling for the new error structure
3. `src/lib/wordpress/fetchAuthenticatedGraphQLData.js` - Updated endpoint construction and error handling
4. `faust.config.js` - Updated GraphQL endpoint path

## New Files Created

1. `src/lib/wordpress/handleGraphQLErrors.js` - Utility functions for consistent error handling across the application

## Testing

After making these changes, test the application by:

1. Running the development server: `yarn dev`
2. Verifying that GraphQL queries are working correctly
3. Testing error scenarios to ensure proper error handling

## Troubleshooting

If you encounter issues:

- Check the WordPress site's GraphQL endpoint by visiting `https://dev-wilmington-college.pantheonsite.io/index.php?graphql` directly
- Verify that the WPGraphQL plugin is active on the WordPress site
- Check browser console for detailed error messages
- Ensure environment variables are correctly set
