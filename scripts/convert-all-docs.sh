#!/bin/bash

# Beacon Documentation Converter
# Converts all .md files to HTML and creates a preview site

echo "🚀 Converting all Beacon documentation to HTML..."

# Create output directories
mkdir -p docs-preview
mkdir -p docs-preview/content

# Array to store converted files
declare -a files=()

# Convert all .md files in root directory
for file in *.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .md)
        echo "  Converting: $file"
        pandoc "$file" -o "docs-preview/content/${filename}.html" \
            --standalone \
            --toc \
            --css=https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css \
            --metadata title="$filename"
        
        files+=("$filename")
    fi
done

# Create index page
cat > docs-preview/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beacon Documentation Preview</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #2B4162 0%, #5d89a9 50%, #64afac 100%);
            min-height: 100vh;
            padding: 40px 0;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .doc-card {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s;
            background: #f9fafb;
        }
        .doc-card:hover {
            border-color: #64afac;
            box-shadow: 0 4px 12px rgba(100, 175, 172, 0.2);
            transform: translateY(-2px);
        }
        .doc-card h3 {
            color: #2B4162;
            font-size: 1.3rem;
            margin-bottom: 10px;
        }
        .doc-card .badge {
            font-size: 0.75rem;
            padding: 5px 10px;
        }
        .badge-client {
            background-color: #64afac;
        }
        .badge-internal {
            background-color: #ea9999;
        }
        .badge-reference {
            background-color: #5d89a9;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #2B4162;
            font-weight: bold;
        }
        .category-section {
            margin-bottom: 40px;
        }
        .category-title {
            color: #2B4162;
            border-bottom: 3px solid #64afac;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Beacon Documentation Preview</h1>
            <p class="text-muted">Review all documentation and decide what goes on the website</p>
        </div>

        <!-- Instructions -->
        <div class="alert alert-info">
            <h5>📋 Instructions:</h5>
            <ol class="mb-0">
                <li>Review each document by clicking the links below</li>
                <li>Note which documents should be on the public website</li>
                <li>Decide on categorization and navigation structure</li>
                <li>Tell me which to include and where they should go</li>
            </ol>
        </div>

        <!-- Client-Facing Documents -->
        <div class="category-section">
            <h2 class="category-title">Client-Facing Documents</h2>
            <p class="text-muted">Safe to share with prospects and clients</p>
            
            <div class="doc-card">
                <span class="badge badge-client">CLIENT-SAFE</span>
                <h3><a href="content/WELLBEING_SURVEY_OVERVIEW.html">Wellbeing Survey Overview</a></h3>
                <p class="text-muted mb-0">Client-facing overview without IP disclosure. Use for sales and proposals.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-client">CLIENT-SAFE</span>
                <h3><a href="content/BEACON_CLIENT_SUMMARY.html">Beacon Platform Summary</a></h3>
                <p class="text-muted mb-0">Comprehensive platform overview for technical discussions.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-client">CLIENT-SAFE</span>
                <h3><a href="content/BEACON_CLIENT_PROPOSAL.html">Client Proposal Template</a></h3>
                <p class="text-muted mb-0">Template for creating customized client proposals.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-client">CLIENT-SAFE</span>
                <h3><a href="content/EMAIL_TEMPLATES.html">Email Templates</a></h3>
                <p class="text-muted mb-0">Collection of email templates for client communication.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-client">CLIENT-SAFE</span>
                <h3><a href="content/GOOGLE_SLIDES_SETUP.html">Google Slides Setup Guide</a></h3>
                <p class="text-muted mb-0">Instructions for creating presentation materials.</p>
            </div>
        </div>

        <!-- Internal Documents -->
        <div class="category-section">
            <h2 class="category-title">Internal Documents</h2>
            <p class="text-muted">For your use only - contains IP and sensitive information</p>
            
            <div class="doc-card">
                <span class="badge badge-internal">INTERNAL ONLY</span>
                <h3><a href="content/SURVEY_QUESTIONS.html">Survey Questions & Logic</a></h3>
                <p class="text-muted mb-0">Detailed survey questions and branching logic - TRADE SECRET.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-internal">INTERNAL ONLY</span>
                <h3><a href="content/IP_PROTECTION_GUIDE.html">IP Protection Guide</a></h3>
                <p class="text-muted mb-0">How to protect your intellectual property.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-internal">INTERNAL ONLY</span>
                <h3><a href="content/CLEANUP_CHECKLIST.html">Website Cleanup Checklist</a></h3>
                <p class="text-muted mb-0">To-do list for website polish and improvements.</p>
            </div>
        </div>

        <!-- Reference Documents -->
        <div class="category-section">
            <h2 class="category-title">Reference & Setup</h2>
            <p class="text-muted">Setup guides and reference materials</p>
            
            <div class="doc-card">
                <span class="badge badge-reference">REFERENCE</span>
                <h3><a href="content/QUICK_START.html">Quick Start Guide</a></h3>
                <p class="text-muted mb-0">How to use the website and access documents.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-reference">REFERENCE</span>
                <h3><a href="content/HOW_TO_USE_DOCUMENTS.html">How to Use Documents</a></h3>
                <p class="text-muted mb-0">Guide to using .md files and converting to PDF.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-reference">REFERENCE</span>
                <h3><a href="content/WEBSITE_COMPLETE.html">Website Complete Guide</a></h3>
                <p class="text-muted mb-0">Complete documentation of what was built.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-reference">REFERENCE</span>
                <h3><a href="content/BEACON_EFFECT_STRUCTURE.html">Beacon Effect Structure</a></h3>
                <p class="text-muted mb-0">Website structure and navigation guide.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-reference">REFERENCE</span>
                <h3><a href="content/PRESENTATION_SETUP_README.html">Presentation Setup README</a></h3>
                <p class="text-muted mb-0">How to set up presentation materials.</p>
            </div>

            <div class="doc-card">
                <span class="badge badge-reference">REFERENCE</span>
                <h3><a href="content/PUBLIC_WEBSITE_PLAN.html">Public Website Plan</a></h3>
                <p class="text-muted mb-0">Original plan for public website pages.</p>
            </div>
        </div>

        <!-- Decision Matrix -->
        <div class="alert alert-warning mt-5">
            <h5>🤔 Questions to Answer:</h5>
            <ul class="mb-0">
                <li>Which client-facing documents should be on the public website?</li>
                <li>Should they be under /wellbeing or /resources or /about?</li>
                <li>Do you want a /resources page with all downloadable materials?</li>
                <li>Should methodology be more detailed or keep it simple?</li>
                <li>Do you want case studies or testimonials pages?</li>
            </ul>
        </div>

        <div class="text-center mt-4">
            <a href="../" class="btn btn-primary btn-lg">← Back to Main Website</a>
        </div>
    </div>
</body>
</html>
EOF

echo ""
echo "✅ Documentation preview site created!"
echo ""
echo "📂 Location: docs-preview/"
echo "🌐 Open: docs-preview/index.html in your browser"
echo ""
echo "Converted ${#files[@]} documents:"
for f in "${files[@]}"; do
    echo "  - $f"
done
echo ""
echo "To view: open docs-preview/index.html"





