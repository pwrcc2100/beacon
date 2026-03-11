# Dashboard Design Options

Created: November 10, 2025

## Overview

Three alternative dashboard layouts have been created for your review. Each maintains all your Beacon psychosocial safety features but with different visual approaches.

## The Options

### Option A: Card-Based Modern
**File:** `src/components/dashboard/ExecutiveOverview-OptionA.tsx`

**Features:**
- Clean metric cards at the top (4 key metrics with icons)
- Soft, modern color palette
- 2-column grid for sentiment + insights
- Rounded cards with subtle shadows
- Better visual hierarchy

**Best for:** Modern, approachable feel. Easy to scan quickly.

---

### Option B: Executive Focus
**File:** `src/components/dashboard/ExecutiveOverview-OptionB.tsx`

**Features:**
- Hero section with large gauge as focal point
- Streamlined metrics around the gauge
- Horizontal sentiment breakdown
- Simplified divisions list (not full table)
- Emphasis on actionable insights

**Best for:** Executive presentations. Clear focal point with supporting details.

---

### Option C: Data-Dense Professional
**File:** `src/components/dashboard/ExecutiveOverview-OptionC.tsx`

**Features:**
- Compact metrics bar at top
- 3-column layout (Gauge | Sentiment | Insights)
- Maximum information density
- Professional corporate aesthetic
- All key metrics visible at once

**Best for:** Power users who want all data immediately visible.

---

## How to Preview Each Option

### Method 1: Quick Test (Temporary)

Edit `src/app/dashboard/page.tsx` and change the import:

```typescript
// Current (line ~10):
import ExecutiveOverview from '@/components/dashboard/ExecutiveOverview';

// To preview Option A:
import ExecutiveOverview from '@/components/dashboard/ExecutiveOverview-OptionA';

// To preview Option B:
import ExecutiveOverview from '@/components/dashboard/ExecutiveOverview-OptionB';

// To preview Option C:
import ExecutiveOverview from '@/components/dashboard/ExecutiveOverview-OptionC';
```

Save, and the dashboard will reload with the new design.

### Method 2: Create a Switcher (More permanent)

I can create a UI toggle that lets you switch between designs in real-time without editing code.

---

## Current Backup

Your current working version is saved as:
- `src/components/dashboard/ExecutiveOverview-backup-2025-11-10-1005.tsx`
- Also committed to git with timestamp

---

## Next Steps

1. Preview each option using Method 1 above
2. Let me know which you prefer, or
3. Tell me what you like/dislike about each, and I can:
   - Refine your favorite
   - Create a hybrid combining best elements
   - Make further adjustments

---

## Notes

- All options use your existing data and features
- All maintain the same functionality (drill-downs, filters, etc.)
- Colors and scoring logic remain consistent
- Only the layout and visual presentation differ

