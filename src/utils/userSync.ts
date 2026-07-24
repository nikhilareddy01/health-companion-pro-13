import { getApiUrl } from './api';

export function getActiveUserId(): string {
  if (typeof window === 'undefined') return 'demo_user';
  const email = localStorage.getItem('demo_email') || 'demo@example.com';
  return localStorage.getItem('demo_user_id') || `user_${email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
}

export async function pushUserCloud(userId?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const uid = userId || getActiveUserId();
  if (!uid) return;

  const dataSnapshot: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes(uid) || key.startsWith('profile_') || key.startsWith('diet_') || key.startsWith('medicines') || key.startsWith('water_intake_') || key.startsWith('eaten_meals_') || key.startsWith('daily_diet_') || key.startsWith('user_conditions_') || key.startsWith('demo_'))) {
      const val = localStorage.getItem(key);
      if (val !== null) {
        dataSnapshot[key] = val;
      }
    }
  }

  try {
    await fetch(getApiUrl('/api/profiles/sync_userdata'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, fullData: dataSnapshot })
    });
  } catch (err) {
    console.warn('[UserSync] Push error:', err);
  }
}

export async function pullUserCloud(userId?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const uid = userId || getActiveUserId();
  if (!uid) return false;

  try {
    const res = await fetch(getApiUrl(`/api/profiles/get_userdata/${uid}`));
    if (!res.ok) return false;
    const json = await res.json();

    if (json && json.data && typeof json.data === 'object') {
      let updated = false;
      Object.keys(json.data).forEach((key) => {
        if (json.data[key] !== null && json.data[key] !== undefined) {
          const current = localStorage.getItem(key);
          if (current !== String(json.data[key])) {
            localStorage.setItem(key, String(json.data[key]));
            updated = true;
          }
        }
      });

      if (updated) {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('user-cloud-synced', { detail: { userId: uid } }));
        return true;
      }
    }
  } catch (err) {
    console.warn('[UserSync] Pull error:', err);
  }
  return false;
}

export function saveAndSync(key: string, value: string, userId?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
  const uid = userId || getActiveUserId();
  pushUserCloud(uid).catch(() => void 0);
  window.dispatchEvent(new Event('storage'));
}

// Background Live Synchronization for Web & App
let syncIntervalId: any = null;

export function startLiveBackgroundSync(): void {
  if (typeof window === 'undefined') return;
  if (syncIntervalId) return;

  const runSyncCycle = () => {
    const uid = getActiveUserId();
    if (uid) {
      pullUserCloud(uid).then(() => {
        pushUserCloud(uid).catch(() => void 0);
      }).catch(() => void 0);
    }
  };

  // Immediate pull on start
  runSyncCycle();

  // Poll every 4 seconds for continuous live bi-directional sync
  syncIntervalId = setInterval(runSyncCycle, 4000);

  // Sync immediately when switching back to the app/tab
  window.addEventListener('focus', runSyncCycle);
  window.addEventListener('online', runSyncCycle);
}

// Auto-start live sync when file is imported
if (typeof window !== 'undefined') {
  startLiveBackgroundSync();
}
