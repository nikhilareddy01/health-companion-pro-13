import { BasePage } from './BasePage.js';

export class AuthPage extends BasePage {
  // Locators
  private emailInput = 'id=com.aurahealth.companion:id/email_input';
  private passwordInput = 'id=com.aurahealth.companion:id/password_input';
  private loginButton = 'id=com.aurahealth.companion:id/login_btn';
  private otpInput = 'id=com.aurahealth.companion:id/otp_input';
  private verifyOtpButton = 'id=com.aurahealth.companion:id/verify_otp_btn';
  private logoutButton = 'id=com.aurahealth.companion:id/logout_btn';
  private errorMessage = 'id=com.aurahealth.companion:id/error_txt';

  async login(email: string, pass: string): Promise<void> {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, pass);
    await this.click(this.loginButton);
  }

  async verifyOtp(otp: string): Promise<void> {
    await this.type(this.otpInput, otp);
    await this.click(this.verifyOtpButton);
  }

  async logout(): Promise<void> {
    await this.click(this.logoutButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}
