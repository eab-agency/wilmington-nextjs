# FaustWP Preview Infinite Loop - Troubleshooting Guide

## Problem
When clicking "Preview" in WordPress, the page refreshes infinitely at the Next.js frontend URL.

## Root Cause
The infinite loop occurs because:
1. FaustWP tries to authenticate the preview request
2. Authentication fails or isn't properly established
3. The component redirects to WordPress login
4. After login, redirects back to preview
5. Authentication still not established → infinite loop

## Solution Steps

### 1. Check WordPress FaustWP Plugin Settings

In your WordPress admin (https://wordpress.wilmington.edu/wp-admin):

1. Go to **Settings → Faust**
2. Verify **Front-end site URL** matches your deployment:
   - For QA: `https://qa-web.wilmington.edu`
   - For Production: `https://www.wilmington.edu`
   - For Local Dev: `http://localhost:3000`
3. Ensure **Secret Key** matches your `FAUST_SECRET_KEY` in `.env.local`
4. Click **Save Changes**

### 2. Verify Environment Variables

Check your `.env.local` (or Vercel environment variables for QA):

```bash
# Must match WordPress plugin Front-end site URL
NEXT_PUBLIC_URL=https://qa-web.wilmington.edu

# WordPress backend URL
NEXT_PUBLIC_WORDPRESS_URL=https://wordpress.wilmington.edu/

# Must match WordPress plugin Secret Key
FAUST_SECRET_KEY=your-secret-key-here

# WordPress Application Password for authentication
WORDPRESS_APPLICATION_USERNAME=your-email@example.com
WORDPRESS_APPLICATION_PASSWORD=your-app-password-here
```

### 3. Check WordPress Application Password

1. In WordPress, go to **Users → Profile**
2. Scroll to **Application Passwords**
3. Create a new application password if needed
4. Copy the password (format: `XXXX XXXX XXXX XXXX XXXX XXXX`)
5. Update `WORDPRESS_APPLICATION_PASSWORD` in environment variables

### 4. Verify Preview URL Format

The preview URL from WordPress should look like:
```
https://qa-web.wilmington.edu/preview?preview=true&previewPathname=/path/to/page/&p=12345&...
```

NOT like:
```
https://qa-web.wilmington.edu/path/to/page/?preview_id=12345&preview_nonce=...
```

If you see the second format, it means WordPress is using the wrong redirect URL.

### 5. Clear Cookies and Test

1. Clear all cookies for both `wilmington.edu` and `qa-web.wilmington.edu`
2. Log into WordPress
3. Edit a page
4. Click "Preview" button
5. Should redirect to Next.js frontend and load preview correctly

## Known Issues

### Issue: Safari Localhost Preview
**Problem:** Safari blocks authentication cookies on localhost
**Solution:** Use HTTPS for localhost or test in Chrome/Firefox

### Issue: Different Environment URLs
**Problem:** WordPress plugin has one Front-end URL, but you're testing on another
**Solution:** Update the Front-end site URL in WordPress to match your current environment

### Issue: Application Password Expired
**Problem:** WordPress application passwords can expire or be revoked
**Solution:** Generate a new application password and update environment variables

## Debugging

Add this to your `pages/preview.js` temporarily to debug:

```javascript
import { WordPressTemplate, useAuth } from '@faustwp/core'
import { useEffect } from 'react'

export default function Preview(props) {
  const { isAuthenticated, isReady, loginUrl } = useAuth()

  useEffect(() => {
    console.log('Preview Debug:', {
      isAuthenticated,
      isReady,
      loginUrl,
      url: typeof window !== 'undefined' ? window.location.href : 'SSR'
    })
  }, [isAuthenticated, isReady, loginUrl])

  return <WordPressTemplate {...props} />
}
```

Check browser console for authentication status.

## Still Not Working?

1. Check that the WordPress plugin is active and up to date
2. Verify CORS headers aren't blocking authentication requests
3. Check browser Network tab for failed authentication API calls
4. Ensure `next.config.js` includes `withFaust()` wrapper
5. Verify `faust.config.js` is imported in `_app.js`
