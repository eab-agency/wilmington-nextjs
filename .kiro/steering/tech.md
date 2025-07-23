# Technology Stack

## Core Technologies

- **Frontend Framework**: Next.js (React)
- **Headless CMS**: WordPress with Faust.js integration
- **GraphQL**: Apollo Client for data fetching
- **Styling**: SCSS modules with Sass
- **Deployment**: Vercel

## Key Libraries and Dependencies

- **@faustwp/core**: Headless WordPress framework
- **Apollo Client**: GraphQL client for data fetching
- **React 19**: UI library
- **Algolia**: Search functionality
- **New Relic**: Performance monitoring
- **TypeScript**: For type safety (mixed with JavaScript)
- **Formik & Yup**: Form handling and validation
- **React Multi Carousel**: For carousel components

## Code Quality Tools

- **ESLint**: JavaScript/TypeScript linting
  - Configured to prefer arrow functions
  - Console logs are disallowed (except warn/error)
- **Prettier**: Code formatting
  - Uses 2 spaces for indentation
  - Single quotes
  - No semicolons
  - No trailing commas
- **Stylelint**: CSS/SCSS linting
- **Husky**: Git hooks for pre-commit checks

## Build System

- **Package Manager**: Yarn
- **Node.js**: Version 20+ required

## Common Commands

### Development

```bash
# Install dependencies
yarn

# Start development server
yarn dev
# or
vercel dev

# Generate GraphQL types
yarn generate
```

### Code Quality

```bash
# Format code
yarn format

# Lint code (includes formatting)
yarn lint

# Lint JavaScript/TypeScript
yarn lint:js

# Lint CSS/SCSS
yarn lint:css
```

### Build and Deployment

```bash
# Clean build directory
yarn clean

# Build for production
yarn build

# Start production server
yarn start

# Deploy to Vercel
vercel deploy
```

## Environment Setup

- Environment variables are managed through Vercel
- Pull environment variables with `vercel pull`
- Local environment variables should be in `.env.local`
