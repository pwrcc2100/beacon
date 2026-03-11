# Beacon Presentation Materials - Setup Guide

## 🎯 What's Been Created

You now have a complete presentation and marketing package for Beacon, including:

### 📄 Documents Created:
1. **BEACON_CLIENT_PROPOSAL.md** - Complete client proposal with pricing
2. **EMAIL_TEMPLATES.md** - 13 ready-to-use email templates
3. **BEACON_CLIENT_SUMMARY.md** - Technical platform overview
4. **SURVEY_QUESTIONS.md** - All survey questions and workflows
5. **GOOGLE_SLIDES_SETUP.md** - Guide to convert documents to slides

### 🌐 Website Created:
- **Presentation Page** at `/presentation` - Beautiful landing page for clients
- Features all documents with download buttons
- Professional design using Beacon colors
- Mobile responsive

### 🛠️ Tools Created:
- **PDF Conversion Script** - Automatically converts markdown to PDF
- Located at: `scripts/convert-to-pdf.sh`

---

## 🚀 Quick Start Guide

### Step 1: View the Presentation Website

1. Make sure your local dev server is running:
   ```bash
   cd /Users/peta/Documents/Beacon/webapp/beacon
   npm run dev
   ```

2. Open your browser to:
   ```
   http://localhost:3000/presentation
   ```

3. You'll see a beautiful landing page with:
   - Hero section with Beacon branding
   - Stats showcase (60s surveys, 5 dimensions, etc.)
   - All 4 documents available for download
   - Features section
   - Call-to-action buttons

### Step 2: Convert Documents to PDF

#### Option A: Using the Script (Recommended)

1. Install Pandoc (if not already installed):
   ```bash
   # On Mac:
   brew install pandoc
   
   # On Linux:
   sudo apt-get install pandoc
   ```

2. Run the conversion script:
   ```bash
   cd /Users/peta/Documents/Beacon/webapp/beacon
   ./scripts/convert-to-pdf.sh
   ```

3. Your PDFs will be in:
   ```
   /Users/peta/Documents/Beacon/webapp/beacon/presentation-pdfs/
   ```

#### Option B: Manual Conversion

Use any markdown to PDF converter:
- **Online:** https://www.markdowntopdf.com/
- **VS Code Extension:** "Markdown PDF"
- **macOS:** Open in Typora and export to PDF

### Step 3: Upload to Google Slides

Follow the guide in `GOOGLE_SLIDES_SETUP.md`:

1. Upload markdown files to Google Docs
2. Format with Beacon colors and fonts
3. Copy sections into Google Slides
4. Use the pre-defined slide structure
5. Export as PDF or share as "Make a Copy" links

---

## 📂 File Locations

```
/Users/peta/Documents/Beacon/webapp/beacon/
├── BEACON_CLIENT_PROPOSAL.md      ← Main proposal document
├── EMAIL_TEMPLATES.md              ← All email templates
├── BEACON_CLIENT_SUMMARY.md        ← Technical summary
├── SURVEY_QUESTIONS.md             ← Survey details
├── GOOGLE_SLIDES_SETUP.md          ← How-to guide
├── PRESENTATION_SETUP_README.md    ← This file
├── scripts/
│   └── convert-to-pdf.sh           ← Conversion script
├── presentation-pdfs/              ← Generated PDFs (after running script)
└── src/
    └── app/
        ├── page.tsx                ← Updated homepage
        └── presentation/
            └── page.tsx            ← Presentation landing page
```

---

## 🎨 Customization

### Update Branding

Edit `/src/app/presentation/page.tsx`:

```typescript
// Change colors
style={{ backgroundColor: '#64afac' }}  // Teal
style={{ backgroundColor: '#2B4162' }}  // Navy

// Change text
<h1>Your Company Name</h1>
<p>Your tagline</p>

// Change contact info
<a href="mailto:your@email.com">Contact Us</a>
```

### Add Your Logo

1. Place logo image in `/public/logo.png`
2. Update the presentation page:
   ```typescript
   <Image src="/logo.png" alt="Logo" width={150} height={50} />
   ```

### Update Pricing

