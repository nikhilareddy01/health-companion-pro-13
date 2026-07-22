export const appiumConfig = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/',
  logLevel: 'info' as const,
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Appium_E2E_Emulator',
    'appium:platformVersion': process.env.ANDROID_VERSION || '12.0',
    'appium:app': process.env.APK_PATH || './AuraHealth_Companion.apk',
    'appium:appPackage': 'com.aurahealth.companion',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 300
  },
  timeouts: {
    implicit: 10000,
    explicit: 15000,
    pageLoad: 30000
  },
  retryCount: 2
};
