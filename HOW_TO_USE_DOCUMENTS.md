# How to Use Your Beacon Documents

## 📄 What Are .md Files?

`.md` files are **Markdown** documents - plain text files with simple formatting. They're great for:
- Documentation you edit frequently
- Version control (Git)
- Easy editing in any text editor

But clients can't easily read them, so you need to convert them.

---

## 🎯 Your Documents & How to Use Them

### **For Clients (Share These)**

#### 1. **Survey Overview** - Client-facing, IP-safe
- **File:** `WELLBEING_SURVEY_OVERVIEW.md`
- **View Online:** http://localhost:3002/presentation-pdfs/Beacon-Survey-Overview.html
- **Use For:** Sales meetings, proposals, initial discussions
- **Print to PDF:** Open in browser → Cmd+P → Save as PDF
- **Safe to share:** ✅ Yes (no IP disclosure)

#### 2. **Platform Summary**
- **View Online:** http://localhost:3002/presentation-pdfs/Beacon-Platform-Summary.html
- **Use For:** Technical overview, feature discussions
- **Print to PDF:** Yes

#### 3. **Client Proposal Template**
- **View Online:** http://localhost:3002/presentation-pdfs/Beacon-Client-Proposal.html
- **Use For:** Formal proposals, pricing discussions
- **Print to PDF:** Yes

#### 4. **Email Templates**
- **View Online:** http://localhost:3002/presentation-pdfs/Beacon-Email-Templates.html
- **Use For:** Copy/paste for client communications
- **Print to PDF:** Yes (for reference)

#### 5. **One-Pager** (Best for Meetings!)
- **View Online:** http://localhost:3002/one-pager
- **Use For:** Print and bring to every client meeting
- **Print to PDF:** Yes - this is the best one to print!

---

### **For You Only (Internal)**

#### 1. **IP Protection Guide** - Keep Private!
- **File:** `IP_PROTECTION_GUIDE.md`
- **View Online:** http://localhost:3002/IP_PROTECTION_GUIDE.html
- **Use For:** Your reference on protecting intellectual property
- **Share:** ❌ No - internal only

#### 2. **Survey Questions** (Detailed) - Keep Private!
- **File:** `SURVEY_QUESTIONS.md`
- **View Online:** http://localhost:3002/presentation-pdfs/Beacon-Survey-Questions.html
- **Use For:** Your reference, development
- **Share:** ❌ No - trade secret (use Survey Overview instead)

#### 3. **Cleanup Checklist**
- **File:** `CLEANUP_CHECKLIST.md`
- **Use For:** Your to-do list for website polish
- **Share:** ❌ No - internal only

#### 4. **Website Structure Docs**
- **Files:** `BEACON_EFFECT_STRUCTURE.md`, `WEBSITE_COMPLETE.md`, `QUICK_START.md`
- **Use For:** Your reference for how the website works
- **Share:** ❌ No - internal only

---

## 🖨️ How to Print Documents to PDF

### Method 1: From Browser (Easiest)
1. Open the HTML version in your browser (links above)
2. Press **Cmd+P** (Mac) or **Ctrl+P** (Windows)
3. Select "Save as PDF" as printer
4. Click "Save"
5. Done! ✅

### Method 2: From Terminal (Advanced)
```bash
cd /Users/peta/Documents/Beacon/webapp/beacon
pandoc FILENAME.md -o OUTPUT.pdf --pdf-engine=wkhtmltopdf
```

---

## 📋 Quick Reference: What to Use When

### **Client Meeting Tomorrow?**
1. Print: http://localhost:3002/one-pager
2. Bring laptop to show: http://localhost:3002/dashboard
3. Have ready: Survey Overview PDF

### **Sending Email to Prospect?**
1. Use templates from: http://localhost:3002/presentation-pdfs/Beacon-Email-Templates.html
2. Attach: Survey Overview PDF
3. Link to: Your website (once deployed)

### **Formal Proposal?**
1. Use: Client Proposal Template
2. Customize pricing and timeline
3. Attach: Survey Overview PDF
4. Include: One-pager PDF

### **Technical Discussion?**
1. Use: Platform Summary
2. Show: Live dashboard demo
3. Discuss: Features page

---

## 🔐 What NOT to Share

**Never share these with clients (without NDA):**
- Detailed survey questions (`SURVEY_QUESTIONS.md`)
- Branching logic diagrams
- Scoring formulas/algorithms
- Source code
- Internal documentation

**Always use instead:**
- Survey Overview (client-safe version)
- One-pager (high-level benefits)
- Platform Summary (features, not methodology)

---

## 📂 Where Everything Lives

### **Online (Browser Access)**
- **Public website:** http://localhost:3002/
- **Client materials:** http://localhost:3002/admin/materials (password: `beacon2025`)
- **Presentations:** http://localhost:3002/presentation-pdfs/

### **On Your Computer**
- **All documents:** `/Users/peta/Documents/Beacon/webapp/beacon/`
- **Markdown files:** `*.md` files in root directory
- **HTML versions:** `presentation-pdfs/` folder
- **Website code:** `src/` folder

---

## 🎯 Pro Tips

### **For Client Meetings**
1. **Always print the one-pager** before meetings
2. **Bookmark the dashboard** for quick demos
3. **Keep Survey Overview PDF** on your desktop for quick email attachments

### **For Email Campaigns**
1. **Copy templates** from Email Templates HTML
2. **Attach Survey Overview PDF** (not the detailed questions!)
3. **Link to your website** (once deployed to Vercel)

### **For Proposals**
1. **Start with Client Proposal template**
2. **Customize** for each client
3. **Always include** Survey Overview PDF
4. **Print one-pager** to bring to follow-up meeting

---

## 🚀 Quick Actions

### **Right Now:**
1. Open http://localhost:3002/one-pager
2. Print to PDF (Cmd+P → Save as PDF)
3. Save to Desktop as "Beacon-One-Pager.pdf"
4. Bring to your next meeting!

### **Before Your Next Client Meeting:**
1. Print one-pager ✅
2. Bookmark dashboard demo ✅
3. Have Survey Overview PDF ready ✅
4. Review Email Templates ✅

### **This Week:**
1. Read IP Protection Guide
2. Consider trademark registration
3. Draft simple NDA template
4. Review all client-facing materials

---

## ❓ Common Questions

**Q: Can I edit the .md files?**  
A: Yes! Use any text editor. After editing, re-run the pandoc command to update the HTML/PDF.

**Q: How do I share documents with clients?**  
A: Either:
- Print to PDF and email as attachment
- Share the HTML link (once website is deployed)
- Print physical copies for meetings

**Q: Which document should I send first?**  
A: Survey Overview PDF - it's designed to be client-safe and explains benefits without revealing IP.

**Q: Can I customize the documents?**  
A: Yes! Edit the .md files, then convert to HTML/PDF again.

**Q: Where's the best place to store PDFs?**  
A: Create a folder on your Desktop called "Beacon Client Materials" and save all PDFs there for quick access.

---

## 📞 Need Help?

All your documents are accessible at:
- **Admin portal:** http://localhost:3002/admin/materials
- **Password:** `beacon2025`

---

**Last Updated:** October 2025  
**Quick Tip:** Bookmark http://localhost:3002/one-pager for fastest access to your best client document!



