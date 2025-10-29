#!/bin/bash

# Beacon Styled Reference Library Creator
# Creates a beautifully formatted HTML library with web page styling

echo "🎨 Creating Styled Beacon Reference Library..."

# Create output directory
mkdir -p reference-library

# Create custom CSS for Beacon branding
cat > reference-library/beacon-style.css << 'EOF'
/* Beacon Effect Reference Library Styles */

:root {
    --beacon-teal: #64afac;
    --beacon-slate: #5d89a9;
    --beacon-coral: #ea9999;
    --beacon-navy: #2B4162;
    --beacon-text: #2E2E38;
    --beacon-muted: #737A8C;
    --beacon-bg-good: #f4f4ee;
    --beacon-bg-okay: #eeefec;
    --beacon-bg-attn: #f6f2ef;
}

@page {
    size: A4;
    margin: 2cm;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--beacon-text);
    background: white;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Cover Page */
.cover-page {
    background: linear-gradient(135deg, var(--beacon-navy) 0%, var(--beacon-slate) 50%, var(--beacon-teal) 100%);
    color: white;
    padding: 100px 60px;
    text-align: center;
    border-radius: 15px;
    margin-bottom: 40px;
    page-break-after: always;
}

.cover-page h1 {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.cover-page .subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
    margin-bottom: 40px;
}

.cover-page .meta {
    font-size: 1rem;
    opacity: 0.8;
}

/* Section Headers */
.section-header {
    background: linear-gradient(135deg, var(--beacon-navy), var(--beacon-slate));
    color: white;
    padding: 40px;
    border-radius: 10px;
    margin: 60px 0 40px 0;
    page-break-before: always;
}

.section-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.section-header .description {
    font-size: 1.1rem;
    opacity: 0.9;
}

/* Document Headers */
.document-header {
    background: var(--beacon-bg-good);
    border-left: 5px solid var(--beacon-teal);
    padding: 20px 30px;
    margin: 40px 0 30px 0;
    border-radius: 5px;
    page-break-before: always;
}

.document-header h2 {
    color: var(--beacon-navy);
    font-size: 2rem;
    margin: 0 0 10px 0;
}

.document-header .doc-meta {
    color: var(--beacon-muted);
    font-size: 0.9rem;
}

/* Content Styling */
h1, h2, h3, h4, h5, h6 {
    color: var(--beacon-navy);
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; border-bottom: 3px solid var(--beacon-teal); padding-bottom: 10px; }
h2 { font-size: 2rem; border-bottom: 2px solid var(--beacon-slate); padding-bottom: 8px; }
h3 { font-size: 1.5rem; color: var(--beacon-slate); }
h4 { font-size: 1.25rem; }

/* Links */
a {
    color: var(--beacon-teal);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
}

a:hover {
    border-bottom-color: var(--beacon-teal);
}

/* Lists */
ul, ol {
    padding-left: 30px;
    margin: 15px 0;
}

li {
    margin: 8px 0;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

th {
    background: var(--beacon-navy);
    color: white;
    padding: 15px;
    text-align: left;
    font-weight: 600;
}

td {
    padding: 12px 15px;
    border-bottom: 1px solid #e5e7eb;
}

tr:hover {
    background: var(--beacon-bg-good);
}

/* Code Blocks */
code {
    background: var(--beacon-bg-okay);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    color: var(--beacon-navy);
}

pre {
    background: var(--beacon-bg-okay);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid var(--beacon-slate);
    overflow-x: auto;
    margin: 20px 0;
}

pre code {
    background: none;
    padding: 0;
}

/* Blockquotes */
blockquote {
    border-left: 4px solid var(--beacon-teal);
    padding: 15px 25px;
    margin: 20px 0;
    background: var(--beacon-bg-good);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: var(--beacon-text);
}

/* Alerts/Callouts */
.alert {
    padding: 20px 25px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 5px solid;
}

.alert-info {
    background: #e0f2fe;
    border-color: var(--beacon-slate);
    color: #0c4a6e;
}

.alert-warning {
    background: #fef3c7;
    border-color: #f59e0b;
    color: #78350f;
}

.alert-danger {
    background: #fee2e2;
    border-color: var(--beacon-coral);
    color: #7f1d1d;
}

.alert-success {
    background: #d1fae5;
    border-color: var(--beacon-teal);
    color: #064e3b;
}

/* Badges */
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0 5px 5px 0;
}

.badge-client {
    background: var(--beacon-teal);
    color: white;
}

.badge-internal {
    background: var(--beacon-coral);
    color: white;
}

.badge-reference {
    background: var(--beacon-slate);
    color: white;
}

/* Table of Contents */
#TOC {
    background: var(--beacon-bg-good);
    padding: 30px;
    border-radius: 10px;
    border: 2px solid var(--beacon-teal);
    margin: 40px 0;
    page-break-after: always;
}

#TOC h1 {
    color: var(--beacon-navy);
    border: none;
    margin-top: 0;
}