Edit `BEACON_CLIENT_PROPOSAL.md`:
- Search for "## Pricing"
- Update prices and features
- Re-run the PDF conversion script

---

## 📧 Email Outreach Usage

The `EMAIL_TEMPLATES.md` file contains 13 templates for:

### Sales & Marketing:
1. **Cold Outreach** - Initial contact with prospects
2. **Follow-Up** - 7-day follow-up sequence
3. **Demo Follow-Up** - After demo calls
4. **Trial Activation** - Welcome new trial users
5. **Trial Check-In** - Mid-trial engagement
6. **Trial Ending** - Conversion to paid

### Customer Success:
7. **Paid Conversion Welcome** - Onboarding new clients
8. **Monthly Check-In** - Ongoing engagement
9. **Renewal Reminder** - 30 days before renewal
10. **Re-Engagement** - Win back lapsed clients
11. **Referral Request** - Ask for referrals

### Employee Communications:
12. **Survey Launch Announcement** - For clients to send to employees
13. **Survey Reminder** - Weekly reminder template

**To Use:**
1. Copy the email body
2. Customize the [placeholders] with client details
3. Send via your email platform (Gmail, Outlook, etc.)

---

## 🌐 Hosting the Presentation Website

### Option 1: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Connect Vercel to your GitHub repo
3. Deploy automatically
4. Your presentation will be live at: `https://your-app.vercel.app/presentation`

### Option 2: Netlify (Also Free)

1. Same as Vercel
2. Drag-and-drop deployment available

### Option 3: Custom Domain

Once deployed, add a custom domain:
- `beacon.yourcompany.com`
- `www.beaconwellbeing.com.au`

---

## 📊 Analytics Setup

### Track Downloads & Views

Add Google Analytics or Plausible to track:
- Page views on `/presentation`
- Download button clicks
- Demo dashboard visits
- Contact form submissions

Add to `/src/app/layout.tsx`:
```typescript
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

---

## 🎯 Next Steps Checklist

- [ ] Run the PDF conversion script
- [ ] Review all generated PDFs
- [ ] Upload PDFs to Google Drive
- [ ] Create shareable Google Drive links
- [ ] Convert to Google Slides (optional)
- [ ] Customize presentation page with your branding
- [ ] Add your logo and contact details
- [ ] Test all download links
- [ ] Deploy to Vercel or Netlify
- [ ] Share presentation URL with prospects
- [ ] Set up email templates in your CRM
- [ ] Track analytics on downloads/views

---

## 🆘 Troubleshooting

### PDFs not generating?

**Problem:** Pandoc not installed
**Solution:**
```bash
# Mac
brew install pandoc

# Linux
sudo apt-get install pandoc
```

**Problem:** LaTeX errors
**Solution:** Install BasicTeX (smaller than full LaTeX):
```bash
# Mac
brew install --cask basictex
```

### Presentation page not loading?

**Problem:** Material Icons not showing
**Solution:** Icons are loaded via Google Fonts CDN in `layout.tsx`. Check your internet connection.

**Problem:** Styling looks broken
**Solution:** Make sure Tailwind CSS is compiled:
```bash
npm run dev
```

### Google Slides conversion issues?

**Problem:** Formatting looks wrong
**Solution:** Use the manual slide structure in `GOOGLE_SLIDES_SETUP.md` rather than auto-conversion.

---

## 📞 Support Resources

- **Pandoc Documentation:** https://pandoc.org/
- **Google Slides Help:** https://support.google.com/docs/topic/19431
- **Vercel Deployment:** https://vercel.com/docs
- **Material Icons:** https://fonts.google.com/icons

---

## 🎉 You're Ready!

Everything is set up and ready to go. You now have:

✅ Professional proposal document  
✅ Complete email templates  
✅ Technical summary  
✅ Survey documentation  
✅ Beautiful presentation website  
✅ PDF generation tools  
✅ Google Slides conversion guide  

**Share this URL with clients:**
```
https://your-domain.com/presentation
```

Or send them the PDF attachments directly from the `presentation-pdfs/` folder.

Good luck with your Beacon presentations! 🚀

---

*Need help? Review the guides or reach out to your development team.*

