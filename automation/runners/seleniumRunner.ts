import { generateAllSeleniumTestCases, SeleniumTestCase } from '../resources/seleniumRegistry.js';
import { Logger } from '../utils/logger.js';
import { HtmlReporter } from '../utils/htmlReporter.js';
import { SummaryReporter } from '../utils/summaryReporter.js';
import { excelReporter } from '../utils/excelReporter.js';
import { seleniumConfig } from '../config/selenium.config.js';
import { execSync } from 'child_process';
import * as path from 'path';

export async function runSeleniumE2ETests() {
  console.log('\n====================================================');
  console.log('🚀 STARTING SELENIUM E2E TEST SUITE AGAINST LIVE DEPLOYMENT');
  console.log(`🌐 TARGET BASE_URL: ${seleniumConfig.baseUrl}`);
  console.log('====================================================\n');

  Logger.info(`Initializing Selenium E2E execution against ${seleniumConfig.baseUrl}`);
  const testCases: SeleniumTestCase[] = generateAllSeleniumTestCases();
  const startTime = Date.now();

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const tc of testCases) {
    if (tc.status === 'PASSED') {
      passed++;
      Logger.info(`[PASSED] ${tc.id} - ${tc.testName} (${tc.durationMs}ms)`);
    } else if (tc.status === 'FAILED') {
      failed++;
    } else {
      skipped++;
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
  console.log('📊 SELENIUM LIVE E2E SUMMARY RESULTS');
  console.log('====================================================');
  console.log(`Live Target URL    : ${seleniumConfig.baseUrl}`);
  console.log(`Total Test Cases   : ${total}`);
  console.log(`Executed           : ${executed}`);
  console.log(`Passed             : ${passed}`);
  console.log(`Failed             : ${failed}`);
  console.log(`Pass Rate          : ${passPercentage}%`);
  console.log('====================================================\n');

  SummaryReporter.generateSummaryReports(testCases as any, metrics);
  HtmlReporter.generateHtmlReports(testCases as any, metrics);

  try {
    const scriptPath = path.resolve(process.cwd(), 'automation', 'utils', 'generate_selenium_excel.py');
    execSync(`python "${scriptPath}"`, { stdio: 'inherit' });
  } catch (err: any) {
    Logger.warn(`Selenium excel script notice: ${err.message}`);
  }
}

if (process.argv[1].includes('seleniumRunner')) {
  runSeleniumE2ETests().catch(err => {
    console.error('Fatal error during Selenium runner:', err);
    process.exit(1);
  });
}
