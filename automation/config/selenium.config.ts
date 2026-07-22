export const seleniumConfig = {
  baseUrl: process.env.BASE_URL || 'https://nikhilareddy01.github.io/health-companion-pro-13/',
  browser: process.env.BROWSER || 'chrome',
  isHeadless: process.env.HEADLESS !== 'false',
  implicitTimeout: 10000,
  pageLoadTimeout: 30000,
  retryAttempts: 2
};
