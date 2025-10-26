#!/bin/bash

# Create a single-file print-ready reference library

echo "📚 Creating print-ready reference library..."

# Create a combined markdown file with page breaks
cat > temp-combined.md << 'EOF'
---
title: "Beacon Effect Reference Library"
subtitle: "Complete Documentation - Internal Use Only"
author: "Confidential & Proprietary"
date: "October 2025"
---

\newpage

# 📚 Beacon Effect Reference Library

**Confidential & Proprietary | Internal Use Only**

This reference library contains complete documentation for Beacon Effect.

**Version:** 1.0  
**Last Updated:** October 2025  
**Contact:** hello@beaconeffect.com.au

---

\newpage

EOF

# Add section headers and documents with page breaks
echo "  Adding Part 1: Client-Facing Materials..."
cat >> temp-combined.md << 'EOF'
# PART 1: CLIENT-FACING MATERIALS

**Safe to Share with Prospects & Clients**

---

\newpage

EOF

cat WELLBEING_SURVEY_OVERVIEW.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat BEACON_CLIENT_SUMMARY.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat BEACON_CLIENT_PROPOSAL.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat EMAIL_TEMPLATES.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat GOOGLE_SLIDES_SETUP.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

echo "  Adding Part 2: Internal Documentation..."
cat >> temp-combined.md << 'EOF'

# PART 2: INTERNAL DOCUMENTATION

**Confidential - Internal Use Only**

Contains trade secrets and intellectual property.

---

\newpage

EOF

cat SURVEY_QUESTIONS.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat IP_PROTECTION_GUIDE.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat CLEANUP_CHECKLIST.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

echo "  Adding Part 3: Reference & Setup..."
cat >> temp-combined.md << 'EOF'

# PART 3: REFERENCE & SETUP GUIDES

**Internal Reference Materials**

---

\newpage

EOF

cat QUICK_START.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat HOW_TO_USE_DOCUMENTS.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat BEACON_EFFECT_STRUCTURE.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

cat WEBSITE_COMPLETE.md >> temp-combined.md
echo -e "\n\n\\newpage\n\n" >> temp-combined.md

# Add footer
cat >> temp-combined.md << 'EOF'

---

**© 2025 Beacon Effect. All rights reserved.**

Confidential & Proprietary | Internal Use Only

For questions: hello@beaconeffect.com.au

EOF

# Convert to HTML with custom styling
echo "  Converting to HTML..."
pandoc temp-combined.md -o Beacon-Reference-Library-Print.html \
    --standalone \
    --toc \
    --toc-depth=2 \
    --metadata title="Beacon Effect Reference Library" \
    --css=https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css \
    --include-in-header=<(cat << 'STYLE'
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    :root {
        --beacon-teal: #64afac;
        --beacon-slate: #5d89a9;
        --beacon-coral: #ea9999;
        --beacon-navy: #2B4162;
        --beacon-text: #2E2E38;
        --beacon-muted: #737A8C;
    }
    
    @page {
        size: A4;
        margin: 2.5cm;
    }
    
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: var(--beacon-text);
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
    }
    
    h1 {
        color: var(--beacon-navy);
        border-bottom: 3px solid var(--beacon-teal);
        padding-bottom: 10px;
        page-break-after: avoid;
    }
    
    h2 {
        color: var(--beacon-slate);
        border-bottom: 2px solid var(--beacon-slate);
        padding-bottom: 8px;
        margin-top: 2em;
        page-break-after: avoid;
    }
    
    h3 {
        color: var(--beacon-navy);
        margin-top: 1.5em;
    }
    
    a {
        color: var(--beacon-teal);
        text-decoration: none;
    }
    
    code {
        background: #f4f4ee;
        padding: 2px 6px;
        border-radius: 3px;
        color: var(--beacon-navy);
    }
    
    pre {
        background: #eeefec;
        padding: 15px;
        border-radius: 5px;
        border-left: 4px solid var(--beacon-slate);
        overflow-x: auto;
        page-break-inside: avoid;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        page-break-inside: avoid;
    }
    
    th {
        background: var(--beacon-navy);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    td {
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    blockquote {
        border-left: 4px solid var(--beacon-teal);
        padding: 10px 20px;
        margin: 20px 0;
        background: #f4f4ee;
        page-break-inside: avoid;
    }
    
    #TOC {
        background: #f4f4ee;
        padding: 20px;
        border-radius: 8px;
        border: 2px solid var(--beacon-teal);
        margin: 30px 0;
        page-break-after: always;
    }
    
    #TOC h1 {
        border: none;
        margin-top: 0;
    }
    
    @media print {
        body {
            max-width: 100%;
        }
        
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
        }
        
        table, figure, pre {
            page-break-inside: avoid;
        }
        
        a[href^="http"]:after {
            content: " (" attr(href) ")";
            font-size: 0.8em;
            color: var(--beacon-muted);
        }
    }
</style>
STYLE
)

# Cleanup
rm temp-combined.md

echo ""
echo "✅ Print-ready reference library created!"
echo ""
echo "📄 File: Beacon-Reference-Library-Print.html"
echo "📊 Contains: 12 documents in one file"
echo ""
echo "To print:"
echo "  1. open Beacon-Reference-Library-Print.html"
echo "  2. Press Cmd+P"
echo "  3. Select 'Save as PDF'"
echo "  4. Done!"
echo ""
echo "Features:"
echo "  ✅ All content in ONE file"
echo "  ✅ Automatic page breaks"
echo "  ✅ Table of contents"
echo "  ✅ Beacon styling"
echo "  ✅ Print-optimized"
echo ""



