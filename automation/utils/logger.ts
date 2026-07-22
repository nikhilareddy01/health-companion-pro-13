import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private static logDir = path.resolve(process.cwd(), 'Test Results', 'Logs');

  private static ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  static info(message: string): void {
    this.log('INFO', message);
  }

  static warn(message: string): void {
    this.log('WARN', message);
  }

  static error(message: string, stack?: string): void {
    this.log('ERROR', `${message}${stack ? `\n${stack}` : ''}`);
  }

  private static log(level: string, message: string): void {
    this.ensureLogDir();
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level}] ${message}\n`;
    const filePath = path.join(this.logDir, 'execution.log');
    fs.appendFileSync(filePath, logLine, 'utf-8');
    console.log(`[${level}] ${message}`);
  }
}
