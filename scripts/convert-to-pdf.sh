#!/bin/bash

# Beacon Document Converter
# Converts markdown documents to PDF format for client distribution

echo "🎯 Beacon Document Converter"
echo "================================"
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc is not installed!"
    echo ""
    echo "Please install pandoc first:"
    echo "  Mac:    brew install pandoc"
    echo "  Linux:  apt-get install pandoc"
    echo "  Windows: https://pandoc.org/installing.html"
    echo ""
    exit 1
fi

# Create output directory
OUTPUT_DIR="./presentation-pdfs"
mkdir -p "$OUTPUT_DIR"

echo "📁 Output directory: $OUTPUT_DIR"
echo ""

# Convert Client Proposal
echo "📄 Converting Client Proposal..."
pandoc BEACON_CLIENT_PROPOSAL.md \
  -o "$OUTPUT_DIR/Beacon-Client-Proposal.pdf" \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V colorlinks=true \
  -V linkcolor=blue \
  -V urlcolor=blue \
  -V toccolor=gray \
  --toc \
  --toc-depth=2 \
  -V mainfont="Inter" \
  -V fontsize=11pt

if [ $? -eq 0 ]; then
    echo "✅ Client Proposal converted successfully!"
else
    echo "⚠️  Client Proposal conversion failed (trying without custom font)..."
    pandoc BEACON_CLIENT_PROPOSAL.md \
      -o "$OUTPUT_DIR/Beacon-Client-Proposal.pdf" \
      --pdf-engine=xelatex \
      -V geometry:margin=1in \
      --toc \
      --toc-depth=2
fi

# Convert Email Templates
echo "📄 Converting Email Templates..."
pandoc EMAIL_TEMPLATES.md \
  -o "$OUTPUT_DIR/Beacon-Email-Templates.pdf" \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V colorlinks=true \
  --toc

if [ $? -eq 0 ]; then
    echo "✅ Email Templates converted successfully!"
fi

# Convert Client Summary
echo "📄 Converting Client Summary..."
pandoc BEACON_CLIENT_SUMMARY.md \
  -o "$OUTPUT_DIR/Beacon-Platform-Summary.pdf" \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V colorlinks=true \
  --toc \
  --toc-depth=2

if [ $? -eq 0 ]; then
    echo "✅ Platform Summary converted successfully!"
fi

# Convert Survey Questions
echo "📄 Converting Survey Questions..."
pandoc SURVEY_QUESTIONS.md \
  -o "$OUTPUT_DIR/Beacon-Survey-Questions.pdf" \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V colorlinks=true

if [ $? -eq 0 ]; then
    echo "✅ Survey Questions converted successfully!"
fi

# Convert Google Slides Setup Guide
echo "📄 Converting Google Slides Setup Guide..."
pandoc GOOGLE_SLIDES_SETUP.md \
  -o "$OUTPUT_DIR/Beacon-Google-Slides-Setup.pdf" \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V colorlinks=true

if [ $? -eq 0 ]; then
    echo "✅ Setup Guide converted successfully!"
fi

echo ""
echo "================================"
echo "✨ Conversion complete!"
echo ""
echo "📦 Your PDFs are ready in: $OUTPUT_DIR"
echo ""
echo "Files created:"
ls -lh "$OUTPUT_DIR"/*.pdf 2>/dev/null || echo "  (No PDFs found - check for errors above)"
echo ""
echo "💡 Tip: You can now upload these to Google Drive or attach to emails!"
echo ""

