#!/usr/bin/env python3
import subprocess
import os

DOCS_DIR = "/Users/peta/Documents/Beacon/webapp/beacon"
OUTPUT_DIR = f"{DOCS_DIR}/public/presentation-pdfs"

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
      background: #64afac;
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

    .content > h1:first-child {{
      display: none;
    }}

    .content h2 {{
      font-size: 2rem;
      font-weight: 700;
      color: #2B4162;
      margin: 3rem 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    .content h3 {{
      font-size: 1.5rem;
      font-weight: 600;
      color: #2B4162;
      margin: 2rem 0 1rem 0;
    }}

    .content h4 {{
      font-size: 1.125rem;
      font-weight: 600;
      color: #2B4162;
      margin: 1.5rem 0 0.75rem 0;
    }}

    .content p {{
      margin: 1rem 0;
      color: #737A8C;
      line-height: 1.8;
      font-size: 1rem;
    }}

    .content ul {{
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }}

    .content li {{
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      color: #737A8C;
      font-size: 0.875rem;
    }}

    .content li:before {{
      content: "•";
      position: absolute;
      left: 0;
      color: #64afac;
      font-weight: bold;
      font-size: 1.2em;
    }}

    .content strong {{
      color: #2B4162;
      font-weight: 600;
    }}

    .content em {{
      font-style: italic;
      color: #5d89a9;
    }}

    .content code {{
      background: #f4f4ee;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Monaco', monospace;
      font-size: 0.9em;
      color: #2B4162;
    }}

    .content pre {{
      background: #f4f4ee;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
    }}

    .content pre code {{
      background: none;
      padding: 0;
    }}

    .content blockquote {{
      background: linear-gradient(135deg, #e8f4f3 0%, #f4f4ee 100%);
      border-left: 4px solid #64afac;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
    }}

    .content blockquote p {{
      margin: 0;
      color: #2B4162;
    }}

    .content table {{
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }}

    .content thead {{
      background: #2B4162;
      color: white;
    }}

    .content th {{
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }}

    .content td {{
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      color: #737A8C;
    }}

    .content tbody tr:hover {{
      background: #f4f4ee;
    }}

    .content a {{
      color: #64afac;
      text-decoration: none;
      font-weight: 500;
    }}

    .content a:hover {{
      text-decoration: underline;
    }}

    /* Grid Layouts for better space utilization */
    .content > h2 + p + h3,
    .content > h2 + h3 {{
      margin-top: 1.5rem;
    }}

    /* Make lists use columns when appropriate */
    .content ul {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 0.5rem 2rem;
    }}

    .content h3 + p + ul,
    .content h4 + ul {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 0.5rem 1.5rem;
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

    .footer p {{
      margin: 0.25rem 0;
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

      .content h2,
      .content h3 {{
        page-break-after: avoid;
      }}

      .content ul {{
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

      .content h2 {{
        font-size: 1.5rem;
      }}

      .content ul {{
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
      <p>hello@beaconeffect.com.au | www.beaconeffect.com.au</p>
      <p style="margin-top: 0.5rem;">© 2025 Beacon Effect. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
"""

def get_hero_content(title):
    """Generate hero title and subtitle based on document type"""
    hero_map = {
        "Beacon Wellbeing Survey Overview": ("Early Detection for Workplace Wellbeing", "A validated psychosocial pulse survey for proactive risk management"),
        "Beacon Platform Summary": ("Complete Wellbeing Platform", "From survey to insights—everything you need in one place"),
        "Beacon Client Proposal": ("Partner with Beacon", "Transform workplace wellbeing with evidence-based insights"),
        "Beacon Survey Questions": ("Survey Methodology", "Evidence-based questions designed for actionable insights"),
        "Google Slides Setup Guide": ("Presentation Resources", "Create compelling client presentations with Beacon branding"),
        "Beacon Dashboard & Insights Summary": ("Executive Intelligence Dashboard", "Transform data into action with real-time wellbeing insights"),
        "Beacon Email Templates": ("Communication Templates", "Ready-to-use email templates for client engagement"),
    }
    
    return hero_map.get(title, (title, "Beacon Wellbeing Platform"))

def convert_md_to_html(md_file, output_name, title):
    print(f"Converting {os.path.basename(md_file)} to {output_name}...")
    
    # Convert markdown to HTML using pandoc
    result = subprocess.run(
        ['pandoc', md_file, '-f', 'markdown', '-t', 'html'],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"❌ Error converting {md_file}: {result.stderr}")
        return
    
    html_content = result.stdout
    
    # Get hero content
    hero_title, hero_subtitle = get_hero_content(title)
    
    # Create full HTML with template
    full_html = HTML_TEMPLATE.format(
        title=title,
        hero_title=hero_title,
        hero_subtitle=hero_subtitle,
        content=html_content
    )
    
    # Write to file
    output_path = os.path.join(OUTPUT_DIR, output_name)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    print(f"✅ Created {output_name}")

# Main conversion
print("🎨 Converting Beacon documents to modern marketing style...")
print("")

files_to_convert = [
    ("WELLBEING_SURVEY_OVERVIEW.md", "Beacon-Survey-Overview.html", "Beacon Wellbeing Survey Overview"),
    ("BEACON_CLIENT_SUMMARY.md", "Beacon-Platform-Summary.html", "Beacon Platform Summary"),
    ("BEACON_CLIENT_PROPOSAL.md", "Beacon-Client-Proposal.html", "Beacon Client Proposal"),
    ("SURVEY_QUESTIONS.md", "Beacon-Survey-Questions.html", "Beacon Survey Questions"),
    ("GOOGLE_SLIDES_SETUP.md", "Beacon-Google-Slides-Setup.html", "Google Slides Setup Guide"),
    ("DASHBOARD_INSIGHTS_SUMMARY.md", "Beacon-Dashboard-Insights.html", "Beacon Dashboard & Insights Summary"),
]

for md_file, output_name, title in files_to_convert:
    md_path = os.path.join(DOCS_DIR, md_file)
    if os.path.exists(md_path):
        convert_md_to_html(md_path, output_name, title)
    else:
        print(f"⚠️  Skipping {md_file} (not found)")

# Check for EMAIL_TEMPLATES.md
email_templates = os.path.join(DOCS_DIR, "EMAIL_TEMPLATES.md")
if os.path.exists(email_templates):
    convert_md_to_html(email_templates, "Beacon-Email-Templates.html", "Beacon Email Templates")

print("")
print("✅ All documents converted to modern marketing style!")
print(f"📍 Location: {OUTPUT_DIR}")
print("")
print("View at:")
print("  http://localhost:3002/presentation-pdfs/Beacon-Survey-Overview.html")
print("  http://localhost:3002/presentation-pdfs/Beacon-Platform-Summary.html")
print("  http://localhost:3002/presentation-pdfs/Beacon-Client-Proposal.html")
print("  http://localhost:3002/presentation-pdfs/Beacon-Dashboard-Insights.html")
