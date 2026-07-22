import json
import os
import sys

def generate_pdf_report():
    results_path = os.path.join(os.getcwd(), 'Test Results', 'JSON', 'execution-results.json')
    pdf_dir = os.path.join(os.getcwd(), 'Test Results', 'PDF')
    os.makedirs(pdf_dir, exist_ok=True)

    if not os.path.exists(results_path):
        print("JSON results file not found.")
        return

    with open(results_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    test_cases = data.get('testCases', [])
    metrics = data.get('metrics', {})

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    except ImportError:
        print("ReportLab package not found. Unable to generate PDF.")
        return

    pdf_filename = os.path.join(pdf_dir, 'Automation_Test_Report.pdf')
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=8
    )

    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1e293b')
    )

    cell_bold_style = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # Title Banner
    story.append(Paragraph("📱 Android Appium E2E Automation Report", title_style))
    story.append(Paragraph(f"Enterprise Test Execution Results • Generated on {data.get('timestamp', '2026-07-22')}", subtitle_style))
    story.append(Spacer(1, 10))

    # Metrics Summary Table
    metrics_data = [
        [
            Paragraph("<b>TOTAL TESTS</b>", cell_style),
            Paragraph("<b>EXECUTED</b>", cell_style),
            Paragraph("<b>PASSED</b>", cell_style),
            Paragraph("<b>FAILED</b>", cell_style),
            Paragraph("<b>SKIPPED</b>", cell_style),
            Paragraph("<b>PASS RATE</b>", cell_style)
        ],
        [
            Paragraph(f"<font size=12><b>{metrics.get('total', 0)}</b></font>", cell_style),
            Paragraph(f"<font size=12><b>{metrics.get('executed', 0)}</b></font>", cell_style),
            Paragraph(f"<font size=12 color='#10b981'><b>{metrics.get('passed', 0)}</b></font>", cell_style),
            Paragraph(f"<font size=12 color='#ef4444'><b>{metrics.get('failed', 0)}</b></font>", cell_style),
            Paragraph(f"<font size=12 color='#f59e0b'><b>{metrics.get('skipped', 0)}</b></font>", cell_style),
            Paragraph(f"<font size=12 color='#10b981'><b>{metrics.get('passPercentage', 0)}%</b></font>", cell_style)
        ]
    ]

    metrics_table = Table(metrics_data, colWidths=[90, 90, 90, 90, 90, 90])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 15))

    # Module Breakdown Section
    story.append(Paragraph("Module Execution Summary", h2_style))

    # Group test cases by module
    module_counts = {}
    for tc in test_cases:
        mod = tc['module']
        if mod not in module_counts:
            module_counts[mod] = {'total': 0, 'passed': 0, 'failed': 0, 'skipped': 0}
        module_counts[mod]['total'] += 1
        st = tc['status'].lower()
        if st in module_counts[mod]:
            module_counts[mod][st] += 1

    mod_table_data = [
        [
            Paragraph("<b>Module Name</b>", cell_bold_style),
            Paragraph("<b>Total Cases</b>", cell_bold_style),
            Paragraph("<b>Passed</b>", cell_bold_style),
            Paragraph("<b>Failed</b>", cell_bold_style),
            Paragraph("<b>Skipped</b>", cell_bold_style),
            Paragraph("<b>Pass Rate</b>", cell_bold_style)
        ]
    ]

    for mod, counts in module_counts.items():
        rate = round((counts['passed'] / counts['total']) * 100, 1) if counts['total'] > 0 else 0
        mod_table_data.append([
            Paragraph(mod, cell_style),
            Paragraph(str(counts['total']), cell_style),
            Paragraph(f"<font color='#10b981'>{counts['passed']}</font>", cell_style),
            Paragraph(f"<font color='#ef4444'>{counts['failed']}</font>", cell_style),
            Paragraph(f"<font color='#f59e0b'>{counts['skipped']}</font>", cell_style),
            Paragraph(f"<b>{rate}%</b>", cell_style)
        ])

    mod_table = Table(mod_table_data, colWidths=[150, 75, 75, 75, 75, 90])
    mod_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f1f5f9')]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(mod_table)
    story.append(Spacer(1, 15))

    # Detailed Test Cases Table (First 40 cases preview + summary notice)
    story.append(Paragraph("Executed Test Cases Detail (Sample Preview)", h2_style))
    tc_table_data = [
        [
            Paragraph("<b>Test ID</b>", cell_bold_style),
            Paragraph("<b>Module</b>", cell_bold_style),
            Paragraph("<b>Test Name</b>", cell_bold_style),
            Paragraph("<b>Priority</b>", cell_bold_style),
            Paragraph("<b>Status</b>", cell_bold_style)
        ]
    ]

    for tc in test_cases[:35]:
        st_color = '#10b981' if tc['status'] == 'PASSED' else '#ef4444' if tc['status'] == 'FAILED' else '#f59e0b'
        tc_table_data.append([
            Paragraph(tc['id'], cell_style),
            Paragraph(tc['module'], cell_style),
            Paragraph(tc['testName'], cell_style),
            Paragraph(tc['priority'], cell_style),
            Paragraph(f"<font color='{st_color}'><b>{tc['status']}</b></font>", cell_style)
        ])

    tc_table = Table(tc_table_data, colWidths=[80, 100, 230, 50, 80])
    tc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e293b')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(tc_table)
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"<i>...and {len(test_cases) - 35} additional test cases detailed in execution-report.html & Automation_Test_Report.xlsx</i>", subtitle_style))

    doc.build(story)
    print(f"PDF Report generated successfully: {pdf_filename}")

if __name__ == '__main__':
    generate_pdf_report()
