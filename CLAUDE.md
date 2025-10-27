# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **Faust.js headless WordPress** site built with Next.js that renders WordPress content via GraphQL. The architecture follows a clear separation between WordPress backend and Next.js frontend.

### Key Technical Stack

- **Framework**: Next.js 15+ with React 19
- **Headless CMS**: WordPress via Faust.js (`@faustwp/core`, `@faustwp/blocks`)
- **Data Layer**: Apollo Client with GraphQL
- **Package Manager**: pnpm (enforced via preinstall script)
- **Node Version**: 20+ required (fetch/AbortController support)
- **Monitoring**: NewRelic integration

### WordPress Endpoints

- **Development**: `https://dev-wilmington-college.pantheonsite.io/`
- **Production**: `https://wordpress.wilmington.edu/`
- **GraphQL**: `/index.php?graphql` (note: updated from legacy `/graphql`)

## Essential Commands

### Setup

```bash
vercel pull              # Pull environment variables from Vercel
pnpm install             # Install dependencies
```

### Development

```bash
pnpm dev                 # Start dev server with NewRelic monitoring
vercel dev               # Alternative if faust dev has issues
```

### Building & Generating Types

```bash
pnpm generate            # Regenerate GraphQL types from WordPress
pnpm build               # Production build
pnpm start               # Production server
```

### Code Quality

```bash
pnpm lint                # Format, lint JS/TS, and lint CSS
pnpm lint:js             # ESLint only
pnpm lint:css            # Stylelint only
pnpm format              # Prettier formatting
```

### Utilities

```bash
./scripts/switch-env.sh dev    # Switch to dev environment
./scripts/switch-env.sh prod   # Switch to production
pnpm import-redirects          # Import redirects from WordPress
pnpm index-archive-pages       # Index archive templates to Algolia search
```

## Architecture Patterns

### WordPress Template System (`wp-templates/`)

Maps WordPress template hierarchy to React components following WordPress conventions:

- `front-page.js` → Homepage
- `page.js` → Generic pages
- `single-{post-type}.js` → Custom post type single views
- `archive-{post-type}.js` → Custom post type archives
- `taxonomy-{taxonomy}.js` → Taxonomy archives
- All templates registered in `wp-templates/index.js`

### WordPress Block System (`wp-blocks/`)

Gutenberg blocks rendered as React components:

- **Core blocks**: `CoreParagraph`, `CoreImage`, `CoreHeading`, etc.
- **ACF blocks**: `AcfHomeHero`, `AcfNewsListing`, `AcfFeaturedPrograms`, etc.
- **Custom blocks**: `EabBlocksFormstackEmbed`, `EabProgramDirectory`, etc.
- All blocks registered in `wp-blocks/index.js`

### Component Organization (Atomic Design)

```
src/components/
├── atoms/          # Basic UI elements (buttons, inputs, etc.)
├── molecules/      # Simple component combinations
├── organisms/      # Complex UI sections
├── blocks/         # WordPress block-specific components
└── {feature}/      # Feature-specific component groups
```

### Data Layer Architecture

```
src/lib/wordpress/
├── _query-partials/    # Reusable GraphQL fragments
├── {post-type}/        # Post type-specific queries
├── connector.js        # GraphQL query executor
├── fetchRedirects.js   # WordPress redirects import
└── handleGraphQLErrors.js  # Custom error handling for WPGraphQL v2

src/lib/algolia/        # Search functionality
src/lib/next-api/       # Next.js API route utilities

src/fragments/          # Shared GraphQL fragments
src/functions/          # Business logic and utilities
```

### Custom Post Types

The site uses these custom WordPress post types:

- `program` → Academic programs with custom fields and taxonomies
- `faculty` → Faculty profiles with department taxonomy
- `event` → Events with date/location data
- `news` → News articles
- `organization` → Student organizations
- `testimonial` → Student/alumni testimonials

## Critical Configuration

### GraphQL & Apollo

- **GraphQL endpoint**: Configured in `faust.config.js` as `/graphql`
- **Type generation**: Run `pnpm generate` after WordPress schema changes
- **Pagination**: Uses custom `RelayStylePaginationPlugin` for cursor-based pagination
- **Error handling**: Custom `handleGraphQLErrors.js` addresses WPGraphQL v2 breaking changes
- **Type policies**: Configured in `plugins/RelayStylePaginationPlugin.js` for posts, faculty, contentNodes

