// ========== Lighthouse Config for SEO & Performance Audits ==========
// Usage: npm install --save-dev @lighthouse/automation
// Run: npx lighthouse https://devj.com --config-path=lighthouse-config.js

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    onlyAudits: [
      // Performance metrics
      'first-meaningful-paint',
      'largest-contentful-paint',
      'first-input-delay',
      'cumulative-layout-shift',
      'total-blocking-time',
      'speed-index',
      
      // SEO audits
      'meta-description',
      'http-status-code',
      'crawlable-anchors',
      'is-crawlable',
      'robots-txt',
      'document-title',
      'meta-viewport',
      'apple-touch-icon',
      'maskable-icon',
      'themed-omnibox',
      'canonical',
      'image-alt-text',
      'hreflang-valid-values',
      'structured-data-markup',
      
      // Best practices
      'uses-https',
      'doctype',
      'no-vulnerable-libraries',
      'no-unload-listeners',
      'notification-on-start',
      'password-inputs-can-be-pasted-into',
      'errors-in-console',
      
      // Accessibility
      'button-name',
      'color-contrast',
      'image-alt-text',
      'input-image-alt',
      'label',
      'meta-description',
      'tabindex'
    ],
    formFactor: 'mobile', // Test mobile first
    throttling: {
      rttMs: 40,
      throughputKbps: 11000,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 11000,
      uploadThroughputKbps: 11000
    },
    // Set thresholds for passing
    budgets: [
      {
        type: 'performance',
        budget: 2500 // ms, LCP must be < 2.5s
      },
      {
        type: 'cumulative-layout-shift',
        budget: 100 // basis points (0.1)
      },
      {
        type: 'first-input-delay',
        budget: 100 // ms
      }
    ]
  }
};
