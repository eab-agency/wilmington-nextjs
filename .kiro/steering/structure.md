# Project Structure

## Key Directories

### `/src`

Core application code:

- `/src/components`: React components organized by atomic design principles

  - `/atoms`: Basic building blocks (buttons, icons, inputs)
  - `/molecules`: Combinations of atoms (cards, forms, navigation)
  - `/organisms`: Complex UI sections (header, footer, hero)
  - `/blocks`: WordPress block components
  - `/common`: Shared components (Layout, Link)
  - `/post`: Post-related components
  - `/program`: Program-related components
  - `/archive`: Archive page components

- `/src/pages`: Next.js pages and API routes

  - `/api`: Backend API endpoints
  - `[...wordpressNode].js`: Dynamic routing for WordPress content

- `/src/lib`: Core libraries and connectors

  - `/wordpress`: WordPress API integration
  - `/algolia`: Algolia search integration
  - `/next-api`: Next.js API utilities

- `/src/functions`: Utility functions and helpers

  - `/wordpress`: WordPress-specific utilities
  - `/contextProviders`: React context providers

- `/src/styles`: SCSS styles

  - `/tokens`: Design tokens (colors, spacing, typography)
  - `/base`: Base styles and resets
  - `/components`: Component-specific styles
  - `/utilities`: Mixins and utility classes

- `/src/constants`: Application constants
- `/src/fragments`: GraphQL fragments
- `/src/config`: Configuration files

### `/wp-templates`

WordPress template components that map to WordPress templates (archive, single, etc.)

### `/wp-blocks`

WordPress block components:

- `/acf`: Advanced Custom Fields block components
- `/custom`: Custom block components
- Core block components (CoreHeading, CoreParagraph, etc.)

### `/public`

Static assets served directly by Next.js:

- `/favicon`: Favicon files
- `/images`: Static images

### `/plugins`

Custom plugins for the application:

- `RelayStylePaginationPlugin.js`: Pagination plugin for Apollo
- `CustomToolbar.tsx`: Custom toolbar component

## Architecture Patterns

1. **Headless WordPress**: Content is managed in WordPress and consumed via GraphQL
2. **Component-Based Design**: UI is built with reusable React components
3. **Atomic Design**: Components are organized by complexity (atoms, molecules, organisms)
4. **CSS Modules**: Scoped styling with SCSS modules
5. **Dynamic Routing**: WordPress content is served through dynamic Next.js routes

## File Naming Conventions

- React components use PascalCase (e.g., `Button.js`, `Header.js`)
- Component folders include an index.js file for easier imports
- CSS modules use the same name as their component with .module.scss extension
- Utility functions use camelCase
- WordPress templates follow WordPress naming conventions (e.g., `single.js`, `archive.js`)

## Import Conventions

- Relative imports for files within the same directory or subdirectories
- Absolute imports from src directory for shared components and utilities
