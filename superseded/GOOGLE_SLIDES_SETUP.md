# Converting Beacon Documents to Google Slides

This guide shows you how to convert the Beacon markdown documents into professional Google Slides presentations.

---

## Option 1: Use Google Docs + Slides (Recommended)

### Step 1: Import to Google Docs
1. Go to [Google Docs](https://docs.google.com)
2. Click **File → Import**
3. Upload the markdown files:
   - `BEACON_CLIENT_PROPOSAL.md`
   - `EMAIL_TEMPLATES.md`
   - `BEACON_CLIENT_SUMMARY.md`
   - `SURVEY_QUESTIONS.md`

### Step 2: Format in Google Docs
1. Apply heading styles (Heading 1, 2, 3)
2. Add Beacon colors:
   - Teal: `#64afac` (for highlights)
   - Navy: `#2B4162` (for headings)
   - Slate: `#5d89a9` (for subheadings)
3. Insert logo/branding at the top

### Step 3: Convert to Slides
1. Open a new [Google Slides](https://slides.google.com) presentation
2. Choose a clean, professional template
3. Copy sections from Google Docs → paste into slides
4. One section per slide (use headings as slide titles)

---

## Option 2: Use Online Markdown to Slides Converters

### Recommended Tools:

#### 1. **Marp** (Best for technical presentations)
- Website: https://marp.app/
- Free, open-source
- Create slides directly from markdown

**Setup:**
```bash
# Install Marp CLI
npm install -g @marp-team/marp-cli

# Convert markdown to PowerPoint
marp BEACON_CLIENT_PROPOSAL.md --pptx -o Beacon-Proposal.pptx

# Convert to PDF
marp BEACON_CLIENT_PROPOSAL.md --pdf -o Beacon-Proposal.pdf
```

#### 2. **Slidev** (Interactive web-based slides)
- Website: https://sli.dev/
- Modern, developer-friendly
- Can export to PDF

#### 3. **Reveal.js** (HTML-based presentations)
- Website: https://revealjs.com/
- Web-based slides
- Can be embedded in your website

---

## Option 3: Manual Slide Creation Template

### Slide Structure for Client Proposal

**Slide 1: Title**
- Title: "Beacon: Psychosocial Wellbeing Platform"
- Subtitle: "Early Detection for Workplace Wellbeing"
- Logo: Beacon icon (health_and_safety Material Icon)
- Background: Gradient from navy to teal

**Slide 2: The Problem**
- Bullet points:
  - 1 in 5 employees experience work-related stress
  - Traditional surveys detect problems too late
  - Leaders lack real-time visibility
  - Compliance is increasingly complex

**Slide 3: The Solution**
- 5 key features with icons:
  - ✅ Weekly pulse surveys (60 seconds)
  - ✅ Real-time executive dashboards
  - ✅ Confidential, anonymous responses
  - ✅ Early warning system
  - ✅ Evidence-based methodology

**Slide 4: Why Beacon?**
- 3 columns:
  - Validated Framework
  - Real-Time Insights
  - Privacy First

**Slide 5: Key Features**
- Split into 3 sections:
  - For Employees
  - For Leaders
  - For HR Teams

**Slide 6: Pricing**
- 3 pricing tiers in cards:
  - Starter: $2,500/mo
  - Professional: $6,500/mo
  - Enterprise: Custom

**Slide 7: Implementation Timeline**
- 4-week visual timeline
- Week 1: Setup
- Week 2: Pilot
- Week 3: Rollout
- Week 4: Optimize

**Slide 8: ROI & Business Impact**
- Key metrics:
  - 10-15% reduction in turnover
  - 20-30% improvement in engagement
  - 25% faster issue identification
  - $3,500 savings per prevented resignation

**Slide 9: Case Study**
- Quote + stats from sample client
- Before/After comparison

**Slide 10: Security & Compliance**
- Icons with checkmarks:
  - Encrypted data
  - Australian data centres
  - ISO 27001 certified
  - Privacy Act compliant

**Slide 11: Getting Started**
- 3 steps:
  1. Book a demo
  2. Free 2-week trial
  3. Choose your plan & launch

**Slide 12: Contact**
- Email: hello@beaconwellbeing.com.au
- Phone: 1300 BEACON
- Website: www.beaconwellbeing.com.au
- CTA: "Start Your Free Trial"

---

## Beacon Brand Colors for Slides

```
Primary Colors:
- Navy: #2B4162 (headings, dark backgrounds)
- Teal: #64afac (CTAs, highlights, good status)
- Slate: #5d89a9 (subheadings, neutral elements)
- Coral: #ea9999 (warnings, attention items)

Background Colors:
- Light Teal: #f4f4ee
- Light Slate: #eeefec
- Light Coral: #f6f2ef
- White: #ffffff

Text Colors:
- Primary Text: #2E2E38
- Muted Text: #737A8C
```

---

## Fonts to Use

**Google Fonts (Free):**
- **Headings:** Inter Bold (700)
- **Body:** Inter Regular (400)
- **Subheadings:** Inter Medium (500)

**Download:** https://fonts.google.com/specimen/Inter

---

## Icons to Use

**Material Symbols (Weight 100):**

```
Core Icons:
- health_and_safety (Beacon logo)
- sentiment_satisfied (positive)
- work_history (workload)
- diversity_3 (teams)
- grade (valued)
- check_circle (confirmed)
- insights (analytics)
- security (privacy)
- trending_up (growth)
- download (downloads)
```

**Add to slides:**
1. Visit https://fonts.google.com/icons
2. Search for icon name
3. Download as SVG or PNG
4. Insert into slide

---

## Google Slides Templates (Pre-made)

### Where to Find Templates:
1. **Slides Carnival** - https://www.slidescarnival.com/
2. **Slide Hunter** - https://slidehunter.com/
3. **Google Slides Themes** - Built into Google Slides

### Recommended Templates for Beacon:
- **Professional/Corporate** style
- **Clean/Minimal** design
- **Navy or Teal** color scheme
- **Left-aligned** text layouts

---

## Creating a Shareable Google Slides Link

### Step 1: Upload to Google Drive
1. Go to [Google Drive](https://drive.google.com)
2. Create a folder called "Beacon Presentations"
3. Upload your slides

### Step 2: Set Sharing Permissions
1. Right-click on the file → **Share**
2. Change to "Anyone with the link can view"
3. Or: "Anyone with the link can make a copy"

### Step 3: Get Shareable Link
1. Click **Copy link**
2. The link will look like:
   ```
   https://docs.google.com/presentation/d/[ID]/edit
   ```

### Step 4: Make it a "Make a Copy" Link
Replace `/edit` with `/copy` at the end:
```
https://docs.google.com/presentation/d/[ID]/copy
```

This allows clients to automatically create their own copy!

---

## PDF Export Settings

### From Google Slides:
1. **File → Download → PDF Document**
2. Settings:
   - Include: All slides
   - Format: Letter or A4
   - Quality: High

### From Marp/Markdown:
```bash
marp document.md --pdf --allow-local-files -o output.pdf
```

### PDF Compression (if needed):
Use: https://www.ilovepdf.com/compress_pdf

---

## Quick Start Checklist

- [ ] Convert markdown files to Google Docs
- [ ] Format with Beacon colors and fonts
- [ ] Create Google Slides presentation from docs
- [ ] Add Material Icons as images
- [ ] Apply consistent styling to all slides
- [ ] Export as PDF for email attachments
- [ ] Create shareable Google Slides links
- [ ] Test downloads and copying functionality
- [ ] Add to presentation website at `/presentation`

---

## Automation Tools

### For Regular Updates:

**Pandoc** (Markdown → PowerPoint):
```bash
# Install pandoc
brew install pandoc  # Mac
# or: apt-get install pandoc  # Linux

# Convert to PowerPoint
pandoc BEACON_CLIENT_PROPOSAL.md -o Beacon-Proposal.pptx

# Convert to PDF
pandoc BEACON_CLIENT_PROPOSAL.md -o Beacon-Proposal.pdf --pdf-engine=xelatex
```

**Google Apps Script** (Auto-update slides from Google Docs):
- Can sync content automatically
- Requires some programming

---

## Support Resources

- **Google Slides Help:** https://support.google.com/docs/topic/19431
- **Markdown to Slides:** https://remarkjs.com/
- **Design Tips:** https://www.canva.com/learn/presentation-design/
- **Icon Resources:** https://fonts.google.com/icons

---

*Last Updated: October 2025*
*For Beacon Marketing Team*

