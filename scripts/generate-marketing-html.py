#!/usr/bin/env python3
"""
Generate beautifully formatted HTML marketing pages from markdown files.
Uses card-based layout with slate-dominant colors matching the one-pager style.
"""

import os
import re

DOCS_DIR = "/Users/peta/Documents/Beacon/webapp/beacon"
OUTPUT_DIR = f"{DOCS_DIR}/public/presentation-pdfs"

# HTML template with slate-dominant styling
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100" rel="stylesheet">
  <style>
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #2E2E38;
      background: white;
    }}

    .material-symbols-outlined {{
      font-family: 'Material Symbols Outlined';
      font-weight: 100;
      font-style: normal;
      line-height: 1;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
    }}

    .container {{
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }}

    /* Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }}

    .logo {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }}

    .logo-icon {{
      font-size: 40px;
      color: #64afac;
    }}

    .logo-text h1 {{
      font-size: 1.875rem;
      font-weight: 700;
      color: #2B4162;
    }}

    .logo-text p {{
      font-size: 0.875rem;
      color: #737A8C;
    }}

    .print-btn {{
      background: #2B4162;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: opacity 0.2s;
    }}

    .print-btn:hover {{
      opacity: 0.9;
    }}

    /* Title Section */
    .title-section {{
      text-align: center;
      margin-bottom: 3rem;
    }}

    .title-section h2 {{
      font-size: 2.5rem;
      font-weight: 700;
      color: #2B4162;
      margin-bottom: 0.75rem;
    }}

    .title-section p {{
      font-size: 1.25rem;
      color: #737A8C;
    }}

    /* Content */
    .content {{
      max-width: 100%;
    }}

    h2 {{
      font-size: 2rem;
      font-weight: 700;
      color: #2B4162;
      margin: 3rem 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    h3 {{
      font-size: 1.5rem;
      font-weight: 600;
      color: #2B4162;
      margin: 2rem 0 1rem 0;
    }}

    h4 {{
      font-size: 1.125rem;
      font-weight: 600;
      color: #2B4162;
      margin: 1.5rem 0 0.75rem 0;
    }}

    p {{
      margin: 1rem 0;
      color: #737A8C;
      line-height: 1.8;
      font-size: 1rem;
    }}

    ul {{
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }}

    li {{
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      color: #737A8C;
      font-size: 0.875rem;
    }}

    li:before {{
      content: "•";
      position: absolute;
      left: 0;
      color: #2B4162;
      font-weight: bold;
      font-size: 1.2em;
    }}

    strong {{
      color: #2B4162;
      font-weight: 600;
    }}

    /* Card Grids */
    .grid-2 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }}

    .grid-3 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }}

    .card {{
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s;
    }}

    .card:hover {{
      border-color: #2B4162;
      box-shadow: 0 4px 12px rgba(43, 65, 98, 0.1);
    }}

    .card-slate {{
      background: #eeefec;
      border-color: #2B4162;
    }}

    .card h4 {{
      margin: 0 0 0.75rem 0;
    }}

    .card p {{
      font-size: 0.875rem;
      margin: 0.5rem 0;
    }}

    .card ul {{
      margin: 0.5rem 0 0 0;
    }}

    /* Footer */
    .footer {{
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #737A8C;
      font-size: 0.875rem;
    }}

    /* Print Styles */
    @media print {{
      @page {{
        size: A4;
        margin: 1.5cm;
      }}

      body {{
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }}

      .print-btn {{
        display: none !important;
      }}

      .container {{
        padding: 0;
      }}

      h2 {{
        page-break-after: avoid;
      }}

      .card {{
        page-break-inside: avoid;
      }}
    }}

    @media (max-width: 768px) {{
      .container {{
        padding: 1.5rem;
      }}

      .header {{
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }}

      .title-section h2 {{
        font-size: 2rem;
      }}

      .grid-2, .grid-3 {{
        grid-template-columns: 1fr;
      }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <a href="/" class="logo">
        <span class="material-symbols-outlined logo-icon">health_and_safety</span>
        <div class="logo-text">
          <h1>Beacon</h1>
          <p>Wellbeing Platform</p>
        </div>
      </a>
      <button class="print-btn" onclick="window.print()">
        <span class="material-symbols-outlined" style="font-size: 20px;">print</span>
        Print / Save PDF
      </button>
    </div>

    <!-- Title Section -->
    <div class="title-section">
      <h2>{hero_title}</h2>
      <p>{hero_subtitle}</p>
    </div>

    <!-- Content -->
    <div class="content">
{content}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Beacon Effect</strong></p>
      <p>hello@beaconeffect.com.au | 1300 BEACON (232 266) | www.beaconeffect.com.au</p>
      <p style="margin-top: 0.5rem;">© 2025 Beacon Effect. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
"""

def parse_markdown_to_html(md_content):
    """Convert markdown content to HTML with card-based layout"""
    html = []
    lines = md_content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines and horizontal rules
        if not line or line == '---':
            i += 1
            continue
        
        # H1 - skip (already in title)
        if line.startswith('# '):
            i += 1
            continue
        
        # H2 - Major section
        if line.startswith('## '):
            title = line[3:].strip()
            icon = get_icon_for_section(title)
            html.append(f'<h2><span class="material-symbols-outlined" style="font-size: 28px; color: #2B4162;">{icon}</span> {title}</h2>')
            i += 1
            continue
        
        # H3 - Subsection
        if line.startswith('### '):
            html.append(f'<h3>{line[4:].strip()}</h3>')
            i += 1
            continue
        
        # H4 - Card title
        if line.startswith('#### '):
            html.append(f'<h4>{line[5:].strip()}</h4>')
            i += 1
            continue
        
        # Lists
        if line.startswith('- ') or line.startswith('* ') or re.match(r'^\d+\.', line):
            html.append('<ul>')
            while i < len(lines) and (lines[i].strip().startswith('- ') or lines[i].strip().startswith('* ') or re.match(r'^\d+\.', lines[i].strip())):
                item = re.sub(r'^[-*]\s+|^\d+\.\s+', '', lines[i].strip())
                item = format_inline_markdown(item)
                html.append(f'<li>{item}</li>')
                i += 1
            html.append('</ul>')
            continue
        
        # Paragraphs
        if line:
            para = format_inline_markdown(line)
            html.append(f'<p>{para}</p>')
        
        i += 1
    
    return '\n'.join(html)

def format_inline_markdown(text):
    """Format bold, italic, code, etc."""
    # Bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    # Italic
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    # Code
    text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
    return text

def get_icon_for_section(title):
    """Return appropriate Material Icon for section"""
    title_lower = title.lower()
    if 'dashboard' in title_lower or 'overview' in title_lower:
        return 'dashboard'
    elif 'metric' in title_lower or 'measure' in title_lower:
        return 'analytics'
    elif 'insight' in title_lower or 'intelligence' in title_lower:
        return 'lightbulb'
    elif 'feature' in title_lower:
        return 'star'
    elif 'implementation' in title_lower or 'timeline' in title_lower:
        return 'rocket_launch'
    elif 'compliance' in title_lower or 'privacy' in title_lower:
        return 'gavel'
    elif 'support' in title_lower or 'help' in title_lower:
        return 'support'
    elif 'contact' in title_lower:
        return 'mail'
    elif 'question' in title_lower or 'faq' in title_lower:
        return 'help'
    else:
        return 'article'

def generate_html_page(md_file, output_name, hero_title, hero_subtitle):
    """Generate a complete HTML page from markdown"""
    print(f"Generating {output_name}...")
    
    # Read markdown
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert to HTML
    html_content = parse_markdown_to_html(md_content)
    
    # Create full HTML
    full_html = HTML_TEMPLATE.format(
        title=hero_title,
        hero_title=hero_title,
        hero_subtitle=hero_subtitle,
        content=html_content
    )
    
    # Write to file
    output_path = os.path.join(OUTPUT_DIR, output_name)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    print(f"✅ Created {output_name}")

# Main execution
print("🎨 Generating marketing pages with slate-dominant styling...\n")

pages = [
    ("DASHBOARD_INSIGHTS_SUMMARY.md", "Beacon-Dashboard-Insights.html", 
     "Executive Intelligence Dashboard", "Transform data into action with real-time wellbeing insights"),
    ("BEACON_CLIENT_SUMMARY.md", "Beacon-Platform-Summary.html",
     "Complete Wellbeing Platform", "From survey to insights—everything you need in one place"),
    ("BEACON_CLIENT_PROPOSAL.md", "Beacon-Client-Proposal.html",
     "Partner with Beacon", "Transform workplace wellbeing with evidence-based insights"),
    ("EMAIL_TEMPLATES.md", "Beacon-Email-Templates.html",
     "Communication Templates", "Ready-to-use email templates for client engagement"),
]

for md_file, output_name, hero_title, hero_subtitle in pages:
    md_path = os.path.join(DOCS_DIR, md_file)
    if os.path.exists(md_path):
        generate_html_page(md_path, output_name, hero_title, hero_subtitle)
    else:
        print(f"⚠️  Skipping {md_file} (not found)")

print("\n✅ All marketing pages generated!")
print(f"📍 Location: {OUTPUT_DIR}")
print("\nView at:")
print("  http://localhost:3002/presentation-pdfs/Beacon-Dashboard-Insights.html")
print("  http://localhost:3002/presentation-pdfs/Beacon-Platform-Summary.html")
print("  http://localhost:3002/presentation-pdfs/Beacon-Client-Proposal.html")
print("  http://localhost:3002/presentation-pdfs/Beacon-Email-Templates.html")




