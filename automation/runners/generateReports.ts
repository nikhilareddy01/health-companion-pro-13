import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { HtmlReporter } from '../utils/htmlReporter.js';
import { SummaryReporter } from '../utils/summaryReporter.js';
import { ExcelReporter } from '../utils/excelReporter.js';
import { Logger } from '../utils/logger.js';

export function generateAllReports() {
  const jsonResultsPath = path.resolve(process.cwd(), 'Test Results', 'JSON', 'execution-results.json');
  if (!fs.existsSync(jsonResultsPath)) {
    Logger.warn('No execution-results.json found. Run test runner first.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonResultsPath, 'utf-8'));
  const testCases = data.testCases;
  const metrics = data.metrics;

  Logger.info('Generating reports from JSON results payload...');
  SummaryReporter.generateSummaryReports(testCases, metrics);
  HtmlReporter.generateHtmlReports(testCases, metrics);
  ExcelReporter.generateExcelReports();

  try {
    const pdfScriptPath = path.resolve(process.cwd(), 'automation', 'utils', 'generate_pdf.py');
    execSync(`python "${pdfScriptPath}"`, { stdio: 'inherit' });
    Logger.info('PDF Report generated successfully.');
  } catch (err: any) {
    Logger.warn(`PDF generation notice: ${err.message}`);
  }
}

if (process.argv[1].includes('generateReports')) {
  generateAllReports();
}
