from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


SOURCE = Path('docs/TEST_PLAN.md')
OUTPUT = Path('docs/TEST_PLAN.pdf')


def parse_markdown_blocks(text: str):
    lines = text.splitlines()
    blocks = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        if not line:
            i += 1
            continue

        if line.startswith('# '):
            blocks.append(('h1', line[2:].strip()))
            i += 1
            continue

        if line.startswith('## '):
            blocks.append(('h2', line[3:].strip()))
            i += 1
            continue

        if line.startswith('### '):
            blocks.append(('h3', line[4:].strip()))
            i += 1
            continue

        if line.startswith('|'):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip())
                i += 1
            blocks.append(('table', table_lines))
            continue

        if line.startswith('- ') or line.startswith('* '):
            bullets = []
            while i < len(lines) and (
                lines[i].strip().startswith('- ') or lines[i].strip().startswith('* ')
            ):
                bullets.append(lines[i].strip()[2:].strip())
                i += 1
            blocks.append(('bullets', bullets))
            continue

        para_lines = []
        while i < len(lines):
            current = lines[i].strip()
            if not current or current.startswith('|') or current.startswith('- ') or current.startswith('* ') or current.startswith('# '):
                break
            para_lines.append(current)
            i += 1
        if para_lines:
            blocks.append(('para', ' '.join(para_lines)))

    return blocks


def parse_table(table_lines):
    rows = []
    for line in table_lines:
        clean = line.strip()
        if clean.startswith('|'):
            clean = clean[1:]
        if clean.endswith('|'):
            clean = clean[:-1]
        cells = [cell.strip() for cell in clean.split('|')]
        rows.append(cells)

    filtered_rows = []
    for row in rows:
        if len(row) == 1 and row[0] == '':
            continue
        if all(cell.replace('-', '').strip() == '' for cell in row):
            continue
        filtered_rows.append(row)

    return filtered_rows


def build_pdf():
    text = SOURCE.read_text(encoding='utf-8')
    blocks = parse_markdown_blocks(text)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        alignment=1,
        spaceAfter=18,
    )
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Heading2'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#2b3a55'),
        spaceAfter=18,
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        spaceAfter=6,
    )
    heading2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        spaceAfter=8,
        textColor=colors.HexColor('#1f4e79'),
    )
    heading3_style = ParagraphStyle(
        'Heading3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        spaceAfter=6,
    )
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=18,
        bulletIndent=8,
        spaceAfter=4,
    )

    story = []

    story.append(Paragraph('Plano de Testes', title_style))
    story.append(Paragraph('ServeRest Front (Login)', subtitle_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph('Projeto: serverest-front-playwright', body_style))
    story.append(Paragraph('Módulo: Tela de Login — https://front.serverest.dev/login', body_style))
    story.append(Paragraph('Responsável: Rodrigo Sousa — QA Automation Engineer / SDET', body_style))
    story.append(Paragraph('Ferramentas: Playwright, Node.js, GitHub Actions, Playwright MCP + Claude Code', body_style))
    story.append(Paragraph('Versão: 1.0', body_style))
    story.append(Paragraph('Data: Setembro/2026', body_style))
    story.append(Spacer(1, 30))
    story.append(Paragraph('Documento gerado para apresentação e compartilhamento.', body_style))
    story.append(PageBreak())

    toc_sections = []
    for block in blocks:
        if block[0] == 'h2':
            toc_sections.append(block[1])

    story.append(Paragraph('Sumário', heading2_style))
    for section in toc_sections:
        story.append(Paragraph(f'• {section}', body_style))
    story.append(PageBreak())

    current_section = None
    for block in blocks:
        kind, data = block

        if kind == 'h1':
            continue

        if kind == 'h2':
            current_section = data
            story.append(Paragraph(data, heading2_style))
            continue

        if kind == 'h3':
            story.append(Paragraph(data, heading3_style))
            continue

        if kind == 'para':
            story.append(Paragraph(data, body_style))
            continue

        if kind == 'bullets':
            for bullet in data:
                story.append(Paragraph(f'• {bullet}', bullet_style))
            continue

        if kind == 'table':
            rows = parse_table(data)
            if len(rows) >= 2:
                table = Table(rows)
                table.setStyle(
                    TableStyle(
                        [
                            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dfe8f6')),
                            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                            ('FONTSIZE', (0, 0), (-1, -1), 8),
                            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
                        ]
                    )
                )
                story.append(table)
                story.append(Spacer(1, 8))

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    doc.build(story)


if __name__ == '__main__':
    build_pdf()
    print(f'PDF generated successfully: {OUTPUT}')
