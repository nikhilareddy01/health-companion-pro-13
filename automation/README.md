# 📱 Android Appium E2E Automation & CI/CD Reporting Framework

## 🌟 Executive Overview
This repository contains an enterprise-grade, fully automated Mobile End-to-End (E2E) testing framework for Android applications. Built using **Appium**, **TypeScript**, **Page Object Model (POM)**, **Data-Driven Architecture**, and **GitHub Actions**, it provides continuous validation across **440 executable test cases** covering 20 core functional modules.

---

## 📂 Framework Directory Structure

```
automation/
├── config/
│   └── appium.config.ts            # Appium server, capabilities & timeout configurations
├── pages/
│   ├── BasePage.ts                 # Parent POM class with core Appium driver element interactions
│   ├── AuthPage.ts                 # Authentication page objects & flows
│   ├── DashboardPage.ts            # Patient & Doctor dashboard view locators
│   ├── ProfilePage.ts              # Profile management & settings page objects
│   ├── FormPage.ts                 # Symptom intake & medical history form page objects
│   └── NavigationPage.ts           # Tab & drawer navigation interactions
├── data/
│   └── testData.ts                 # Data-driven test suites (credentials, forms, search queries)
├── drivers/
│   └── DriverManager.ts            # Appium driver session manager & lifecycle handler
├── resources/
│   └── testCasesRegistry.ts        # Registry of 440 executable test cases across 20 modules
├── utils/
│   ├── excelReporter.ts            # Multi-sheet Excel workbook generator
│   ├── generate_excel.py           # Python engine for 4 .xlsx workbooks & 7 report sheets
│   ├── htmlReporter.ts             # Interactive HTML dashboards (execution-report, dashboard, trends)
│   ├── summaryReporter.ts          # JSON payload & GitHub Step Summary generator
│   ├── screenshotUtil.ts           # Automatic screen capture on failure
│   └── logger.ts                   # Centralized file and console logger
├── listeners/
│   └── TestListener.ts             # Event listener for test pass/fail hooks
├── runners/
│   ├── testRunner.ts               # E2E test execution orchestrator & quality gate checker
│   └── generateReports.ts          # Standalone report generator from JSON execution artifacts
└── README.md                       # Comprehensive framework & setup documentation
```

---

## 📊 Module Test Distribution (440 Total Test Cases)

| Module | Test Case Range | Total Cases | P0 | P1 | P2 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Authentication** | `TC_AUTH_001` - `TC_AUTH_040` | 40 | 5 | 10 | 25 |
| **Authorization** | `TC_AUTHZ_001` - `TC_AUTHZ_030` | 30 | 5 | 10 | 15 |
| **Registration** | `TC_REG_001` - `TC_REG_020` | 20 | 5 | 10 | 5 |
| **Profile Management** | `TC_PROF_001` - `TC_PROF_020` | 20 | 5 | 10 | 5 |
| **Navigation** | `TC_NAV_001` - `TC_NAV_030` | 30 | 5 | 10 | 15 |
| **Dashboard** | `TC_DASH_001` - `TC_DASH_020` | 20 | 5 | 10 | 5 |
| **Forms** | `TC_FORM_001` - `TC_FORM_040` | 40 | 5 | 10 | 25 |
| **CRUD Operations** | `TC_CRUD_001` - `TC_CRUD_040` | 40 | 5 | 10 | 25 |
| **Search** | `TC_SRCH_001` - `TC_SRCH_020` | 20 | 5 | 10 | 5 |
| **Filters** | `TC_FLTR_001` - `TC_FLTR_020` | 20 | 5 | 10 | 5 |
| **Input Validation** | `TC_VAL_001` - `TC_VAL_040` | 40 | 5 | 10 | 25 |
| **Error Handling** | `TC_ERR_001` - `TC_ERR_020` | 20 | 5 | 10 | 5 |
| **Session Management** | `TC_SESS_001` - `TC_SESS_020` | 20 | 5 | 10 | 5 |
| **Notifications** | `TC_NOTIF_001` - `TC_NOTIF_020` | 20 | 5 | 10 | 5 |
| **File Upload** | `TC_FILE_001` - `TC_FILE_020` | 20 | 5 | 10 | 5 |
| **Offline Handling** | `TC_OFFL_001` - `TC_OFFL_010` | 10 | 5 | 5 | 0 |
| **Accessibility** | `TC_A11Y_001` - `TC_A11Y_020` | 20 | 5 | 10 | 5 |
| **Responsive UI** | `TC_RESP_001` - `TC_RESP_010` | 10 | 5 | 5 | 0 |
| **Performance Smoke Tests**| `TC_PERF_001` - `TC_PERF_020` | 20 | 5 | 10 | 5 |
| **Regression Suite** | `TC_REGR_001` - `TC_REGR_050` | 50 | 5 | 10 | 35 |
| **TOTAL** | | **440** | **100** | **190** | **150** |

