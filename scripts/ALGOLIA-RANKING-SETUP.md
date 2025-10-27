# Algolia Custom Ranking Setup for Archive Pages

## Problem

Archive pages are indexed but don't rank high enough in search results. Regular WordPress posts outrank them for common keywords like "faculty", "news", "events".

## Solution

Configure Algolia to use the `priority` field for custom ranking. Archive pages have `priority: 1000` while regular posts don't have this field (treated as 0).

## Step-by-Step Configuration

### 1. Go to Algolia Dashboard

1. Navigate to [Algolia Dashboard](https://dashboard.algolia.com/)
2. Select your application: **3ZD4ZBUBDM**
3. Go to **Indices** (left sidebar)

### 2. Configure Production Index (`wil_searchable_posts`)

1. Click on the **`wil_searchable_posts`** index
2. Go to **Configuration** tab (top navigation)
3. Click **Ranking and Sorting** (left sidebar)

### 3. Add Custom Ranking Attribute

Scroll to the **Custom Ranking** section:

1. Click **+ Add a custom ranking attribute**
2. Enter: `priority`
3. Select: **Descending** (higher priority = higher rank)
4. Click **Save** or **Review and Save Changes**

**Before:**

```
Custom Ranking:
  (empty or default settings)
```

**After:**

```
Custom Ranking:
  1. priority (Descending)
  [any existing custom ranking rules below this]
```

### 4. Verify Settings

The final ranking formula should look like:

1. **Typo** (default)
2. **Geo** (default, if applicable)
3. **Words** (default)
4. **Filters** (default)
5. **Proximity** (default)
6. **Attribute** (default)
7. **Exact** (default)
8. **Custom** → **priority (desc)** ← **NEW**

### 5. Repeat for Other Environments

If you use multiple environments, configure each index:

#### QA Environment (`wilqa_searchable_posts`)

- Follow the same steps for the QA index

#### Dev Environment (`wil_dev_searchable_posts`)

- Follow the same steps for the dev index
- You'll need to run `pnpm index-archive-pages` in dev environment too

## How It Works

### Archive Pages (Priority: 1000)

```javascript
{
  objectID: 'archive-faculty',
  post_title: 'Faculty and Staff',
  priority: 1000,        // ← High priority
  is_archive_page: true
}
```

### Regular WordPress Posts (No Priority Field)

```javascript
{
  objectID: 'post-12345',
  post_title: 'Meet Our New Faculty Members',
  // priority field not set (treated as 0)
}
```

### Search Ranking Result

When searching for "faculty":

1. ✅ **Faculty and Staff** (archive, priority: 1000) → Appears FIRST
2. Meet Our New Faculty Members (post, priority: 0)
3. Faculty Research Grants Awarded (post, priority: 0)
4. etc.

## Testing

After configuring custom ranking:

1. Wait 1-2 minutes for Algolia to apply changes
2. Test searches on your site:

   - Search "faculty" → Should show "Faculty and Staff" page first
   - Search "news" → Should show "News" page first
   - Search "events" → Should show "Events" page first
   - Search "organizations" → Should show "Student Organizations" first

3. Verify in Algolia Dashboard:
   - Go to index → **Browse** tab
   - Search for "faculty"
   - The `archive-faculty` result should appear at the top

## Troubleshooting

### Archive pages still not ranking high

**Check Custom Ranking Order:**

- The `priority (desc)` should be FIRST in the Custom Ranking list
- If other custom ranking attributes exist, drag `priority` to the top

**Clear Cache:**

```bash
# Restart your dev server
pnpm dev
```

**Re-index:**

```bash
pnpm index-archive-pages
```

### Need to adjust priority values

Edit `scripts/index-archive-pages.js`:

```javascript
// Increase for even higher priority
priority: 10000,

// Or make specific pages higher than others
// Faculty - highest priority
priority: 5000,
// News - medium priority
priority: 3000,
// Events - lower priority
priority: 1000,
```

Then re-run: `pnpm index-archive-pages`

## Alternative: Use Optional Filters (Advanced)

If custom ranking doesn't work or you want more control, you can boost archive pages using optional filters in your search configuration.

### In Search Components

Edit search configuration to add optional filters:

```javascript
// src/components/molecules/AlgoliaSearch/Search.js (or wherever Configure is used)
<Configure
  hitsPerPage={6}
  optionalFilters={[
    'is_archive_page:true<score=1000>' // Boost archive pages
  ]}
  // ... other config
/>
```

This adds a ranking boost of 1000 to any result where `is_archive_page: true`.

## Related Files

- **Indexing Script**: `scripts/index-archive-pages.js`
- **This Guide**: `scripts/ALGOLIA-RANKING-SETUP.md`
- **General Docs**: `scripts/README-archive-indexing.md`
