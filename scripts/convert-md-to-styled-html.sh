#!/bin/bash

# Convert all markdown files to styled HTML matching Beacon brand

DOCS_DIR="/Users/peta/Documents/Beacon/webapp/beacon"
OUTPUT_DIR="$DOCS_DIR/public/presentation-pdfs"

# Beacon color palette
TEAL="#64afac"
SLATE="#2B4162"
CORAL="#ea9999"
TEXT_SOFT="#737A8C"
BG_LIGHT="#f4f4ee"

# HTML template function
create_html() {
  local title="$1"
  local content="$2"
  local filename="$3"
  
  cat > "$OUTPUT_DIR/$filename" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TITLE_PLACEHOLDER</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100" rel="stylesheet">
  <style>
    :root {
      --teal: #64afac;
      --slate: #2B4162;
      --coral: #ea9999;
      --text-soft: #737A8C;
      --bg-light: #f4f4ee;
      --bg-slate: #eeefec;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.7;
      color: var(--slate);
      background: white;
      padding: 2rem;
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: 100;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      vertical-align: middle;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 3px solid var(--teal);
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-icon {
      font-size: 48px;
      color: var(--teal);
    }

    .logo-text h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--slate);
      margin-bottom: 0.25rem;
    }

    .logo-text p {
      font-size: 0.875rem;
      color: var(--text-soft);
    }

    .print-btn {
      background: var(--teal);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .print-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    /* Typography */
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--slate);
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--slate);
      margin-top: 3rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--teal);
    }

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--teal);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--slate);
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    p {
      margin-bottom: 1rem;
      color: var(--slate);
    }

    strong {
      font-weight: 600;
      color: var(--slate);
    }

    /* Lists */
    ul, ol {
      margin: 1rem 0 1.5rem 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
      color: var(--slate);
    }

    /* Cards */
    .card {
      background: white;
      border: 2px solid #cbd5e1;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .highlight {
      background: var(--bg-light);
      border-left: 4px solid var(--teal);
      padding: 1.5rem;
      margin: 1.5rem 0;
      border-radius: 8px;
    }

    .warning {
      background: #fff5f5;
      border-left: 4px solid var(--coral);
      padding: 1.5rem;
      margin: 1.5rem 0;
      border-radius: 8px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }

    th {
      background: var(--slate);
      color: white;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    tr:hover {
      background: var(--bg-light);
    }

    /* Code */
    code {
      background: var(--bg-light);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    pre {
      background: var(--bg-light);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    pre code {
      background: none;
      padding: 0;
    }

    /* Links */
    a {
      color: var(--teal);
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Print styles */
    @media print {
      body {
        padding: 0;
      }

      .print-btn {
        display: none;
      }

      .header {
        page-break-after: avoid;
      }

      h2, h3, h4 {
        page-break-after: avoid;
      }

      .card, .highlight, .warning {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <span class="material-symbols-outlined logo-icon">health_and_safety</span>
        <div class="logo-text">
          <h1>Beacon</h1>
          <p>Wellbeing Platform</p>
        </div>
      </div>
      <button class="print-btn" onclick="window.print()">
        <span class="material-symbols-outlined" style="font-size: 20px;">print</span>
        Print / Save PDF
      </button>
    </div>

    <!-- Content -->
    <div class="content">
CONTENT_PLACEHOLDER
    </div>

    <!-- Footer -->
    <div style="margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #e2e8f0; text-align: center; color: var(--text-soft); font-size: 0.875rem;">
      <p><strong>Beacon Wellbeing</strong></p>
      <p>hello@beaconwellbeing.com.au | 1300 BEACON (232 266)</p>
      <p style="margin-top: 1rem;">© 2025 Beacon Effect. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
HTMLEOF

  # Replace placeholders
  sed -i '' "s/TITLE_PLACEHOLDER/$title/g" "$OUTPUT_DIR/$filename"
  sed -i '' "s|CONTENT_PLACEHOLDER|$content|g" "$OUTPUT_DIR/$filename"
}

# Convert markdown to HTML content using pandoc
convert_md_file() {
  local md_file="$1"
  local output_name="$2"
  local title="$3"
  
  echo "Converting $md_file to $output_name..."
  
  # Convert markdown to HTML fragment
  html_content=$(pandoc "$md_file" -f markdown -t html)
  
  # Create full HTML with styling
  create_html "$title" "$html_content" "$output_name"
  
  echo "✅ Created $output_name"
}

# Convert each document
echo "🎨 Converting Beacon documents to styled HTML..."
echo ""

convert_md_file "$DOCS_DIR/WELLBEING_SURVEY_OVERVIEW.md" "Beacon-Survey-Overview.html" "Beacon Wellbeing Survey Overview"
convert_md_file "$DOCS_DIR/BEACON_CLIENT_SUMMARY.md" "Beacon-Platform-Summary.html" "Beacon Platform Summary"
convert_md_file "$DOCS_DIR/BEACON_CLIENT_PROPOSAL.md" "Beacon-Client-Proposal.html" "Beacon Client Proposal"
convert_md_file "$DOCS_DIR/SURVEY_QUESTIONS.md" "Beacon-Survey-Questions.html" "Beacon Survey Questions"
convert_md_file "$DOCS_DIR/GOOGLE_SLIDES_SETUP.md" "Beacon-Google-Slides-Setup.html" "Google Slides Setup Guide"

# Create email templates if it exists
if [ -f "$DOCS_DIR/EMAIL_TEMPLATES.md" ]; then
  convert_md_file "$DOCS_DIR/EMAIL_TEMPLATES.md" "Beacon-Email-Templates.html" "Beacon Email Templates"
fi

echo ""
echo "✅ All documents converted!"
echo "📍 Location: $OUTPUT_DIR"
echo ""
echo "View at:"
echo "  http://localhost:3002/presentation-pdfs/Beacon-Survey-Overview.html"
echo "  http://localhost:3002/presentation-pdfs/Beacon-Platform-Summary.html"
echo "  http://localhost:3002/presentation-pdfs/Beacon-Client-Proposal.html"
echo "  http://localhost:3002/presentation-pdfs/Beacon-Survey-Questions.html"





