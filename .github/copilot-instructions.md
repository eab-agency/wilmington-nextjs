# Wilmington College Next.js Website - AI Agent Instructions

## Architecture Overview

This is a **Faust.js headless WordPress** site that renders WordPress content via GraphQL. The architecture follows a clear separation:

- **WordPress Backend**: `https://dev-wilmington-college.pantheonsite.io/` (dev), `https://wordpress.wilmington.edu/` (prod)
- **Next.js Frontend**: `http://localhost:3000/` (local dev)
- **Content Delivery**: WordPress blocks → React components via `@faustwp/blocks`

## Key Development Commands

```bash
# Setup (first time)
vercel pull                    # Pull environment variables
pnpm install                   # Install dependencies

# Development
pnpm dev                       # Start with NewRelic monitoring
# OR vercel dev                # Alternative if faust dev issues
# OR sometimes yarn dev         # Legacy fallback

# Build & Deploy
pnpm generate                  # Regenerate GraphQL types from WordPress
pnpm build                     # Production build
pnpm start                     # Production server

# Environment Management
./scripts/switch-env.sh dev    # Switch to dev environment
./scripts/switch-env.sh prod   # Switch to production
```

## WordPress Integration Patterns

### Template System (`wp-templates/`)

Maps WordPress template hierarchy to React components:

- `front-page.js` → Homepage
- `page.js` → Generic pages
- `single-{post-type}.js` → Custom post type singles
- `archive-{post-type}.js` → Custom post type archives
- Templates are registered in `wp-templates/index.js`

### Block System (`wp-blocks/`)

WordPress Gutenberg blocks → React components:

- **Core blocks**: `CoreParagraph`, `CoreImage`, etc.
- **ACF blocks**: `AcfHomeHero`, `AcfNewsListing`, etc.
- **Custom blocks**: `EabBlocksFormstackEmbed`, `EabProgramDirectory`
- All blocks registered in `wp-blocks/index.js`

### GraphQL Configuration

- **Endpoint**: `/index.php?graphql` (updated from legacy `/graphql`)
- **Schema**: Auto-generated types in `possibleTypes.json`
- **Fragments**: Reusable queries in `src/fragments/`
- **Custom pagination**: `RelayStylePaginationPlugin` for cursor-based pagination

## File Organization Conventions

### Component Architecture (Atomic Design)

```
src/components/
├── atoms/          # Basic UI elements
├── molecules/      # Component combinations
├── organisms/      # Complex UI sections
├── blocks/         # WordPress block components
└── {feature}/      # Feature-specific components
```

### Data Layer Structure

```
src/lib/
├── wordpress/      # WordPress GraphQL queries by post type
├── next-api/       # Next.js API route utilities
├── algolia/        # Search functionality
└── apolloConfig.js # Apollo Client configuration

src/functions/
├── wordpress/      # WordPress data processing
├── next-api/       # API route helpers
└── {utility}.js    # Generic utilities
```

## Development Patterns

### Environment Management

- **Local**: Uses `.env.local` with Vercel integration
- **WordPress URLs**: Managed via `scripts/switch-env.sh`
- **Redirects**: Imported from WordPress via `scripts/import-redirects.js`

### Error Handling

Custom GraphQL error handling in `src/lib/wordpress/handleGraphQLErrors.js` addresses WPGraphQL v2 breaking changes.

### Build Process

- **Images**: Remote patterns configured in `src/config/imageConfig`
- **Redirects**: Fetched from WordPress at build time
- **Sitemap**: Proxied from WordPress via `/api/sitemap-proxy`

## WordPress Content Integration

### Custom Post Types

- `program` → Academic programs with custom fields
- `faculty` → Faculty profiles with department taxonomy
- `event` → Events with date/location data
- `news` → News articles
- `organization` → Student organizations

### Key WordPress Endpoints

- **Development**: `https://dev-wilmington-college.pantheonsite.io/`
- **Production**: `https://wordpress.wilmington.edu/`
- **GraphQL**: `{base-url}/index.php?graphql`

## Critical Development Notes

- **Package Manager**: Uses pnpm (enforced via `preinstall` script)
- **Node Version**: Requires Node.js 20+ for fetch/AbortController support
- **Monitoring**: NewRelic integration in production
- **Image Handling**: WordPress uploads proxied via `/wp-content/uploads/:slug*` redirect
