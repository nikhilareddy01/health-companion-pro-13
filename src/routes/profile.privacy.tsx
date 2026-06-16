import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/profile/privacy")({ component: Page });

function Page() {
  return (
    <Screen title="Privacy Policy" contentClass="px-5 pb-8">
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground">Your data, your control.</p>
        <p>MediCare AI is committed to safeguarding your personal health information. We use end-to-end encryption for all sensitive records and never sell your data to third parties.</p>
        <p className="font-semibold text-foreground">What we collect</p>
        <p>Health metrics you log, medication schedules, and basic profile information needed to deliver personalized recommendations.</p>
        <p className="font-semibold text-foreground">How we use it</p>
        <p>To power AI-driven recommendations, send timely reminders, and improve the quality of guidance you receive.</p>
        <p className="font-semibold text-foreground">Your rights</p>
        <p>You can export or delete your data at any time from Account Settings.</p>
      </div>
    </Screen>
  );
}
