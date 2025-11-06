# Troubleshooting: Data Not Showing After Generating Demo Records

## Issue
After clicking "Generate 100 Demo Records", the success message appears but no data shows on the dashboard.

## Likely Causes

### 1. Database Schema Missing Tables/Columns
The code expects these database structures to exist:

- `divisions` table
- `departments` table  
- `teams` table
- `employees` table with columns: `division_id`, `department_id`, `team_id`

### 2. Solution: Run the Schema Migration

**Option A: Run the SQL file in Supabase**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Open your project
3. Go to SQL Editor
4. Copy and paste the contents of `database-schema-divisions-departments-teams.sql`
5. Click "Run"

**Option B: Check if tables already exist**

In Supabase SQL Editor, run:
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('divisions', 'departments', 'teams');

-- Check if employees table has the required columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'employees'
  AND column_name IN ('division_id', 'department_id', 'team_id');
```

If tables/columns are missing, run the migration SQL file.

### 3. Verify Data Was Actually Inserted

After generating records, check in Supabase:

```sql
-- Check if responses were inserted
SELECT COUNT(*) FROM responses_v3 
WHERE client_id = 'YOUR_CLIENT_ID' 
  AND source = 'demo_seed_with_departments';

-- Check if divisions/departments/teams were created
SELECT COUNT(*) FROM divisions WHERE client_id = 'YOUR_CLIENT_ID';
SELECT COUNT(*) FROM departments;
SELECT COUNT(*) FROM teams;

-- Check if employees have division_id set
SELECT COUNT(*) FROM employees 
WHERE client_id = 'YOUR_CLIENT_ID' 
  AND division_id IS NOT NULL;
```

### 4. Check Dashboard Filters

Make sure the dashboard is set to:
- **Data Mode**: "Historical" (not "Live")
- **Time Period**: "All Time" or "Last 12 Months" (demo data spans 6 months)

The data is generated with dates spread over the last 180 days, so "This Month" or "Live" mode won't show it.

### 5. Check Browser Console

Open browser DevTools (F12) → Console tab and look for errors when the page loads.

### 6. Check Vercel Function Logs

1. Go to: https://vercel.com/beacon1/beacon/logs
2. Look for errors when generating data
3. Check for SQL errors or foreign key constraint violations

## Next Steps After Fixing Schema

1. Run the SQL migration in Supabase
2. Try generating demo records again
3. Refresh the dashboard
4. Set filters to "All Time" and "Historical" mode
5. Data should appear!



