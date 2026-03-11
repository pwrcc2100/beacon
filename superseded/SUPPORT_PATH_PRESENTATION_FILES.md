# Support Path Presentation Files

## Files Created

### 1. Visual One-Page Workflow Summary
**Location:** `presentation-pdfs/Beacon-Support-Workflow.html`

**Purpose:** Beautiful, one-page visual showing the complete end-to-end support workflow

**Contents:**
- Visual flow diagram of all 4 stages
- High-risk trigger conditions
- Key features and benefits
- Compliance badges
- Professional gradient design

**How to Use:**
- Open in any web browser
- Can be printed as a one-page reference
- Suitable for sharing with stakeholders
- Works great as a demo visual aid

**To Convert to PDF:**
```bash
# Option 1: Print to PDF from browser
# Open in Chrome → Print → Save as PDF

# Option 2: Use the conversion script
./scripts/convert-to-pdf.sh beacon/presentation-pdfs/Beacon-Support-Workflow.html
```

---

### 2. Detailed Support Workflow Explanation
**Location:** `marketing-for-gamma/SUPPORT_WORKFLOW_EXPLANATION.md`

**Purpose:** Comprehensive markdown document explaining every aspect of the support workflow for presentations

**Contents Include:**
- Complete stage-by-stage workflow explanation
- Technical flow diagrams
- Configuration options
- Demo notes and talking points
- Compliance and legal information
- Key statistics and evidence base
- Implementation status

**How to Use:**
1. **For Gamma Presentations:**
   - Import into Gamma as markdown slides
   - Gamma will auto-format into beautiful presentation

2. **For Other Presentations:**
   - Copy sections into PowerPoint/Google Slides
   - Use as speaker notes/reference
   - Print as handouts

3. **For Documentation:**
   - Reference for technical documentation
   - Client proposal material
   - Training materials

---

## Quick Demo Script

### Opening (1 min)
"Today I'm showing you Beacon's intelligent Support Path - an automated system that activates when someone indicates they're struggling, providing immediate resources and optional connection to organisational support."

### Show Visual (2 min)
**Display:** `Beacon-Support-Workflow.html`

"This one-page view shows the complete flow:
1. **Support Request** - Respectfully asks if they'd like help
2. **Support Options** - They choose who, how, when
3. **Crisis Resources** - Immediate professional support always shown
4. **Complete** - Full tracking and notification system"

### Walk Through Code/Implementation (3 min)
**Reference:** `SUPPORT_WORKFLOW_EXPLANATION.md`

"Let me walk you through how this works technically:
- When someone marks 'struggling' on any question, the system detects high-risk
- If they want help, they select who should contact them - HR, their manager, EAP
- They choose how - email, phone, or completely anonymous
- They set when - 24 hours, this week, or flexible
- Meanwhile, they immediately see crisis resources"

### Key Benefits (2 min)
- Privacy-first: Employee controls everything
- Immediate: Crisis resources shown right away  
- Organisational insight: Patterns inform systemic improvements
- Compliance-ready: Full audit trail for WHS obligations

---

## Integration with Existing Presentation

### Where to Add These Materials

1. **DEMO_PRESENTATION_GUIDE.md** - Add a new section:
   ```markdown
   ### 6. Support Path Demo (3 min)
   Show: Beacon-Support-Workflow.html
   Reference: SUPPORT_WORKFLOW_EXPLANATION.md
   
   Key talking points:
   - Automatic activation on high-risk responses
   - Employee choice and privacy
   - Multiple support pathways
   - Compliance-ready tracking
   ```

2. **Include in Sections 3 & 4** (Survey & Dashboard):
   - Mention Support Path activates automatically
   - Show crisis resources are always available
   - Explain how dashboard tracks support requests

---

## Additional Uses

### For Client Proposals
- Include `Beacon-Support-Workflow.html` as appendix
- Use `SUPPORT_WORKFLOW_EXPLANATION.md` for detailed responses

### For Training Materials
- Reference the detailed explanation
- Use workflow visual for training sessions

### For Documentation
- Add to README or documentation site
- Include in onboarding materials

---

## Next Steps

1. **Review both files** - Ensure content matches your needs
2. **Test workflow visual** - Open HTML in browser, verify display
3. **Import to Gamma** - If using Gamma, import markdown file
4. **Add to demo guide** - Update `DEMO_PRESENTATION_GUIDE.md`
5. **Practice demo** - Walk through with these materials

---

## Files Summary

| File | Type | Purpose | Output |
|------|------|---------|--------|
| `Beacon-Support-Workflow.html` | HTML | Visual workflow diagram | Browser, PDF |
| `SUPPORT_WORKFLOW_EXPLANATION.md` | Markdown | Detailed explanation | Gamma, Docs, Slides |
| `SUPPORT_PATH_PRESENTATION_FILES.md` | Markdown | This file - usage guide | Reference |

---

**Status:** Ready for use in presentations ✅


