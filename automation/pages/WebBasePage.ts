import { seleniumConfig } from '../config/selenium.config.js';
import { Logger } from '../utils/logger.js';

export class WebBasePage {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = seleniumConfig.baseUrl;
  }

  getLiveUrl(path: string = ''): string {
    const cleanBase = this.baseUrl.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
  }

  async navigateTo(path: string = ''): Promise<void> {
    const targetUrl = this.getLiveUrl(path);
    Logger.info(`Selenium WebDriver navigating to LIVE URL: ${targetUrl}`);
  }
}
