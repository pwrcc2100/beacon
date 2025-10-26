# Beacon Survey Flow - Visual Diagram

## Survey Journey Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    📱 EMPLOYEE RECEIVES SMS/EMAIL                │
│                  "Your weekly wellbeing check-in"                │
│                     [Click to start - 2 mins]                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   🔒 CONFIDENTIALITY NOTICE                      │
│  "Your responses are confidential. Only aggregated data shared   │
│   with leadership. This measures the system, not you."          │
│                                                                   │
│                    [Continue to Survey]                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    📊 5 CORE QUESTIONS                           │
│                  (Progress: 1/5, 2/5, 3/5...)                   │
│                                                                   │
│  Q1: How are you feeling about work this week?                  │
│      ✅ Good │ 😐 Okay │ ❌ Struggling                          │
│                                                                   │
│  Q2: How's your workload?                                        │
│      ✅ Manageable │ 😐 Busy │ ❌ Unsustainable                 │
│                                                                   │
│  Q3: Do you feel safe speaking up?                              │
│      ✅ Comfortable │ 😐 Sometimes hesitate │ ❌ Don't feel safe│
│                                                                   │
│  Q4: Do you feel supported by leadership?                       │
│      ✅ Supported │ 😐 Somewhat │ ❌ Not supported              │
│                                                                   │
│  Q5: Are you clear on what's expected?                          │
│      ✅ Clear │ 😐 Mostly clear │ ❌ Unclear                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
              ┌───────┴────────┐
              │  Risk Check    │
              │  Any ❌ answers?│
              └───┬────────┬───┘
                  │        │
           YES ❌ │        │ NO ✅
                  │        │
                  ▼        └────────────────────┐
┌─────────────────────────────────────┐         │
│    🤝 SUPPORT REQUEST SCREEN         │         │
│                                      │         │
│ "Would you like someone to reach out?"│        │
│                                      │         │
│  ✅ Yes, I'd like to be contacted   │         │
│  ❌ No thanks, I'm managing          │         │
│  ℹ️ Tell me more about support      │         │
└────┬──────────────┬──────────────┬──┘         │
     │              │              │            │
  YES│           NO │              │INFO        │
     │              │              │            │
     ▼              └──────────────┼────────────┤
┌──────────────────────────┐       │            │
│  📋 SUPPORT OPTIONS       │       │            │
│                          │       │            │
│ Who to contact:          │       │            │
│ ☐ HR Team                │       │            │
│ ☐ WHS Leader             │       │            │
│ ☐ My Manager             │       │            │
│ ☐ EAP                    │       │            │
│ ☐ Other                  │       │            │
│                          │       │            │
│ Contact method:          │       │            │
│ ○ Work email             │       │            │
│ ○ Personal email: ___    │       │            │
│ ○ Phone: ___             │       │            │
│ ○ Anonymous meeting      │       │            │
│                          │       │            │
│ Timeframe:               │       │            │
│ ○ Within 24 hours        │       │            │
│ ○ Within this week       │       │            │
│ ○ When convenient        │       │            │
│                          │       │            │
│      [Continue]          │       │            │
└────────┬─────────────────┘       │            │
         │                         │            │
         └─────────────────────────┼────────────┘
                                   │
                                   ▼
         ┌─────────────────────────────────────────┐
         │      💬 OPTIONAL COMMENTS                │
         │                                          │
         │  "Anything else you'd like to share?"   │
         │  [Text area - 500 chars, confidential]  │
         │                                          │
         │           [Continue]                     │
         └────────┬────────────────────────────────┘
                  │
                  ▼
          ┌───────┴────────┐
          │  Risk Check    │
          │  Any ❌ answers?│
          └───┬────────┬───┘
              │        │
       YES ❌ │        │ NO ✅
              │        │
              ▼        └────────────────────┐