### Next.js Configuration (`next.config.js`)

- **Image optimization**: Remote patterns configured in `src/config/imageConfig`
- **Redirects**: Dynamically fetched from WordPress via `fetchRedirects()`
- **Sitemap**: Proxied from WordPress via `/api/sitemap-proxy`
- **WordPress uploads**: Redirected to production (`/wp-content/uploads/:slug*`)
- **SEO**: Non-production/Vercel domains blocked via `X-Robots-Tag: noindex, nofollow`
- **Environment**: `NEXT_PUBLIC_URL` auto-configured based on `VERCEL_ENV`

### Environment Variables

Variables are managed through Vercel and pulled with `vercel pull`. The `NEXT_PUBLIC_` environment variables are automatically cleaned of whitespace/newlines to prevent cookie errors.

### Build Process

1. Sass includes auto-configured from `src/styles/**/`
2. Redirects fetched from WordPress at build time
3. Next Sitemap generated via `postbuild` script
4. NewRelic externals loaded via webpack configuration

## Development Workflow

### Working with WordPress Content

1. Content is edited in WordPress backend
2. GraphQL schema changes require `pnpm generate` to update types
3. New blocks must be registered in `wp-blocks/index.js`
4. New templates must be registered in `wp-templates/index.js`

### Adding New Blocks

1. Create component in `wp-blocks/` (or `wp-blocks/acf/` or `wp-blocks/custom/`)
2. Register in `wp-blocks/index.js` with exact WordPress block name
3. Ensure GraphQL fragment exists if needed

### Adding New Templates

1. Create template file in `wp-templates/` following naming convention
2. Register in `wp-templates/index.js` with key matching WordPress template hierarchy
3. Query data using `getNextStaticProps` from `@faustwp/core`

### Working with GraphQL

- Query partials stored in `src/lib/wordpress/_query-partials/`
- Post type queries in `src/lib/wordpress/{post-type}/`
- Use `connector.js` for authenticated GraphQL requests
- Fragments in `src/fragments/` for reusable field sets

## Important Notes

- **Package manager**: Must use pnpm (enforced by preinstall script)
- **ESLint**: Ignored during builds (`ignoreDuringBuilds: true`)
- **Git hooks**: Husky configured with pre-push hook
- **Asset caching**: `/assets/` has 1-year immutable cache headers
- **Legacy code**: Some fallback references to `yarn dev` exist for compatibility
- **Monitoring**: Production runs with NewRelic (`NODE_OPTIONS='-r newrelic'`)
- **Environment switching**: Use `./scripts/switch-env.sh` to toggle between dev/prod WordPress endpoints

## API Routes Structure

```
src/pages/api/
├── faust/              # Faust.js authentication endpoints
├── sitemap-proxy       # WordPress sitemap proxy
└── formstack/          # Formstack form integration
```

Formstack API proxied to `https://www.formstack.com/api/v2/form/:slug*` for form submissions.

## Algolia Search

### Overview

The site uses Algolia for search functionality. Content is indexed from WordPress, but archive template pages require manual indexing since they're Next.js components, not WordPress entities.

### Indexing Archive Pages

Archive pages (like `/faculty`, `/news`, `/events`) are React templates that don't exist in WordPress, so they need to be manually pushed to Algolia:

```bash
pnpm index-archive-pages
```

This requires an **ALGOLIA_ADMIN_API_KEY** environment variable in `.env.local`. Get the Admin API key from the [Algolia Dashboard](https://dashboard.algolia.com/account/api-keys).

See `scripts/README-archive-indexing.md` for detailed setup instructions.

### Environment-Specific Indexes

- **Local/Dev**: `wil_dev_searchable_posts`
- **QA**: `wilqa_searchable_posts`
- **Production**: `wil_searchable_posts`

### When to Reindex Archive Pages

Run `pnpm index-archive-pages` when:

- A new archive template is created
- Archive page URLs or content change
- Deploying to a new environment

### Related Files

- **Indexing Script**: `scripts/index-archive-pages.js`
- **Documentation**: `scripts/README-archive-indexing.md`
- **Algolia Connector**: `src/lib/algolia/connector.js`
- **Search Components**: `src/components/molecules/AlgoliaSearch/`
- **Search Results Page**: `src/pages/search.js`