---

## ⚡ Local Execution Guide

### Prerequisites
1. **Node.js** (v18+) and **npm** (v9+)
2. **Java Development Kit (JDK 17)**
3. **Android SDK** with `adb`, `emulator`, and `uiautomator2` driver (`appium driver install uiautomator2`)
4. **Python 3.10+** (for multi-sheet Excel generation via pandas/openpyxl)

### Running the E2E Suite
```bash
# 1. Install project dependencies
npm install

# 2. Run E2E Test Suite (Appium + Reporting)
npm run test:e2e

# 3. Generate standalone reports from existing results
npm run build:reports
```

---

## 🔄 CI/CD Pipeline & GitHub Actions (21 Stages)

The workflow `.github/workflows/android-e2e.yml` automatically triggers on `push`, `pull_request`, `schedule` (daily at 2:00 AM UTC), and `workflow_dispatch`.

### Pipeline Execution Flow
1. **Stage 1**: Checkout Repository
2. **Stage 2**: Setup Java (JDK 17)
3. **Stage 3**: Setup Node.js (v20)
4. **Stage 4**: Install Android Dependencies & Appium UiAutomator2 Driver
5. **Stage 5**: Build Android APK (`./gradlew assembleDebug`)
6. **Stage 6**: Start Android Emulator (`reactivecircus/android-emulator-runner@v2`)
7. **Stage 7**: Verify Emulator Readiness (`adb wait-for-device`)
8. **Stage 8**: Install APK onto Emulator (`adb install -r`)
9. **Stage 9**: Start Appium Server (`npx appium --port 4723`)
10. **Stage 10**: Verify Appium Server Health
11. **Stage 11**: Execute Appium E2E Test Suite (`npm run test:e2e`)
12. **Stage 12**: Capture Failure Screenshots
13. **Stage 13**: Capture ADB Logcat & Appium Server Logs
14. **Stage 14**: Generate Excel Reports (`Automation_Test_Report.xlsx`, etc.)
15. **Stage 15**: Generate Responsive HTML Reports (`execution-report.html`, `dashboard.html`)
16. **Stage 16**: Generate JSON Execution Results (`execution-results.json`)
17. **Stage 17**: Generate Markdown Step Summary (`summary.md`)
18. **Stage 18**: Upload Test Execution Artifacts (30-day retention)
19. **Stage 19**: Deploy Latest Reports to GitHub Pages
20. **Stage 20**: Update Historical Build Archives (`reports/history/build-N/`)
21. **Stage 21**: Publish GitHub Action Step Summary

---

## 🌐 Live GitHub Pages Hosting

Published reports are hosted automatically at:
`https://<github-username>.github.io/<repository-name>/reports/latest/execution-report.html`

Historical build archives are preserved at:
`https://<github-username>.github.io/<repository-name>/reports/history/build-<BUILD_NUMBER>/execution-report.html`

---

## 🛑 Quality Gate & Failure Criteria

- **Workflow FAILS when:**
  - Infrastructure setup (Emulator, ADB, Appium) fails
  - APK installation fails
  - Overall suite Pass Rate is **less than 95%** (< 418 passed out of 440)
- **Workflow PASSES when:**
  - All infrastructure steps succeed
  - Pass Rate **>= 95%**
