# 🌟 Beacon Effect - Website Structure

## Overview

**Beacon Effect** is the parent company with two main service branches:
1. **Beacon Advisory** - Strategic consulting and technology solutions
2. **Beacon Wellbeing** - Psychosocial safety platform

---

## 🏠 Main Landing Page

### `/` - Beacon Effect Home
**Purpose:** Choose your service path

**Content:**
- Hero: "Transform Your Business"
- Two main service cards (Advisory & Wellbeing)
- About Beacon Effect
- Our Approach (Evidence-Based, Partnership-Focused, Results-Driven)
- CTA and contact information

**Actions:**
- Link to `/advisory` (Beacon Advisory)
- Link to `/wellbeing` (Beacon Wellbeing)

---

## 🎯 Beacon Advisory Branch

### `/advisory` - Advisory Services Landing
**Purpose:** Showcase consulting services and expertise

**Content:**
- Hero: Corporate Concierge positioning
- Recognition & Awards (HammerTech 2024, RCC, Thought Leader)
- 4 Service Types:
  - Strategic Consulting
  - Technology Solutions
  - Interim Leadership
  - Corporate Concierge
- 8 Areas of Expertise
- Client testimonials
- 3 Engagement Models (Project-Based, Retainer, Interim Executive)
- CTA and LinkedIn integration

**Key Features:**
- Your professional achievements highlighted
- Award recognition
- Testimonials from colleagues/clients
- LinkedIn profile link

---

## 💚 Beacon Wellbeing Branch

### `/wellbeing` - Wellbeing Platform Landing
**Purpose:** Introduce the psychosocial safety platform

**Content:**
- Hero: Early Detection messaging
- Key stats (60s, 70-85%, 10-15%)
- Navigation cards to:
  - Features
  - Pricing
  - About
  - Live Demo
- Why organizations choose Beacon
- How it works (4 steps)
- Social proof testimonial
- CTA for free trial

**Sub-Pages:**

#### `/wellbeing/features`
- For Employees (4 features)
- For Leaders & Executives (6 features)
- For HR & Safety Teams (4 features)
- Security & Privacy (4 pillars)
- Integrations

#### `/wellbeing/pricing`
- 3 pricing tiers (Starter, Professional, Enterprise)
- Add-ons
- ROI calculator
- Implementation timeline
- FAQ

#### `/wellbeing/about`
- The challenge
- How Beacon helps
- 5 evidence-based dimensions
- Legal compliance
- Research foundation

---

## 🎨 Application Pages

### `/dashboard` - Executive Dashboard
**Purpose:** Live demo of the wellbeing platform

**Features:**
- Real-time wellbeing data
- Drill-down by division/department/team
- KPI cards
- Trend charts
- Response table

### `/analytics` - Advanced Analytics
**Purpose:** Deep-dive analytics and insights

**Features:**
- Distribution histograms
- Heat map matrix
- Individual journey paths
- Response rate tracking
- Segmented box plots
- Statistical process control charts

### `/methodology` - Research & Methodology
**Purpose:** Detailed explanation of the science

**Features:**
- Weighting rationale
- Formula explanation
- Research references
- Interpretation guide

### `/survey/[token]` - User Survey
**Purpose:** Employee survey interface

**Features:**
- 60-second completion
- 5 questions
- Mobile-optimized
- Anonymous

---

## 🔐 Admin Section

### `/admin/login` - Admin Login
**Purpose:** Secure access to internal materials

**Features:**
- Password gate (default: `beacon2025`)
- Beautiful login UI
- Session management

### `/admin/materials` - Internal Materials Hub
**Purpose:** All internal docs and resources

**Content:**
- Client presentations (HTML)
- Email templates
- Survey design docs
- Marketing materials
- Demo links
- Quick actions

---

## 📄 Additional Pages

### `/one-pager` - Executive Summary
**Purpose:** Print-ready one-page overview

**Features:**
- Print-optimized layout
- All key information
- PDF-ready
- Wellbeing platform focus

---

## 🗺️ Site Map

