import json
import os
import sys

def generate_selenium_excel_reports():
    results_path = os.path.join(os.getcwd(), 'Test Results', 'JSON', 'execution-results.json')
    excel_dir = os.path.join(os.getcwd(), 'Test Results', 'Excel')
    os.makedirs(excel_dir, exist_ok=True)

    if not os.path.exists(results_path):
        print(f"JSON results file not found at {results_path}")
        return

    with open(results_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    test_cases = data.get('testCases', [])
    metrics = data.get('metrics', {})

    try:
        import pandas as pd
    except ImportError:
        print("Pandas not installed, skipping Excel generation.")
        return

    # 1. Automation_Test_Report.xlsx (6 Sheets)
    report_path = os.path.join(excel_dir, 'Automation_Test_Report.xlsx')
    with pd.ExcelWriter(report_path, engine='openpyxl') as writer:
        # Sheet 1: Executed Test Cases
        df_all = pd.DataFrame([{
            'Test ID': tc['id'],
            'Module': tc['module'],
            'Test Name': tc['testName'],
            'Status': tc['status'],
            'Execution Time': f"{tc.get('durationMs', 0)} ms",
            'Priority': tc['priority']
        } for tc in test_cases])
        df_all.to_excel(writer, sheet_name='Executed Test Cases', index=False)

        # Sheet 2: Passed Tests
        df_passed = df_all[df_all['Status'] == 'PASSED']
        df_passed.to_excel(writer, sheet_name='Passed Tests', index=False)

        # Sheet 3: Failed Tests
        df_failed = df_all[df_all['Status'] == 'FAILED']
        df_failed.to_excel(writer, sheet_name='Failed Tests', index=False)

        # Sheet 4: Skipped Tests
        df_skipped = df_all[df_all['Status'] == 'SKIPPED']
        df_skipped.to_excel(writer, sheet_name='Skipped Tests', index=False)

        # Sheet 5: Execution Metrics
        df_metrics = pd.DataFrame([
            {'Metric': 'Target Live Deployment URL', 'Value': process_env_url()},
            {'Metric': 'Total Test Cases', 'Value': metrics.get('total', 0)},
            {'Metric': 'Executed', 'Value': metrics.get('executed', 0)},
            {'Metric': 'Passed', 'Value': metrics.get('passed', 0)},
            {'Metric': 'Failed', 'Value': metrics.get('failed', 0)},
            {'Metric': 'Skipped', 'Value': metrics.get('skipped', 0)},
            {'Metric': 'Pass Percentage', 'Value': f"{metrics.get('passPercentage', 0)}%"},
            {'Metric': 'Execution Duration', 'Value': f"{metrics.get('totalDurationMs', 0)} ms"}
        ])
        df_metrics.to_excel(writer, sheet_name='Execution Metrics', index=False)

        # Sheet 6: Defect Summary
        df_defects = pd.DataFrame([{
            'Defect ID': f"DEF-WEB-{idx+1:03d}",
            'Test ID': tc['id'],
            'Module': tc['module'],
            'Summary': tc.get('failureReason', 'None'),
            'Severity': tc['priority']
        } for idx, tc in enumerate([t for t in test_cases if t['status'] == 'FAILED'])])
        df_defects.to_excel(writer, sheet_name='Defect Summary', index=False)

    # 2. Failed_Test_Cases.xlsx
    with pd.ExcelWriter(os.path.join(excel_dir, 'Failed_Test_Cases.xlsx'), engine='openpyxl') as writer:
        df_failed.to_excel(writer, sheet_name='Failed', index=False)

    # 3. Passed_Test_Cases.xlsx
    with pd.ExcelWriter(os.path.join(excel_dir, 'Passed_Test_Cases.xlsx'), engine='openpyxl') as writer:
        df_passed.to_excel(writer, sheet_name='Passed', index=False)

    # 4. Summary_Report.xlsx
    with pd.ExcelWriter(os.path.join(excel_dir, 'Summary_Report.xlsx'), engine='openpyxl') as writer:
        df_metrics.to_excel(writer, sheet_name='Summary', index=False)

    print("All 4 Selenium Excel workbooks generated successfully.")

def process_env_url():
    return os.environ.get('BASE_URL', 'https://nikhilareddy01.github.io/health-companion-pro-13/')

if __name__ == '__main__':
    generate_selenium_excel_reports()
