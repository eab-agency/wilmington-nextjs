# WordPress HTML Block Scanner

This script scans all WordPress pages to identify HTML blocks containing JavaScript, which is important for maintaining the security whitelist in `src/config/allowedScriptDomains.js`.

## Purpose

After implementing script domain whitelisting in the BlockHtml component, this tool helps identify:
- Which pages use HTML blocks
- Which HTML blocks contain `<script>` tags
- What external script sources are being used
- Any inline JavaScript code

## Installation

1. Install Python dependencies:
```bash
cd scripts
pip install -r requirements.txt
```

Or install globally:
```bash
pip install requests python-dotenv
```

## Usage

Run the scanner:
```bash
python scan_html_blocks.py
```

Or if you made it executable:
```bash
./scan_html_blocks.py
```

## What It Does

1. Reads WordPress credentials from `.env.local`
2. Connects to the WordPress REST API
3. Fetches all pages
4. Searches for `<!-- wp:html -->` blocks
5. Identifies any `<script>` tags within those blocks
6. Reports findings to console and saves to `html_blocks_scan_results.json`

## Output

The script provides:
- Console output with detailed findings
- A JSON file (`html_blocks_scan_results.json`) with complete scan results

### Example Output

```
📄 Page: Employment at Wilmington College
   URL: https://www.wilmington.edu/about/employment
   HTML Blocks: 1
   Blocks with scripts: 1

   Block #1:
      🔗 External script: https://workforcenow.adp.com/mascsr/default/mdf/recwebcomponents/recruitment/main-config/recruitment.js

SUMMARY
=========================================
Total pages scanned: 145
Pages with HTML blocks: 12
Pages with scripts in HTML blocks: 3
```

## Next Steps

After running the scan:
1. Review the found scripts
2. Determine which are legitimate/required
3. Add their domains to `src/config/allowedScriptDomains.js`
4. Test the pages to ensure functionality
5. Inform the client about any blocked scripts

## Security Note

This tool uses the WordPress Application Password stored in `.env.local`. Ensure this file is never committed to version control.
