# Incident Response Report: Formstack CORS Policy Change

## Incident Summary

On or after July 22, 2025, Formstack implemented a change to their CORS policy that prevented direct form submissions from browser clients. This change caused all form submissions on the Wilmington College website to fail (currently only the RFI form). The issue was detected by our partner on September 09, 2025, and was resolved on September 10, 2025 by implementing a server-side API integration.

## Timeline

### July 22, 2025

- 12:30:25 PM: Last successful form submission recorded

### September 10, 2025

- 9:00 AM: Investigation began
- 10:30 AM: Root cause identified as Formstack CORS policy change
- 11:15 AM: Solution approach determined - use Formstack API
- 3:00 PM: Server-side API integration implemented
- 4:30 PM: Testing completed, fix deployed to production
- 5:00 PM: Issue resolved

## Root Cause

Formstack changed their security policy to disable Cross-Origin Resource Sharing (CORS), preventing our client-side JavaScript from directly submitting form data to Formstack's servers. This change was made without advance notice and broke all form submissions on the Wilmington College website.

## Impact

- All form submissions on the Wilmington College website failed since July 22, 2025
- Partner reported frustration from prospects who attempted to submit forms
- Compared to last year's data, we estimate that approximately 41 form submissions were lost during this period. (Based on an average of 0.695 submissions per day over 60 days.)

## Resolution

We implemented a server-side solution using the Formstack API to bypass CORS restrictions:

1. Created a new API endpoint (`/api/formstack`) that securely proxies requests to Formstack
2. Updated the Form component to submit data to our API endpoint instead of directly to Formstack
3. Implemented proper error handling and user feedback during form submission
4. Maintained the existing "thank you page" redirect flow for successful submissions
5. Added fallback mechanisms for API token retrieval to ensure reliability

## Technical Changes

1. Modified `Form.tsx` to:
   - Transform form data to match Formstack API requirements
   - Submit data to our server-side endpoint
   - Handle submission responses appropriately

2. Created/updated server-side API endpoints:
   - Added token retrieval from WordPress GraphQL
   - Added fallback to environment variable for token retrieval
   - Implemented proper error handling and logging

3. Added loading indicators and improved UX during form submission

## Lessons Learned

1. **Third-party Dependency Risk**: We need better monitoring for third-party services like Formstack to detect issues before users report them.

2. **Architectural Weakness**: Direct client-to-third-party API calls created a single point of failure that was outside our control.

## Action Items

1. **Document Third-Party Dependencies**: Create a catalog of all third-party services with contact information and API documentation.

2. **Review Similar Vulnerabilities**: Audit other components that make direct third-party API calls from the client and consider server-side proxies.

3. **Improve Error Reporting**: Enhance client-side error reporting to provide more actionable information when third-party services fail.

4. **Establish Communication Protocol**: Create a formal process for notifying partners about third-party service disruptions.

## Conclusion

The incident was successfully resolved by implementing a server-side integration with the Formstack API. The solution is more robust than the previous implementation as it avoids CORS issues entirely and provides better error handling. The website is now successfully capturing form submissions again.
