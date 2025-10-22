/**
 * Centralized Configuration: Allowed Script Sources for BlockHtml Component
 *
 * This file defines which external script domains are permitted to execute
 * in WordPress HTML blocks rendered by the BlockHtml component.
 *
 * Add trusted domains here to allow their scripts to execute.
 *
 * Note: This is client-side filtering only. Scripts not from these domains
 * will be removed from the DOM before execution.
 */

/**
 * List of allowed script source domains
 * Scripts from these domains (and their subdomains) are permitted to load
 * in BlockHtml components.
 *
 * @type {string[]}
 */
export const ALLOWED_SCRIPT_DOMAINS = [
  'admiss.info', // EAB/Mautic forms and APIs
  'formstack.com', // Formstack forms and APIs
  'youtube.com', // YouTube embeds
  'workforcenow.adp.com', // ADP recruitment widget
  'youvisit.com', // Virtual campus tours
  'flickr.com', // Photo gallery embeds
  'acuityscheduling.com', // Appointment scheduling
  'boxcast.com' // Video streaming platform
  // Add additional trusted domains below:
  // 'google-analytics.com',
  // 'googletagmanager.com',
  // 'cdn.example.com',
]