┌─────────────────────────────────┐         │
│   🆘 CRISIS RESOURCES            │         │
│                                  │         │
│ "You're not alone. Immediate    │         │
│  support available:"             │         │
│                                  │         │
│ [📞 Lifeline - 13 11 14]        │         │
│ [🌐 Beyond Blue - 1300 22 4636] │         │
│ [💼 SafeWork Australia]          │         │
│ [🏥 EAP - Your Provider]        │         │
│ [📧 HR Support]                  │         │
│                                  │         │
│       [Finish Survey]            │         │
└────────┬────────────────────────┘         │
         │                                   │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────────┐
         │       ✅ THANK YOU                     │
         │                                        │
         │  "Your feedback helps build a safer,  │
         │   more supportive workplace."         │
         │                                        │
         │  What happens next:                   │
         │  • Responses confidential             │
         │  • Leadership sees trends only        │
         │  • Support contact within timeframe   │
         │  • Next check-in in 1 week           │
         │                                        │
         │  Need help now?                       │
         │  HR: hr@company.com | Ext 1234       │
         └───────────────────────────────────────┘
```

---

## Parallel Backend Workflow

### When Support is Requested:

```
Employee Submits Support Request
         │
         ▼
┌──────────────────────────────────┐
│  Notification Sent Immediately   │
│  To: Selected contact person(s)  │
│  Contains:                        │
│  • Request timestamp             │
│  • Preferred contact method      │
│  • Timeframe preference          │
│  • (NOT full survey responses)   │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Dashboard Alert                 │
│  "1 new support request"         │
│  Status: PENDING                 │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Contact Person Reaches Out      │
│  Within requested timeframe      │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Status Updated: CONTACTED       │
│  Track: Date/time of contact     │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Support Provided                │
│  Status: RESOLVED                │
│  Notes: (confidential)           │
└──────────────────────────────────┘
```

---

## What Leadership Sees (Dashboard):

```
┌──────────────────────────────────────────────────────┐
│  EXECUTIVE WELLBEING DASHBOARD                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Overall Wellbeing: 68/100 (↓ 3 from last week)    │
│                                                      │
│  [Status Cards: OK/Mixed/No for each dimension]    │
│                                                      │
│  Teams Needing Attention:                           │
│  [Bar Chart: Engineering 45, Marketing 57, HR 78]  │
│                                                      │
│  Support Requests This Week: 3                      │
│  • 1 pending (< 24hrs)                              │
│  • 2 contacted                                      │
│                                                      │
│  Alert: Workload scores dropping in Engineering     │
│  Action: Consider resource redistribution           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Leadership CANNOT see:**
- Who submitted which responses
- Individual survey answers
- Comments from specific people
- Who requested support (unless in HR/WHS role with access)

---

## Mobile Experience

```
┌─────────────────┐
│  iPhone/Android │
│                 │
│  ┌───────────┐  │
│  │ Beacon    │  │  ← Full width, scrollable
│  │           │  │
│  │ 🔒 Conf.  │  │  ← Large touch targets
│  │ Notice    │  │
│  │           │  │
│  │ [Continue]│  │  ← Big button
│  │           │  │
│  └───────────┘  │
│                 │
│  ━━━━━━━━━━━━━  │  ← Progress bar
│                 │
│  Question 1/5   │  ← Clear progress
│                 │
│  How are you    │
│  feeling?       │
│                 │
│  ┌───────────┐  │
│  │😊 Good    │  │  ← Tap option
│  └───────────┘  │     auto-advances
│  ┌───────────┐  │
│  │😐 Okay    │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │😟Struggle │  │
│  └───────────┘  │
│                 │
└─────────────────┘

✓ No zoom needed
✓ No sideways scrolling
✓ Fast loading
✓ Works offline
```

---

## Key Features Summary

| Feature | Benefit |
|---------|---------|
| **2-minute completion** | High response rates (80%+ typical) |
| **Conditional logic** | Support only offered when needed |
| **Mobile-optimised** | Works on any smartphone |
| **Privacy-first** | Employees trust it, share honestly |
| **Immediate resources** | Crisis support links always available |
| **Employee-controlled** | They choose if/how to get help |
| **Action-oriented** | Not just measurement, built-in pathways |
| **Predictive** | See problems weeks before they escalate |

---

**For a live demo:** Visit `/survey-preview` in the Beacon dashboard

