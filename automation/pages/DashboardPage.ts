import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  private headerTitle = 'id=com.aurahealth.companion:id/dashboard_title';
  private healthScoreBadge = 'id=com.aurahealth.companion:id/health_score';
  private appointmentsCard = 'id=com.aurahealth.companion:id/card_appointments';
  private vitalsCard = 'id=com.aurahealth.companion:id/card_vitals';
  private quickAddSymptomBtn = 'id=com.aurahealth.companion:id/btn_add_symptom';

  async isLoaded(): Promise<boolean> {
    return await this.isDisplayed(this.headerTitle);
  }

  async getHealthScore(): Promise<string> {
    return await this.getText(this.healthScoreBadge);
  }

  async openAppointments(): Promise<void> {
    await this.click(this.appointmentsCard);
  }

  async openVitals(): Promise<void> {
    await this.click(this.vitalsCard);
  }
}
