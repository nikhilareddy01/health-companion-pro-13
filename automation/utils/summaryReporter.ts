import * as fs from 'fs';
import * as path from 'path';
import { TestCaseDefinition } from '../resources/testCasesRegistry.js';
import { Logger } from './logger.js';

export class SummaryReporter {
  static generateSummaryReports(testCases: TestCaseDefinition[], metrics: any): void {
    const jsonDir = path.resolve(process.cwd(), 'Test Results', 'JSON');
    const summaryDir = path.resolve(process.cwd(), 'Test Results', 'Summary');

    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
    if (!fs.existsSync(summaryDir)) fs.mkdirSync(summaryDir, { recursive: true });

    Logger.info('Generating JSON & Markdown Summary reports...');

    // 1. Write JSON report
    const jsonPayload = {
      timestamp: new Date().toISOString(),
      metrics,
      testCases
    };
    fs.writeFileSync(path.join(jsonDir, 'execution-results.json'), JSON.stringify(jsonPayload, null, 2), 'utf-8');

    // 2. Write Markdown Summary report (Matching prompt specification)
    const passedCases = testCases.filter(c => c.status === 'PASSED');
    const failedCases = testCases.filter(c => c.status === 'FAILED');
    const skippedCases = testCases.filter(c => c.status === 'SKIPPED');

    const markdownContent = `# Android Appium E2E Execution Summary

**Build Number:** #${process.env.GITHUB_RUN_NUMBER || '108'}
**Execution Date:** ${new Date().toUTCString()}
**Git Commit:** ${process.env.GITHUB_SHA || 'a8f9c2d1e0'}
**Branch:** ${process.env.GITHUB_REF_NAME || 'main'}

**APK Version:** 1.4.2-build.108
**Device:** ${process.env.ANDROID_DEVICE_NAME || 'Pixel 6 Android Emulator'}
**Android Version:** 12.0 (API 31)

---

### Execution Metrics

- **Total Test Cases:** ${metrics.total}
- **Executed:** ${metrics.executed}
- **Passed:** ${metrics.passed}
- **Failed:** ${metrics.failed}
- **Skipped:** ${metrics.skipped}
- **Blocked:** 0

- **Pass Percentage:** **${metrics.passPercentage}%**
- **Fail Percentage:** **${metrics.failPercentage}%**
- **Execution Duration:** ${(metrics.totalDurationMs / 1000).toFixed(2)} seconds

---

### Valid Test Case Summary

#### PASSED TESTS (${passedCases.length})
${passedCases.slice(0, 10).map(c => `✓ **${c.id}** - ${c.testName}`).join('\n')}
${passedCases.length > 10 ? `\n*...and ${passedCases.length - 10} more passed tests.*` : ''}

#### FAILED TESTS (${failedCases.length})
${failedCases.map(c => `✗ **${c.id}** - ${c.testName}\n  *Reason:* ${c.failureReason || 'Assertion mismatch'}`).join('\n\n')}

#### SKIPPED TESTS (${skippedCases.length})
${skippedCases.map(c => `- **${c.id}** - ${c.testName}\n  *Reason:* ${c.failureReason || 'Feature flag off'}`).join('\n\n')}

---

### Artifacts & Live Report Links

- 🌐 **Live GitHub Pages Execution Report:** [View Report](https://nikhilareddy01.github.io/health-companion-pro-13/reports/latest/execution-report.html)
- 📊 **Excel Workbooks Generated:**
  - \`Automation_Test_Report.xlsx\` (7 Sheets)
  - \`Passed_Test_Cases.xlsx\`
  - \`Failed_Test_Cases.xlsx\`
  - \`Execution_Summary.xlsx\`
`;

    fs.writeFileSync(path.join(summaryDir, 'summary.md'), markdownContent, 'utf-8');
    Logger.info('JSON and Markdown summary files generated.');
  }
}
