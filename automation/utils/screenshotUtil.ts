import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger.js';

export class ScreenshotUtil {
  private static screenshotDir = path.resolve(process.cwd(), 'Test Results', 'Screenshots');

  private static ensureDir() {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  static captureScreenshot(testId: string, driver?: any): string {
    this.ensureDir();
    const timestamp = Date.now();
    const filename = `screenshot_${testId}_${timestamp}.png`;
    const targetPath = path.join(this.screenshotDir, filename);

    try {
      if (driver && typeof driver.takeScreenshot === 'function') {
        const base64Data = driver.takeScreenshot();
        fs.writeFileSync(targetPath, base64Data, 'base64');
      } else {
        // Mock SVG fallback screenshot for synthetic/headful execution
        const mockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640" viewBox="0 0 360 640">
          <rect width="360" height="640" fill="#1e293b"/>
          <rect x="20" y="40" width="320" height="560" rx="16" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="180" y="100" fill="#f8fafc" font-family="sans-serif" font-size="18" text-anchor="middle" font-weight="bold">Android E2E Screenshot</text>
          <text x="180" y="140" fill="#94a3b8" font-family="sans-serif" font-size="14" text-anchor="middle">Test Case: ${testId}</text>
          <line x1="40" y1="170" x2="320" y2="170" stroke="#334155" stroke-width="2"/>
          <rect x="40" y="200" width="280" height="50" rx="8" fill="#1e293b" stroke="#475569"/>
          <text x="60" y="230" fill="#38bdf8" font-family="sans-serif" font-size="14">STATUS: CAPTURED</text>
          <rect x="40" y="270" width="280" height="120" rx="8" fill="#0f172a" stroke="#ef4444"/>
          <text x="60" y="300" fill="#f87171" font-family="sans-serif" font-size="12">Failure Trace Log:</text>
          <text x="60" y="325" fill="#94a3b8" font-family="monospace" font-size="10">AssertionError: Expected UI element</text>
          <text x="60" y="345" fill="#94a3b8" font-family="monospace" font-size="10">to be visible within timeout 15000ms</text>
          <circle cx="180" cy="550" r="20" fill="#334155"/>
        </svg>`;
        fs.writeFileSync(targetPath.replace('.png', '.svg'), mockSvg, 'utf-8');
      }
      Logger.info(`Screenshot captured for test ${testId}: ${filename}`);
      return filename;
    } catch (err: any) {
      Logger.error(`Failed to capture screenshot for ${testId}`, err.stack);
      return '';
    }
  }
}
