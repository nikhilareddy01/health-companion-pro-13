import json
import os
import sys

def create_excel_reports():
    results_path = os.path.join(os.getcwd(), 'Test Results', 'JSON', 'execution-results.json')
    excel_dir = os.path.join(os.getcwd(), 'Test Results', 'Excel')
    os.makedirs(excel_dir, exist_ok=True)

    if not os.path.exists(results_path):
        print(f"Results file {results_path} not found.")
        return

    with open(results_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    test_cases = data.get('testCases', [])
    metrics = data.get('metrics', {})

    try:
        import pandas as pd
    except ImportError:
        print("Pandas not installed, creating CSV fallback spreadsheets...")
        create_csv_fallback(test_cases, metrics, excel_dir)
        return

    # 1. Automation_Test_Report.xlsx (7 Sheets)
    report_path = os.path.join(excel_dir, 'Automation_Test_Report.xlsx')
    with pd.ExcelWriter(report_path, engine='openpyxl') as writer:
        # Sheet 1: Executed Test Cases
        df_all = pd.DataFrame([{
            'Test ID': tc['id'],
            'Module': tc['module'],
            'Test Name': tc['testName'],
            'Priority': tc['priority'],
            'Status': tc['status'],
            'Execution Time (ms)': tc.get('durationMs', 0)
        } for tc in test_cases])
        df_all.to_excel(writer, sheet_name='Executed Test Cases', index=False)

        # Sheet 2: Passed Tests
        df_passed = df_all[df_all['Status'] == 'PASSED']
        df_passed.to_excel(writer, sheet_name='Passed Tests', index=False)

        # Sheet 3: Failed Tests
        df_failed = pd.DataFrame([{
            'Test ID': tc['id'],
            'Module': tc['module'],
            'Test Name': tc['testName'],
            'Priority': tc['priority'],
            'Failure Reason': tc.get('failureReason', ''),
            'Stack Trace': tc.get('stackTrace', '')
        } for tc in test_cases if tc['status'] == 'FAILED'])
        df_failed.to_excel(writer, sheet_name='Failed Tests', index=False)

        # Sheet 4: Skipped Tests
        df_skipped = pd.DataFrame([{
            'Test ID': tc['id'],
            'Module': tc['module'],
            'Test Name': tc['testName'],
            'Reason': tc.get('failureReason', 'Skipped by filter')
        } for tc in test_cases if tc['status'] == 'SKIPPED'])
        df_skipped.to_excel(writer, sheet_name='Skipped Tests', index=False)

        # Sheet 5: Execution Metrics
        df_metrics = pd.DataFrame([
            {'Metric': 'Total Test Cases', 'Value': metrics.get('total', 0)},
            {'Metric': 'Executed', 'Value': metrics.get('executed', 0)},
            {'Metric': 'Passed', 'Value': metrics.get('passed', 0)},
            {'Metric': 'Failed', 'Value': metrics.get('failed', 0)},
            {'Metric': 'Skipped', 'Value': metrics.get('skipped', 0)},
            {'Metric': 'Pass Percentage', 'Value': f"{metrics.get('passPercentage', 0)}%"},
            {'Metric': 'Fail Percentage', 'Value': f"{metrics.get('failPercentage', 0)}%"},
            {'Metric': 'Execution Duration', 'Value': f"{metrics.get('totalDurationMs', 0)} ms"}
        ])
        df_metrics.to_excel(writer, sheet_name='Execution Metrics', index=False)

        # Sheet 6: Defect Summary
        df_defects = pd.DataFrame([{
            'Defect ID': f"DEF-{idx+1:03d}",
            'Test ID': tc['id'],
            'Module': tc['module'],
            'Summary': tc.get('failureReason', 'Assertion Failed'),
            'Severity': 'High' if tc['priority'] == 'P0' else 'Medium'
        } for idx, tc in enumerate([t for t in test_cases if t['status'] == 'FAILED'])])
        df_defects.to_excel(writer, sheet_name='Defect Summary', index=False)

        # Sheet 7: Pass Rate Summary
        module_groups = df_all.groupby('Module')['Status'].value_counts().unstack(fill_value=0)
        module_groups.to_excel(writer, sheet_name='Pass Rate Summary')

    # 2. Passed_Test_Cases.xlsx
    with pd.ExcelWriter(os.path.join(excel_dir, 'Passed_Test_Cases.xlsx'), engine='openpyxl') as writer:
        df_passed.to_excel(writer, sheet_name='Passed', index=False)

    # 3. Failed_Test_Cases.xlsx
    with pd.ExcelWriter(os.path.join(excel_dir, 'Failed_Test_Cases.xlsx'), engine='openpyxl') as writer:
        df_failed.to_excel(writer, sheet_name='Failed', index=False)

    # 4. Execution_Summary.xlsx
    with pd.ExcelWriter(os.path.join(excel_dir, 'Execution_Summary.xlsx'), engine='openpyxl') as writer:
        df_metrics.to_excel(writer, sheet_name='Summary', index=False)

    print("All 4 Excel workbooks generated successfully.")

def create_csv_fallback(test_cases, metrics, excel_dir):
    import csv
    with open(os.path.join(excel_dir, 'Automation_Test_Report.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Test ID', 'Module', 'Test Name', 'Priority', 'Status', 'Execution Time (ms)'])
        for tc in test_cases:
            writer.writerow([tc['id'], tc['module'], tc['testName'], tc['priority'], tc['status'], tc.get('durationMs', 0)])

    with open(os.path.join(excel_dir, 'Passed_Test_Cases.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Test ID', 'Module', 'Test Name', 'Priority', 'Status'])
        for tc in test_cases:
            if tc['status'] == 'PASSED':
                writer.writerow([tc['id'], tc['module'], tc['testName'], tc['priority'], tc['status']])

    with open(os.path.join(excel_dir, 'Failed_Test_Cases.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Test ID', 'Module', 'Test Name', 'Priority', 'Failure Reason'])
        for tc in test_cases:
            if tc['status'] == 'FAILED':
                writer.writerow([tc['id'], tc['module'], tc['testName'], tc['priority'], tc.get('failureReason', '')])

    with open(os.path.join(excel_dir, 'Execution_Summary.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Metric', 'Value'])
        for k, v in metrics.items():
            writer.writerow([k, v])

if __name__ == '__main__':
    create_excel_reports()
