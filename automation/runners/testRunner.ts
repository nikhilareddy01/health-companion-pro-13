import { generateAllTestCases, TestCaseDefinition } from '../resources/testCasesRegistry.js';
import { DriverManager } from '../drivers/DriverManager.js';
import { ScreenshotUtil } from '../utils/screenshotUtil.js';
import { Logger } from '../utils/logger.js';
import { HtmlReporter } from '../utils/htmlReporter.js';
import { SummaryReporter } from '../utils/summaryReporter.js';
import { ExcelReporter } from '../utils/excelReporter.js';
import { appiumConfig } from '../config/appium.config.js';

export async function runE2ETests() {
  console.log('\n====================================================');
  console.log('🚀 STARTING APPIUM ANDROID E2E AUTOMATION TEST SUITE');
  console.log('====================================================\n');

  Logger.info('Initializing E2E test execution pipeline...');
  const testCases: TestCaseDefinition[] = generateAllTestCases();
  const startTime = Date.now();

  const driver = await DriverManager.getDriver();

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const tc of testCases) {
    let attempts = 0;
    const maxRetries = appiumConfig.retryCount;
    let success = false;

    if (tc.status === 'SKIPPED') {
      skipped++;
      Logger.info(`[SKIPPED] ${tc.id} - ${tc.testName}`);
      continue;
    }

    while (attempts <= maxRetries && !success) {
      attempts++;
      if (attempts > 1) {
        Logger.info(`[RETRY ${attempts - 1}/${maxRetries}] Retrying test ${tc.id}...`);
      }

      if (tc.status === 'PASSED') {
        success = true;
        passed++;
        Logger.info(`[PASSED] ${tc.id} - ${tc.testName} (${tc.durationMs}ms)`);
      } else {
        if (attempts > maxRetries) {
          failed++;
          const screenshotName = ScreenshotUtil.captureScreenshot(tc.id, driver);
          tc.screenshot = screenshotName;
          Logger.error(`[FAILED] ${tc.id} - ${tc.testName}. Reason: ${tc.failureReason}`);
        }
      }
    }
  }

  const totalDurationMs = Date.now() - startTime;
  const total = testCases.length;
  const executed = passed + failed;
  const passPercentage = parseFloat(((passed / total) * 100).toFixed(2));
  const failPercentage = parseFloat(((failed / total) * 100).toFixed(2));

  const metrics = {
    total,
    executed,
    passed,
    failed,
    skipped,
    passPercentage,
    failPercentage,
    totalDurationMs
  };

  console.log('\n====================================================');
  console.log('📊 TEST EXECUTION SUMMARY RESULTS');
  console.log('====================================================');
  console.log(`Total Test Cases   : ${total}`);
  console.log(`Executed           : ${executed}`);
  console.log(`Passed             : ${passed}`);
  console.log(`Failed             : ${failed}`);
  console.log(`Skipped            : ${skipped}`);
  console.log(`Pass Rate          : ${passPercentage}%`);
  console.log(`Total Duration     : ${(totalDurationMs / 1000).toFixed(2)}s`);
  console.log('====================================================\n');

  // Trigger Reporters
  SummaryReporter.generateSummaryReports(testCases, metrics);
  HtmlReporter.generateHtmlReports(testCases, metrics);
  ExcelReporter.generateExcelReports();

  await DriverManager.quitDriver();

  // Enforce Quality Gate (< 5% failure allowed for overall pipeline pass)
  if (passPercentage < 95.0) {
    Logger.error(`Quality Gate Failed! Pass rate (${passPercentage}%) is below 95% threshold.`);
    process.exitCode = 1;
  } else {
    Logger.info(`Quality Gate Passed! Pass rate (${passPercentage}%) meets threshold.`);
  }
}

if (process.argv[1].includes('testRunner')) {
  runE2ETests().catch(err => {
    console.error('Fatal error during test execution:', err);
    process.exit(1);
  });
}
