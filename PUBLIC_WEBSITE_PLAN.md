# Beacon Public Website - Restructuring Plan

## 🎯 Goal
Create a professional, shareable public website with all information formatted beautifully, 
plus a separate admin-only section for internal materials.

## 📄 New Structure

### Public Pages (Shareable URLs)
```
/ (Home)
  - Hero with value proposition
  - Key stats
  - Quick overview
  - CTA buttons

/about
  - The challenge (current problems)
  - How Beacon helps
  - 5 evidence-based dimensions
  - Legal compliance table
  - Research foundation

/features
  - For Employees (60s surveys)
  - For Leaders (dashboards, insights)
  - For HR Teams (compliance, reporting)
  - Security & Privacy
  - Integration capabilities

/pricing
  - Starter Plan ($2,500/mo)
  - Professional Plan ($6,500/mo)
  - Enterprise Plan (Custom)
  - Add-ons
  - ROI calculator
  - Implementation timeline

/dashboard
  - Live demo dashboard (existing)

/one-pager (NEW)
  - Single downloadable page
  - All key info in one place
  - Print-optimized
  - PDF export button
```

### Admin-Only Section (Password Protected)
```
/admin/login
  - Password gate (uses ADMIN_DASH_TOKEN)

/admin/materials
  - Email templates (13 templates)
  - Sales scripts
  - Internal guides
  - Client onboarding checklists
  - Implementation documents
```

## ✨ Key Improvements

1. **No More HTML Downloads**
   - All content beautifully formatted in-page
   - Professional typography
   - Responsive design
   - Print-friendly

2. **Shareable URLs**
   - Send clients: beaconwellbeing.com.au/about
   - No attachments needed
   - Always up-to-date
   - Mobile-friendly

3. **One-Page Overview**
   - Executive summary
   - All key points
   - Downloadable PDF
   - Print-optimized

4. **Secure Admin Area**
   - Password protected
   - Email templates
   - Internal documents
   - Sales materials

## 📋 Implementation Steps

COMPLETED:
- ✅ Created PublicHeader component
- ✅ Created /about page with legal compliance

TODO:
- [ ] Create /features page
- [ ] Create /pricing page
- [ ] Create /one-pager page (downloadable overview)
- [ ] Update home page with better design
- [ ] Create /admin/login page
- [ ] Create /admin/materials page
- [ ] Move email templates to admin section
- [ ] Remove /presentation page (replaced by public pages)
- [ ] Update all navigation links

## 🎨 Design System

Colors: Beacon palette
- Teal (#64afac)
- Navy (#2B4162)
- Slate (#5d89a9)
- Coral (#ea9999)

Typography: Inter font
Icons: Material Symbols (weight 100)
Layout: Max-width 6xl, consistent spacing

## 📧 Usage Scenarios

### Scenario 1: Quick Overview
- Share: /one-pager
- They see everything in one page
- Download PDF button
- Print-friendly

### Scenario 2: Full Details
- Share: /about
- Professional formatting
- All information visible
- No downloads needed

### Scenario 3: Pricing Discussion
- Share: /pricing
- Interactive pricing calculator
- Compare plans
- ROI estimates

### Scenario 4: Demo
- Share: /dashboard
- Live working dashboard
- Real-time data
- Interactive filters

### Scenario 5: Internal Use
- Login: /admin/login
- Access email templates
- Sales scripts
- Implementation guides

## 🔄 Migration Path

1. Keep existing /dashboard (it works great)
2. Replace /presentation with public pages
3. Move internal docs to /admin/materials
4. Update all links
5. Test everything
6. Deploy

## 📊 Benefits

✅ Professional appearance
✅ Easy to share
✅ No file management
✅ Always up-to-date
✅ Mobile friendly
✅ SEO optimized
✅ Secure admin area
✅ Print-friendly
✅ Fast loading

## 🚀 Next Steps

Starting implementation now...

