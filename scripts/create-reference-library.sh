#!/bin/bash

# Beacon Reference Library Creator
# Creates a comprehensive PDF containing all reference documents

echo "📚 Creating Beacon Reference Library PDF..."

# Create temp directory
mkdir -p temp-pdf-build

# Define document order and categories
cat > temp-pdf-build/00-cover.md << 'EOF'
---
title: "Beacon Effect Reference Library"
author: "Internal Use Only"
date: "October 2025"
---

\newpage

# Beacon Effect Reference Library

**Confidential & Proprietary**

This reference library contains all documentation for Beacon Effect, including:

- Client-facing materials (safe to share)
- Internal documentation (confidential)
- Setup and reference guides
- IP protection guidelines

**Document Status:** Internal Use Only  
**Last Updated:** October 2025  
**Version:** 1.0

---

## Table of Contents

### Part 1: Client-Facing Materials
1. Wellbeing Survey Overview (Client-Safe)
2. Platform Summary
3. Client Proposal Template
4. Email Templates
5. Google Slides Setup Guide

### Part 2: Internal Documentation
6. Survey Questions & Logic (Trade Secret)
7. IP Protection Guide
8. Cleanup Checklist

### Part 3: Reference & Setup
9. Quick Start Guide
10. How to Use Documents
11. Website Structure
12. Website Complete Guide

---

\newpage
EOF

# Create section dividers
cat > temp-pdf-build/section-1.md << 'EOF'
\newpage

---

# PART 1: CLIENT-FACING MATERIALS

**Safe to Share with Prospects & Clients**

These documents are designed to be shared externally without disclosing intellectual property or sensitive information.

---

\newpage
EOF

cat > temp-pdf-build/section-2.md << 'EOF'
\newpage

---

# PART 2: INTERNAL DOCUMENTATION

**Confidential - Internal Use Only**

These documents contain trade secrets, intellectual property, and sensitive business information. Do not share externally without proper NDA.

---

\newpage
EOF

cat > temp-pdf-build/section-3.md << 'EOF'
\newpage

---

# PART 3: REFERENCE & SETUP GUIDES

**Internal Reference Materials**

Setup guides, website documentation, and reference materials for managing Beacon Effect.

---

\newpage
EOF

# Copy and prepare documents in order
echo "  Preparing documents..."

# Part 1: Client-Facing
cp WELLBEING_SURVEY_OVERVIEW.md temp-pdf-build/01-survey-overview.md
cp BEACON_CLIENT_SUMMARY.md temp-pdf-build/02-platform-summary.md
cp BEACON_CLIENT_PROPOSAL.md temp-pdf-build/03-client-proposal.md
cp EMAIL_TEMPLATES.md temp-pdf-build/04-email-templates.md
cp GOOGLE_SLIDES_SETUP.md temp-pdf-build/05-google-slides.md

# Part 2: Internal
cp SURVEY_QUESTIONS.md temp-pdf-build/06-survey-questions.md
cp IP_PROTECTION_GUIDE.md temp-pdf-build/07-ip-protection.md
cp CLEANUP_CHECKLIST.md temp-pdf-build/08-cleanup-checklist.md

# Part 3: Reference
cp QUICK_START.md temp-pdf-build/09-quick-start.md
cp HOW_TO_USE_DOCUMENTS.md temp-pdf-build/10-how-to-use.md
cp BEACON_EFFECT_STRUCTURE.md temp-pdf-build/11-website-structure.md
cp WEBSITE_COMPLETE.md temp-pdf-build/12-website-complete.md

# Add page breaks between documents
for file in temp-pdf-build/*.md; do
    echo -e "\n\n\\newpage\n\n" >> "$file"
done

# Combine all documents
echo "  Combining documents..."
cat temp-pdf-build/00-cover.md \
    temp-pdf-build/section-1.md \
    temp-pdf-build/01-survey-overview.md \
    temp-pdf-build/02-platform-summary.md \
    temp-pdf-build/03-client-proposal.md \
    temp-pdf-build/04-email-templates.md \
    temp-pdf-build/05-google-slides.md \
    temp-pdf-build/section-2.md \
    temp-pdf-build/06-survey-questions.md \
    temp-pdf-build/07-ip-protection.md \
    temp-pdf-build/08-cleanup-checklist.md \
    temp-pdf-build/section-3.md \
    temp-pdf-build/09-quick-start.md \
    temp-pdf-build/10-how-to-use.md \
    temp-pdf-build/11-website-structure.md \
    temp-pdf-build/12-website-complete.md \
    > temp-pdf-build/COMPLETE-LIBRARY.md

# Create HTML version (always works)
echo "  Converting to HTML..."
pandoc temp-pdf-build/COMPLETE-LIBRARY.md \
    -o "Beacon-Reference-Library.html" \
    --standalone \
    --toc \
    --toc-depth=2 \
    --css=https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css \
    --metadata title="Beacon Effect Reference Library" \
    --metadata author="Internal Use Only"

echo "✅ HTML version created!"
echo ""
echo "📄 Location: Beacon-Reference-Library.html"
echo "🖨️  To create PDF: Open in browser → Cmd+P → Save as PDF"
echo ""

# Cleanup
echo "  Cleaning up temporary files..."
rm -rf temp-pdf-build

echo "✅ Reference library created!"
echo ""
echo "📚 Your complete reference library is ready!"
echo ""
echo "Contents:"
echo "  • 12 documents organized by category"
echo "  • Table of contents with page numbers"
echo "  • Section dividers for easy navigation"
echo "  • Print-ready format"
echo ""
echo "To print:"
echo "  1. Open the PDF/HTML file"
echo "  2. Print double-sided for best results"
echo "  3. Use a binder or folder for organization"
echo ""

