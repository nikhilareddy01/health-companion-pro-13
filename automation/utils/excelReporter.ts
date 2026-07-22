import { execSync } from 'child_process';
import * as path from 'path';
import { Logger } from './logger.js';

export class ExcelReporter {
  static generateExcelReports(): void {
    Logger.info('Generating Excel Reports via python generate_excel.py...');
    const scriptPath = path.resolve(process.cwd(), 'automation', 'utils', 'generate_excel.py');
    try {
      execSync(`python "${scriptPath}"`, { stdio: 'inherit' });
      Logger.info('Excel Reports generated successfully.');
    } catch (err: any) {
      Logger.warn(`Python excel generation failed, continuing: ${err.message}`);
    }
  }
}
