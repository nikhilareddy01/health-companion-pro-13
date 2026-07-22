export interface TestCaseDefinition {
  id: string;
  module: string;
  testName: string;
  priority: 'P0' | 'P1' | 'P2';
  preconditions: string;
  testSteps: string[];
  testData: string;
  expectedResult: string;
  actualResult?: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BLOCKED';
  durationMs?: number;
  failureReason?: string;
  stackTrace?: string;
  screenshot?: string;
}

const moduleSpecs: { module: string; prefix: string; count: number; failIndices?: number[]; skipIndices?: number[] }[] = [
  { module: 'Authentication', prefix: 'TC_AUTH', count: 40 },
  { module: 'Authorization', prefix: 'TC_AUTHZ', count: 30 },
  { module: 'Registration', prefix: 'TC_REG', count: 20 },
  { module: 'Profile Management', prefix: 'TC_PROF', count: 20 },
  { module: 'Navigation', prefix: 'TC_NAV', count: 30 },
  { module: 'Dashboard', prefix: 'TC_DASH', count: 20 },
  { module: 'Forms', prefix: 'TC_FORM', count: 40 },
  { module: 'CRUD Operations', prefix: 'TC_CRUD', count: 40 },
  { module: 'Search', prefix: 'TC_SRCH', count: 20 },
  { module: 'Filters', prefix: 'TC_FLTR', count: 20 },
  { module: 'Input Validation', prefix: 'TC_VAL', count: 40 },
  { module: 'Error Handling', prefix: 'TC_ERR', count: 20 },
  { module: 'Session Management', prefix: 'TC_SESS', count: 20 },
  { module: 'Notifications', prefix: 'TC_NOTIF', count: 20 },
  { module: 'File Upload', prefix: 'TC_FILE', count: 20 },
  { module: 'Offline Handling', prefix: 'TC_OFFL', count: 10 },
  { module: 'Accessibility', prefix: 'TC_A11Y', count: 20 },
  { module: 'Responsive UI', prefix: 'TC_RESP', count: 10 },
  { module: 'Performance Smoke Tests', prefix: 'TC_PERF', count: 20 },
  { module: 'Regression Suite', prefix: 'TC_REGR', count: 50 }
];

export function generateAllTestCases(): TestCaseDefinition[] {
  const cases: TestCaseDefinition[] = [];

  for (const spec of moduleSpecs) {
    for (let i = 1; i <= spec.count; i++) {
      const numStr = i.toString().padStart(3, '0');
      const id = `${spec.prefix}_${numStr}`;
      const isFailed = spec.failIndices?.includes(i);
      const isSkipped = spec.skipIndices?.includes(i);

      let status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BLOCKED' = 'PASSED';
      let actualResult = `Successfully completed ${spec.module} action step for ${id}.`;
      let failureReason: string | undefined = undefined;
      let stackTrace: string | undefined = undefined;

      if (isFailed) {
        status = 'FAILED';
        actualResult = `Execution failed during element state verification for ${id}.`;
        failureReason = getFailureReason(spec.module, i);
        stackTrace = `AssertionError [ERR_ASSERTION]: ${failureReason}\n    at ${spec.module}Test.verifyElement (automation/tests/${spec.prefix.toLowerCase()}.test.ts:42:15)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)`;
      } else if (isSkipped) {
        status = 'SKIPPED';
        actualResult = `Test execution skipped due to pre-requisite feature toggle disabled.`;
        failureReason = 'Feature Disabled';
      }

      cases.push({
        id,
        module: spec.module,
        testName: `${spec.module} Verification Case ${i} - ${getScenarioTitle(spec.module, i)}`,
        priority: i <= 5 ? 'P0' : i <= 15 ? 'P1' : 'P2',
        preconditions: `Android Application installed and launched. User on ${spec.module} context.`,
        testSteps: [
          `1. Navigate to ${spec.module} view.`,
          `2. Perform interaction ${getScenarioTitle(spec.module, i)}.`,
          `3. Validate response state and UI rendering.`
        ],
        testData: `Input parameters for ${id} scenario ${i}`,
        expectedResult: `${spec.module} step should execute and return expected outcome.`,
        actualResult,
        status,
        durationMs: Math.floor(Math.random() * 400) + 100,
        failureReason,
        stackTrace
      });
    }
  }

  return cases;
}

function getScenarioTitle(module: string, index: number): string {
  const titles: Record<string, string[]> = {
    Authentication: ['Valid Email & Password', 'Logout Verification', 'Invalid Password Alert', 'OTP Resend Limit', 'Session Expiry', 'Biometric Sign-In', 'Password Reset Flow', 'Remember Me Toggle', 'Social Auth Google', 'Invalid OTP Validation'],
    Authorization: ['Patient Role Access', 'Doctor Dashboard Access', 'Admin Privileges', 'Unauthorized Endpoint Intercept', 'Token Refresh Flow'],
    Registration: ['New Patient Signup', 'Duplicate Email Prevention', 'Password Strength Meter', 'Terms Agreement Modal'],
    Forms: ['Symptom Intake Form', 'Medical History Checkbox', 'Mandatory Field Validation', 'Date Picker Range', 'Dynamic Field Addition'],
    'File Upload': ['Profile Photo Upload', 'Large File Upload', 'PDF Medical Report Upload', 'Unsupported Format Rejection']
  };
  const list = titles[module] || ['Standard Operational Verification', 'Boundary Condition Verification', 'UI Alignment Verification', 'Async Response Handler'];
  return list[(index - 1) % list.length];
}

function getFailureReason(module: string, index: number): string {
  if (module === 'Authentication' && index === 10) return 'OTP validation mismatch';
  if (module === 'Authentication' && index === 28) return 'Token expiration timeout on re-auth';
  if (module === 'Forms' && index === 8) return 'Validation message missing on mandatory field submit';
  if (module === 'Forms' && index === 22) return 'Datepicker selector overlay obstructed';
  if (module === 'File Upload' && index === 2) return 'Application crash during 50MB file buffer allocation';
  if (module === 'CRUD Operations' && index === 31) return 'HTTP 500 Internal Server Error on record delete';
  if (module === 'Input Validation' && index === 14) return 'Regex failed to reject invalid phone format';
  if (module === 'Regression Suite' && index === 42) return 'Element click intercepted by loading toast';
  return 'Assertion failure: Expected UI element visibility within 15000ms';
}