#TOC ul {
    list-style: none;
    padding-left: 0;
}

#TOC li {
    margin: 10px 0;
}

#TOC a {
    color: var(--beacon-slate);
    font-weight: 500;
}

/* Print Styles */
@media print {
    body {
        max-width: 100%;
        padding: 0;
    }
    
    .cover-page, .section-header, .document-header {
        page-break-after: always;
    }
    
    h1, h2, h3 {
        page-break-after: avoid;
    }
    
    table, figure, img {
        page-break-inside: avoid;
    }
    
    a {
        color: var(--beacon-teal);
        text-decoration: none;
    }
    
    /* Show URLs for external links */
    a[href^="http"]:after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
        color: var(--beacon-muted);
    }
}

/* Footer */
.page-footer {
    margin-top: 60px;
    padding-top: 30px;
    border-top: 2px solid var(--beacon-teal);
    text-align: center;
    color: var(--beacon-muted);
    font-size: 0.9rem;
}
EOF

# Create the master HTML file
cat > reference-library/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beacon Effect Reference Library</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="beacon-style.css">
</head>
<body>
    <!-- Cover Page -->
    <div class="cover-page">
        <h1>📚 Beacon Effect</h1>
        <div class="subtitle">Complete Reference Library</div>
        <div class="meta">
            <p><strong>Confidential & Proprietary</strong></p>
            <p>Internal Use Only</p>
            <p>Version 1.0 | October 2025</p>
        </div>
    </div>

    <!-- Table of Contents -->
    <div id="TOC">
        <h1>📋 Table of Contents</h1>
        <ul>
            <li><strong>Part 1: Client-Facing Materials</strong>
                <ul>
                    <li><a href="#doc-1">1. Wellbeing Survey Overview</a> <span class="badge badge-client">CLIENT-SAFE</span></li>
                    <li><a href="#doc-2">2. Platform Summary</a> <span class="badge badge-client">CLIENT-SAFE</span></li>
                    <li><a href="#doc-3">3. Client Proposal Template</a> <span class="badge badge-client">CLIENT-SAFE</span></li>
                    <li><a href="#doc-4">4. Email Templates</a> <span class="badge badge-client">CLIENT-SAFE</span></li>
                    <li><a href="#doc-5">5. Google Slides Setup</a> <span class="badge badge-client">CLIENT-SAFE</span></li>
                </ul>
            </li>
            <li><strong>Part 2: Internal Documentation</strong>
                <ul>
                    <li><a href="#doc-6">6. Survey Questions & Logic</a> <span class="badge badge-internal">INTERNAL</span></li>
                    <li><a href="#doc-7">7. IP Protection Guide</a> <span class="badge badge-internal">INTERNAL</span></li>
                    <li><a href="#doc-8">8. Cleanup Checklist</a> <span class="badge badge-internal">INTERNAL</span></li>
                </ul>
            </li>
            <li><strong>Part 3: Reference & Setup</strong>
                <ul>
                    <li><a href="#doc-9">9. Quick Start Guide</a> <span class="badge badge-reference">REFERENCE</span></li>
                    <li><a href="#doc-10">10. How to Use Documents</a> <span class="badge badge-reference">REFERENCE</span></li>
                    <li><a href="#doc-11">11. Website Structure</a> <span class="badge badge-reference">REFERENCE</span></li>
                    <li><a href="#doc-12">12. Website Complete</a> <span class="badge badge-reference">REFERENCE</span></li>
                </ul>
            </li>
        </ul>
    </div>

    <!-- Part 1: Client-Facing -->
    <div class="section-header">
        <h1>Part 1: Client-Facing Materials</h1>
        <div class="description">Safe to share with prospects and clients - No IP disclosure</div>
    </div>

    <div id="doc-1" class="document-header">
        <span class="badge badge-client">CLIENT-SAFE</span>
        <h2>1. Wellbeing Survey Overview</h2>
        <div class="doc-meta">Client-facing overview without IP disclosure</div>
    </div>
    <div id="doc-1-content"></div>

    <div id="doc-2" class="document-header">
        <span class="badge badge-client">CLIENT-SAFE</span>
        <h2>2. Platform Summary</h2>
        <div class="doc-meta">Comprehensive platform overview</div>
    </div>
    <div id="doc-2-content"></div>

    <div id="doc-3" class="document-header">
        <span class="badge badge-client">CLIENT-SAFE</span>
        <h2>3. Client Proposal Template</h2>
        <div class="doc-meta">Template for customized proposals</div>
    </div>
    <div id="doc-3-content"></div>

    <div id="doc-4" class="document-header">
        <span class="badge badge-client">CLIENT-SAFE</span>
        <h2>4. Email Templates</h2>
        <div class="doc-meta">Collection of email templates</div>
    </div>
    <div id="doc-4-content"></div>

    <div id="doc-5" class="document-header">
        <span class="badge badge-client">CLIENT-SAFE</span>
        <h2>5. Google Slides Setup Guide</h2>
        <div class="doc-meta">Presentation materials instructions</div>
    </div>
    <div id="doc-5-content"></div>

    <!-- Part 2: Internal -->
    <div class="section-header">
        <h1>Part 2: Internal Documentation</h1>
        <div class="description">Confidential - Contains IP and sensitive information</div>
    </div>

    <div id="doc-6" class="document-header">
        <span class="badge badge-internal">INTERNAL ONLY</span>
        <h2>6. Survey Questions & Logic</h2>
        <div class="doc-meta">⚠️ TRADE SECRET - Do not share externally</div>
    </div>
    <div id="doc-6-content"></div>

    <div id="doc-7" class="document-header">
        <span class="badge badge-internal">INTERNAL ONLY</span>
        <h2>7. IP Protection Guide</h2>
        <div class="doc-meta">How to protect intellectual property</div>
    </div>
    <div id="doc-7-content"></div>

    <div id="doc-8" class="document-header">
        <span class="badge badge-internal">INTERNAL ONLY</span>
        <h2>8. Website Cleanup Checklist</h2>
        <div class="doc-meta">To-do list for improvements</div>
    </div>
    <div id="doc-8-content"></div>

    <!-- Part 3: Reference -->
    <div class="section-header">
        <h1>Part 3: Reference & Setup Guides</h1>
        <div class="description">Setup guides and reference materials</div>
    </div>

    <div id="doc-9" class="document-header">
        <span class="badge badge-reference">REFERENCE</span>
        <h2>9. Quick Start Guide</h2>
        <div class="doc-meta">How to use the website</div>
    </div>
    <div id="doc-9-content"></div>

    <div id="doc-10" class="document-header">
        <span class="badge badge-reference">REFERENCE</span>
        <h2>10. How to Use Documents</h2>
        <div class="doc-meta">Guide to .md files and PDFs</div>
    </div>
    <div id="doc-10-content"></div>

    <div id="doc-11" class="document-header">
        <span class="badge badge-reference">REFERENCE</span>
        <h2>11. Website Structure</h2>
        <div class="doc-meta">Navigation and organization</div>
    </div>
    <div id="doc-11-content"></div>

    <div id="doc-12" class="document-header">
        <span class="badge badge-reference">REFERENCE</span>
        <h2>12. Website Complete Guide</h2>
        <div class="doc-meta">Complete documentation</div>
    </div>
    <div id="doc-12-content"></div>

    <!-- Footer -->
    <div class="page-footer">
        <p><strong>© 2025 Beacon Effect. All rights reserved.</strong></p>
        <p>Confidential & Proprietary | Internal Use Only</p>
        <p>For questions or updates, contact: hello@beaconeffect.com.au</p>
    </div>

    <script>
        // Load each document's content
        const docs = [
            { id: 1, file: 'WELLBEING_SURVEY_OVERVIEW.html' },
            { id: 2, file: 'BEACON_CLIENT_SUMMARY.html' },
            { id: 3, file: 'BEACON_CLIENT_PROPOSAL.html' },
            { id: 4, file: 'EMAIL_TEMPLATES.html' },
            { id: 5, file: 'GOOGLE_SLIDES_SETUP.html' },
            { id: 6, file: 'SURVEY_QUESTIONS.html' },
            { id: 7, file: 'IP_PROTECTION_GUIDE.html' },
            { id: 8, file: 'CLEANUP_CHECKLIST.html' },
            { id: 9, file: 'QUICK_START.html' },
            { id: 10, file: 'HOW_TO_USE_DOCUMENTS.html' },
            { id: 11, file: 'BEACON_EFFECT_STRUCTURE.html' },
            { id: 12, file: 'WEBSITE_COMPLETE.html' }
        ];

        docs.forEach(doc => {
            fetch(`../docs-preview/content/${doc.file}`)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(html, 'text/html');
                    const content = htmlDoc.querySelector('body').innerHTML;
                    document.getElementById(`doc-${doc.id}-content`).innerHTML = content;
                })
                .catch(err => {
                    document.getElementById(`doc-${doc.id}-content`).innerHTML = 
                        `<p class="alert alert-warning">⚠️ Document not found. Please run the conversion script first.</p>`;
                });
        });
    </script>
</body>
</html>
EOF

echo "✅ Styled reference library created!"
echo ""
echo "📂 Location: reference-library/"
echo "🌐 Open: reference-library/index.html"
echo ""
echo "Features:"
echo "  ✨ Beautiful Beacon branding and colors"
echo "  📑 Professional layout with section dividers"
echo "  🎨 Styled tables, code blocks, and callouts"
echo "  🖨️  Print-optimized with page breaks"
echo "  📱 Responsive design"
echo ""
echo "To view:"
echo "  open reference-library/index.html"
echo ""
echo "To print to PDF:"
echo "  1. Open in browser"
echo "  2. Press Cmd+P"
echo "  3. Select 'Save as PDF'"
echo "  4. Done!"
echo ""





