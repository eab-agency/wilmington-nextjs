#!/usr/bin/env python3
"""
WordPress HTML Block Scanner
Scans all WordPress pages for HTML blocks containing scripts.
"""

import os
import re
import sys
import base64
import json
from typing import List, Dict, Any
from urllib.parse import urljoin
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: 'requests' library not found. Install it with: pip install requests")
    sys.exit(1)

try:
    from dotenv import load_dotenv
except ImportError:
    print("Error: 'python-dotenv' library not found. Install it with: pip install python-dotenv")
    sys.exit(1)


def load_env_file():
    """Load environment variables from .env.local"""
    env_path = Path(__file__).parent.parent / '.env.local'
    if not env_path.exists():
        print(f"Error: .env.local file not found at {env_path}")
        sys.exit(1)

    load_dotenv(env_path)

    wp_url = os.getenv('NEXT_PUBLIC_WORDPRESS_URL')
    wp_user = os.getenv('WORDPRESS_APPLICATION_USERNAME')
    wp_pass = os.getenv('WORDPRESS_APPLICATION_PASSWORD')

    if not all([wp_url, wp_user, wp_pass]):
        print("Error: Missing required environment variables:")
        if not wp_url:
            print("  - NEXT_PUBLIC_WORDPRESS_URL")
        if not wp_user:
            print("  - WORDPRESS_APPLICATION_USERNAME")
        if not wp_pass:
            print("  - WORDPRESS_APPLICATION_PASSWORD")
        sys.exit(1)

    # Remove spaces from application password (WordPress format)
    wp_pass = wp_pass.replace(' ', '')

    return wp_url.rstrip('/'), wp_user, wp_pass


def get_auth_header(username: str, password: str) -> Dict[str, str]:
    """Generate Basic Auth header for WordPress REST API"""
    credentials = f"{username}:{password}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {
        'Authorization': f'Basic {encoded}',
        'Content-Type': 'application/json'
    }


def fetch_all_pages(wp_url: str, headers: Dict[str, str]) -> List[Dict[str, Any]]:
    """Fetch all pages from WordPress REST API with pagination"""
    pages = []
    page_num = 1
    per_page = 100

    print(f"Fetching pages from {wp_url}...")

    while True:
        url = f"{wp_url}/wp-json/wp/v2/pages"
        params = {
            'per_page': per_page,
            'page': page_num,
            '_fields': 'id,title,link,content'  # Only fetch fields we need
        }

        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()

            batch = response.json()
            if not batch:
                break

            pages.extend(batch)
            print(f"  Fetched page {page_num} ({len(batch)} pages)")

            # Check if there are more pages
            total_pages = int(response.headers.get('X-WP-TotalPages', 1))
            if page_num >= total_pages:
                break

            page_num += 1

        except requests.exceptions.RequestException as e:
            print(f"Error fetching pages: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response: {e.response.text}")
            break

    print(f"Total pages fetched: {len(pages)}\n")
    return pages


def extract_html_blocks(content: str) -> List[str]:
    """Extract HTML blocks from WordPress content"""
    # WordPress Gutenberg HTML block pattern
    html_block_pattern = r'<!-- wp:html -->(.*?)<!-- /wp:html -->'
    blocks = re.findall(html_block_pattern, content, re.DOTALL)
    return [block.strip() for block in blocks if block.strip()]


def find_scripts_in_html(html: str) -> List[Dict[str, str]]:
    """Find all script tags in HTML content"""
    script_pattern = r'<script([^>]*)>(.*?)</script>'
    scripts = []

    for match in re.finditer(script_pattern, html, re.DOTALL | re.IGNORECASE):
        attributes = match.group(1)
        content = match.group(2)

        # Extract src attribute if present
        src_match = re.search(r'src=["\']([^"\']*)["\']', attributes)
        src = src_match.group(1) if src_match else None

        scripts.append({
            'src': src,
            'has_inline_content': bool(content.strip()),
            'inline_content': content.strip()[:100] + '...' if len(content.strip()) > 100 else content.strip(),
            'full_tag': match.group(0)[:200] + '...' if len(match.group(0)) > 200 else match.group(0)
        })

    return scripts


def scan_pages(pages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Scan all pages for scripts in HTML content"""
    results = {
        'total_pages': len(pages),
        'pages_with_scripts': 0,
        'findings': []
    }

    print("Scanning pages for scripts...\n")
    print("=" * 80)

    for page in pages:
        page_id = page['id']
        page_title = page['title']['rendered']
        page_url = page['link']
        content = page['content']['rendered']

        # Look for any scripts in the rendered HTML
        scripts = find_scripts_in_html(content)

        if scripts:
            results['pages_with_scripts'] += 1
            results['findings'].append({
                'id': page_id,
                'title': page_title,
                'url': page_url,
                'scripts': scripts,
                'script_count': len(scripts)
            })

            # Print finding
            print(f"\n📄 Page: {page_title}")
            print(f"   URL: {page_url}")
            print(f"   Scripts found: {len(scripts)}\n")

            for idx, script in enumerate(scripts, 1):
                if script['src']:
                    print(f"   {idx}. 🔗 External script: {script['src']}")
                if script['has_inline_content']:
                    print(f"   {idx}. 📝 Inline script: {script['inline_content']}")
            print("-" * 80)

    return results


def save_results(results: Dict[str, Any], output_file: str = 'html_blocks_scan_results.json'):
    """Save scan results to JSON file"""
    output_path = Path(__file__).parent / output_file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\n✅ Results saved to: {output_path}")


def main():
    """Main execution"""
    print("WordPress HTML Block Scanner")
    print("=" * 80)
    print()

    # Load environment variables
    wp_url, wp_user, wp_pass = load_env_file()
    print(f"WordPress URL: {wp_url}")
    print(f"Username: {wp_user}")
    print()

    # Prepare auth
    headers = get_auth_header(wp_user, wp_pass)

    # Fetch all pages
    pages = fetch_all_pages(wp_url, headers)

    if not pages:
        print("No pages found or error fetching pages.")
        return

    # Scan pages for HTML blocks with scripts
    results = scan_pages(pages)

    # Print summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total pages scanned: {results['total_pages']}")
    print(f"Pages with scripts: {results['pages_with_scripts']}")

    if results['findings']:
        print(f"\n🚨 Found {len(results['findings'])} pages with scripts")
        print("\nPages with scripts:")
        for finding in results['findings']:
            print(f"  - {finding['title']} ({finding['script_count']} script(s))")
            print(f"    {finding['url']}")
    else:
        print("\n✅ No scripts found in any pages")

    # Save results
    save_results(results)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nScan cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
