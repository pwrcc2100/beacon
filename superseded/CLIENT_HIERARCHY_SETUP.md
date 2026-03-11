# Client Hierarchy Setup Guide

This guide explains how to set up the organizational hierarchy for new clients in Beacon.

## Overview

Beacon uses a 3-level organizational hierarchy:
- **Divisions** (e.g., Regions, Business Units)
- **Departments** (e.g., Functions, Programs)
- **Teams** (e.g., Work Teams, Projects)

## Quick Start: Two Methods

### Method 1: One-Time SQL Migration (Recommended)

**Step 1: Run the schema migration** (once per Supabase project)
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `database-schema-hierarchy-template.sql`
3. Click "Run"
4. This creates the tables: `divisions`, `departments`, and `teams`

**Step 2: Set up hierarchy for each client** (via API or manually)
- Use the "Setup Hierarchy" button in the dashboard, OR
- Call the `/api/client/setup-hierarchy` API endpoint

### Method 2: Using the Dashboard Button

1. Navigate to the dashboard
2. Click the **"Setup Hierarchy"** button
3. Fill in:
   - **Divisions**: One per line (e.g., Sydney Metro, Regional, QLD)
   - **Departments**: One per line (will be created under each division)
   - **Teams**: One per line (will be created under each department)
4. Click "Create Hierarchy"

## File Structure

```
database-schema-hierarchy-template.sql    # SQL migration (run once)
hierarchy-template.example.json           # Example config file
src/app/api/client/setup-hierarchy/       # API endpoint
src/components/dashboard/SetupHierarchyButton.tsx  # UI component
```

## API Usage

### Endpoint: `/api/client/setup-hierarchy`

**Method:** POST

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <ADMIN_DASH_TOKEN>` (or use `dash` cookie)

**Body:**
```json
{
  "client_id": "uuid-here",
  "hierarchy": {
    "divisions": ["Division 1", "Division 2", "Division 3"],
    "departments_per_division": ["Dept A", "Dept B", "Dept C"],
    "teams_per_department": ["Team 1", "Team 2"]
  }
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Hierarchy setup completed",
  "summary": {
    "divisions": 3,
    "departments": 9,
    "teams": 18
  },
  "results": {
    "divisions": ["Created: Division 1", "Created: Division 2", ...],
    "departments": ["Created: Division 1:Dept A", ...],
    "teams": ["Created: Division 1:Dept A:Team 1", ...]
  }
}
```

## Example Config File

See `hierarchy-template.example.json` for a complete example.

## How It Works

1. **Divisions are created first** - Each division name you provide becomes a top-level organizational unit
2. **Departments are created under each division** - For each division, all departments are created
3. **Teams are created under each department** - For each department, all teams are created

**Example:**
- Divisions: `["Sydney", "Melbourne"]`
- Departments: `["Sales", "Support"]`
- Teams: `["Team A", "Team B"]`

**Result:**
- 2 Divisions: Sydney, Melbourne
- 4 Departments: Sydney:Sales, Sydney:Support, Melbourne:Sales, Melbourne:Support
- 8 Teams: Sydney:Sales:Team A, Sydney:Sales:Team B, ... (and so on)

## For New Clients

When onboarding a new client:

1. **Create the client record** in Supabase `clients` table (if not exists)
2. **Run the schema migration** (if not already done for this Supabase project)
3. **Set up their hierarchy** using the dashboard button or API
4. **Verify** by checking the dashboard - divisions should appear in filters

## Troubleshooting

### "Hierarchy tables do not exist"
- Run the `database-schema-hierarchy-template.sql` migration in Supabase SQL Editor

### "Failed to create any divisions"
- Check that `client_id` is valid
- Verify you have admin access (correct token/cookie)
- Check Supabase logs for detailed errors

### Divisions not showing in dashboard
- Ensure divisions have `active = true`
- Verify `client_id` matches your `NEXT_PUBLIC_DASHBOARD_CLIENT_ID`
- Check browser console for errors

## Database Schema

The hierarchy uses these tables:

```sql
divisions
  - division_id (PK)
  - client_id (FK → clients)
  - division_name
  - active

departments
  - department_id (PK)
  - division_id (FK → divisions)
  - department_name
  - active

teams
  - team_id (PK)
  - department_id (FK → departments)
  - team_name
  - active

employees (extended)
  - division_id (FK → divisions)
  - department_id (FK → departments)
  - team_id (FK → teams)
```

## Next Steps

After setting up the hierarchy:
1. Generate demo data (will use the hierarchy structure)
2. Import employees and assign them to divisions/departments/teams
3. Start collecting survey responses
4. View aggregated data in the dashboard by division/department/team
