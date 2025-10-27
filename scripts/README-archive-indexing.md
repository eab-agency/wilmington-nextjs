# Indexing Archive Pages to Algolia

## Overview

Archive template pages (like `/faculty`, `/news`, `/events`, etc.) are Next.js components that don't exist as WordPress posts. Therefore, they won't appear in Algolia search results unless manually indexed.

This script solves that problem by pushing these pages to Algolia with the same data structure as WordPress posts.

**⚠️ IMPORTANT**: After indexing, you must configure Algolia's **Custom Ranking** to prioritize archive pages. See [ALGOLIA-RANKING-SETUP.md](./ALGOLIA-RANKING-SETUP.md) for detailed instructions.

## Prerequisites

You need an **Algolia Admin API Key** with write permissions:

1. Go to [Algolia Dashboard → API Keys](https://dashboard.algolia.com/account/api-keys)
2. Find your **Admin API Key** (or create a new API key with these permissions):
   - `addObject` - Add records
   - `deleteObject` - Delete records
   - `editSettings` - Edit settings
3. Copy the Admin API Key

⚠️ **Important**: Never commit the Admin API key to Git! It should only be in `.env.local` (which is gitignored).

## Setup

Add the Admin API key to your `.env.local` file:

```bash
# Add this line to .env.local
ALGOLIA_ADMIN_API_KEY="your_admin_api_key_here"
```

Your `.env.local` should now have these Algolia variables:

```bash
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID="3ZD4ZBUBDM"
NEXT_PUBLIC_ALGOLIA_INDEX_NAME="wil_searchable_posts"
NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY="a701e464b2443a52bb0303188b0f5925"
ALGOLIA_ADMIN_API_KEY="your_admin_api_key_here"  # 👈 Add this
```

## Usage

Run the indexing script:

```bash
pnpm index-archive-pages
```

Or directly:

```bash
node scripts/index-archive-pages.js
```

## What Gets Indexed

The script indexes these archive pages:

| Page            | Title                 | URL                             |
| --------------- | --------------------- | ------------------------------- |
| Faculty Archive | Faculty and Staff     | `/faculty/`                     |
| News Archive    | News                  | `/news/`                        |
| Events Archive  | Events                | `/events/`                      |
| News & Events   | News & Events         | `/news/`                        |
| Organizations   | Student Organizations | `/organization/`                |
| Programs        | Program Directory     | `/academics/program-directory/` |

Each page is indexed with:

- **post_title** - Searchable title
- **post_type** - Type classification (usually "page")
- **post_type_label** - Human-readable label for filtering
- **permalink** - Full URL to the page
- **content** - Descriptive text about what users will find on the page
- **\_tags** - Additional searchable keywords

## Environments

The script respects your environment configuration:

- **Local/Dev**: Uses `wil_dev_searchable_posts` index
- **QA**: Uses `wilqa_searchable_posts` index
- **Production**: Uses `wil_searchable_posts` index

Make sure you're connected to the right environment before running the script.

You can switch environments with:

```bash
./scripts/switch-env.sh dev   # Development
./scripts/switch-env.sh prod  # Production
```

## When to Run This Script

Run this script when:

1. **New archive page added** - You create a new archive template that should be searchable
2. **Page content changes** - You update the description or metadata of an archive page
3. **URL changes** - Archive page URLs are modified
4. **After deploying** - When deploying to a new environment for the first time

## Verification

After running the script, verify the pages are indexed:

1. Go to [Algolia Dashboard](https://dashboard.algolia.com/)
2. Navigate to your index (`wil_searchable_posts` or similar)
3. Search for "Faculty" or "Events" - you should see the archive pages
4. Test on the live site search to confirm they appear in results

### ⚠️ Configure Custom Ranking (CRITICAL)

**Archive pages won't rank at the top until you configure Algolia's Custom Ranking.**

📖 **Follow the detailed guide: [ALGOLIA-RANKING-SETUP.md](./ALGOLIA-RANKING-SETUP.md)**

Quick summary:

1. Go to Algolia Dashboard → Your Index → Configuration → Ranking and Sorting
2. Add Custom Ranking attribute: `priority` (Descending)
3. Save changes
4. Wait 1-2 minutes and test searches

**Without this configuration, archive pages will be buried below regular WordPress posts.** The archive pages have `priority: 1000` while regular posts have no priority field (treated as 0), so configuring this will make archive pages appear first.

## Troubleshooting

### Error: ALGOLIA_ADMIN_API_KEY is not set

**Solution**: Add the Admin API key to `.env.local` (see Setup section above)

### Error 403: Forbidden

**Solution**: Your API key doesn't have write permissions. Verify you're using the Admin API key, not the search-only key.

### Pages not appearing in search

**Solution**:

1. Check you're indexing to the correct environment's index
2. Clear your Algolia cache
3. Verify the pages exist in the Algolia dashboard
4. Check that the search UI is using the same index name

### Pages are indexed but not ranking high / buried in results

**This is the most common issue!**

**Solution**: You haven't configured Algolia's Custom Ranking yet. Follow **[ALGOLIA-RANKING-SETUP.md](./ALGOLIA-RANKING-SETUP.md)** to:

1. Add `priority` as a Custom Ranking attribute (Descending)
2. This will make archive pages (`priority: 1000`) rank above regular posts (`priority: 0`)

**Test**: After configuring, search for "faculty" - the Faculty and Staff archive page should be the #1 result.

### Wrong base URL

**Solution**: The script uses `NEXT_PUBLIC_URL` from environment variables. Make sure it's set correctly in `.env.local`:

```bash
NEXT_PUBLIC_URL="https://www.wilmington.edu"  # Production
# or
NEXT_PUBLIC_URL="http://localhost:3000"  # Local
```

## Modifying Archive Pages

To add or modify archive pages, edit `scripts/index-archive-pages.js`:

```javascript
const ARCHIVE_PAGES = [
  {
    objectID: 'archive-faculty', // Unique ID
    post_title: 'Faculty and Staff', // Searchable title
    post_type: 'page', // Type
    post_type_label: 'Page', // Label for filtering
    permalink: `${BASE_URL}/faculty/`, // Full URL
    content: 'Description text...', // Searchable content
    _tags: ['faculty', 'staff', 'directory'] // Additional keywords
  }
  // Add more pages...
]
```

## Integration with Build Process

You may want to add this to your build pipeline to keep the index updated:

```json
// package.json
"scripts": {
  "postbuild": "pnpm index-archive-pages && next-sitemap"
}
```

⚠️ **Note**: This requires the Admin API key to be available in the build environment (Vercel, etc.)

## Related Files

- **Script**: `scripts/index-archive-pages.js`
- **Algolia Connector**: `src/lib/algolia/connector.js`
- **Search UI**: `src/components/molecules/AlgoliaSearch/`
- **Archive Templates**: `wp-templates/archive-*.js`