```
/                           → Beacon Effect Home (choose your path)
├── /advisory               → Beacon Advisory (consulting services)
├── /wellbeing              → Beacon Wellbeing (platform landing)
│   ├── /features           → Platform features
│   ├── /pricing            → Pricing & ROI
│   └── /about              → About & methodology
├── /dashboard              → Live demo dashboard
├── /analytics              → Advanced analytics
├── /methodology            → Research methodology
├── /one-pager              → Print-ready summary
├── /admin
│   ├── /login              → Admin login
│   └── /materials          → Internal materials
└── /survey/[token]         → User survey interface
```

---

## 🎯 User Journeys

### Journey 1: Consulting Client
1. Land on `/` (Beacon Effect)
2. Click "Explore Advisory Services"
3. View `/advisory` page
4. See expertise, awards, testimonials
5. Contact via email or LinkedIn

### Journey 2: Wellbeing Platform Prospect
1. Land on `/` (Beacon Effect)
2. Click "Explore Wellbeing Platform"
3. View `/wellbeing` landing page
4. Navigate to:
   - `/wellbeing/features` (see capabilities)
   - `/wellbeing/pricing` (understand costs)
   - `/dashboard` (view live demo)
5. Start free trial via CTA

### Journey 3: Client Meeting
1. Print `/one-pager` before meeting
2. Show `/dashboard` live demo
3. Walk through `/wellbeing/features`
4. Discuss `/wellbeing/pricing`
5. Send follow-up email (from `/admin/materials`)

### Journey 4: Internal User (You)
1. Login at `/admin/login`
2. Access `/admin/materials`
3. View all presentations, templates, docs
4. Copy email templates
5. Access demo links

---

## 🎨 Brand Identity

### Beacon Effect
- **Icon:** `auto_awesome` (Material Icon)
- **Colors:** Navy `#2B4162`, Slate `#5d89a9`
- **Positioning:** Parent company, strategic solutions

### Beacon Advisory
- **Icon:** `psychology` (Material Icon)
- **Colors:** Slate `#5d89a9`, Navy `#2B4162`
- **Positioning:** Corporate concierge, consulting

### Beacon Wellbeing
- **Icon:** `health_and_safety` (Material Icon)
- **Colors:** Teal `#64afac`, Navy `#2B4162`
- **Positioning:** Psychosocial safety, early detection

---

## 📞 Contact Information

**All Pages Include:**
- Email: hello@beaconeffect.com.au
- Phone: 1300 BEACON (232 266)
- LinkedIn: https://www.linkedin.com/in/peta-wilson-4769361

---

## ✅ What's Different Now

### Before (Old Structure)
- Home page focused only on wellbeing platform
- No clear parent brand
- Advisory services buried in one page

### After (New Structure)
- **Beacon Effect** as parent company
- Clear choice between two services
- **Beacon Advisory** gets equal prominence
- **Beacon Wellbeing** has its own landing page
- Better navigation and user journeys
- Professional corporate structure

---

## 🚀 Live URLs

### Main Sites
- http://localhost:3002/ - **Beacon Effect Home** (START HERE)
- http://localhost:3002/advisory - Beacon Advisory
- http://localhost:3002/wellbeing - Beacon Wellbeing

### Wellbeing Sub-Pages
- http://localhost:3002/wellbeing/features
- http://localhost:3002/wellbeing/pricing
- http://localhost:3002/wellbeing/about

### Application
- http://localhost:3002/dashboard - Live demo
- http://localhost:3002/analytics - Analytics
- http://localhost:3002/methodology - Methodology

### Admin
- http://localhost:3002/admin/login - Admin login
- http://localhost:3002/admin/materials - Materials (after login)

### Tools
- http://localhost:3002/one-pager - Print-ready summary

---

## 🎯 Next Steps

1. **Visit the new home page:** http://localhost:3002/
2. **Test both paths:**
   - Click "Explore Advisory Services"
   - Click "Explore Wellbeing Platform"
3. **Review content and customize as needed**
4. **Update email addresses** if needed (currently: hello@beaconeffect.com.au)

---

**Last Updated:** October 21, 2025  
**Status:** ✅ RESTRUCTURED & READY  
**Version:** 2.0.0


