# What is NEXT_PUBLIC_DASHBOARD_CLIENT_ID?

## Quick Explanation

**`NEXT_PUBLIC_DASHBOARD_CLIENT_ID`** is a **UUID (unique identifier)** that tells the dashboard which organization/client's data to display.

Think of it like this:
- Each organization that uses Beacon gets their own `client_id` 
- All survey responses, employees, and data are linked to that `client_id`
- The dashboard uses this ID to filter and show only that client's data

## Where It Comes From

The `client_id` is stored in your Supabase database in the `clients` table. Each row in that table represents one organization/client.

## How to Get/Create It

### Option 1: Check if You Already Have One

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → **clients** table
3. If you see any rows, copy the `id` value (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)
4. That's your `NEXT_PUBLIC_DASHBOARD_CLIENT_ID`!

### Option 2: Create a New Client Record

If you don't have a client record yet, create one:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL:

```sql
INSERT INTO public.clients (name)
VALUES ('Demo Client')
RETURNING id;
```

3. Copy the `id` that's returned (the UUID)
4. That UUID is your `NEXT_PUBLIC_DASHBOARD_CLIENT_ID`

### Option 3: Use Supabase Table Editor

1. Go to **Table Editor** → **clients**
2. Click **"Insert row"** or **"+ Insert"**
3. Fill in:
   - `name`: "Demo Client" (or your organization name)
   - Leave `id` empty (it auto-generates)
   - `created_at` auto-fills
4. Click **Save**
5. Copy the `id` value that was generated

## Example

After creating a client, you might get a UUID like:
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Then in Vercel environment variables, you'd set:
```
NEXT_PUBLIC_DASHBOARD_CLIENT_ID = a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Important Notes

- **One client_id per organization**: Each organization gets one client record
- **All data is scoped**: Survey responses, employees, departments all belong to a client_id
- **UUID format**: It's always a UUID (32 hex characters with dashes)
- **Required for dashboard**: Without this, the dashboard won't know which data to show

## For Your Demo

Since you're setting this up for a demo:

1. Create a client record named "Demo Client" or your company name
2. Use that client_id for all demo data
3. When you generate demo data (100 records), it will all be linked to this client_id

## Quick SQL to Check

```sql
-- See all your clients
SELECT id, name, created_at FROM public.clients;

-- Create a demo client (if none exists)
INSERT INTO public.clients (name)
VALUES ('Beacon Demo Client')
RETURNING id, name;
```

---

**TL;DR**: It's a UUID that identifies which organization's data the dashboard should show. Create a client record in Supabase, copy its `id`, and use that as your `NEXT_PUBLIC_DASHBOARD_CLIENT_ID`.


