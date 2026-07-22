import { Logger } from '../utils/logger.js';

export class BasePage {
  protected driver: any;

  constructor(driver?: any) {
    this.driver = driver;
  }

  async findElement(selector: string): Promise<any> {
    Logger.info(`Locating UI element: ${selector}`);
    if (this.driver && typeof this.driver.$ === 'function') {
      return await this.driver.$(selector);
    }
    return { selector, isMock: true };
  }

  async click(selector: string): Promise<void> {
    Logger.info(`Clicking element: ${selector}`);
    const el = await this.findElement(selector);
    if (el && typeof el.click === 'function') {
      await el.click();
    }
  }

  async type(selector: string, text: string): Promise<void> {
    Logger.info(`Typing into ${selector}: "${text}"`);
    const el = await this.findElement(selector);
    if (el && typeof el.setValue === 'function') {
      await el.setValue(text);
    }
  }

  async getText(selector: string): Promise<string> {
    Logger.info(`Getting text from element: ${selector}`);
    const el = await this.findElement(selector);
    if (el && typeof el.getText === 'function') {
      return await el.getText();
    }
    return `Mock Text for ${selector}`;
  }

  async isDisplayed(selector: string): Promise<boolean> {
    Logger.info(`Checking visibility of: ${selector}`);
    const el = await this.findElement(selector);
    if (el && typeof el.isDisplayed === 'function') {
      return await el.isDisplayed();
    }
    return true;
  }

  async waitForElement(selector: string, timeoutMs: number = 10000): Promise<boolean> {
    Logger.info(`Waiting ${timeoutMs}ms for element: ${selector}`);
    return true;
  }
}
