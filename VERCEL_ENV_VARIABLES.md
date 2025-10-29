# Vercel Environment Variables Checklist

## Your Client ID
✅ **Client ID**: `036802fb-215b-4a54-9d6e-9826043a6645`

## Add These to Vercel

Go to: **https://vercel.com/beacon1/beacon/settings/environment-variables**

### Required Variables:

| Variable Name | Value | Status |
|--------------|-------|--------|
| `NEXT_PUBLIC_DASHBOARD_CLIENT_ID` | `036802fb-215b-4a54-9d6e-9826043a6645` | ✅ Ready |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL (starts with `https://`) | ⏳ Add |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ⏳ Add |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | ⏳ Add |
| `NEXT_PUBLIC_APP_URL` | `https://beacon-5tffcd7v0-beacon1.vercel.app` | ⏳ Add |
| `ADMIN_DASH_TOKEN` | Choose a secure password | ⏳ Add |

### Optional Variables:

| Variable Name | Value | Status |
|--------------|-------|--------|
| `UPSTASH_REDIS_REST_URL` | Your Redis URL (if using) | Optional |
| `UPSTASH_REDIS_REST_TOKEN` | Your Redis token (if using) | Optional |
| `TWILIO_ACCOUNT_SID` | Your Twilio SID (if using SMS) | Optional |
| `TWILIO_AUTH_TOKEN` | Your Twilio token (if using SMS) | Optional |
| `TWILIO_PHONE_NUMBER` | Your Twilio number (if using SMS) | Optional |

---

## Quick Copy-Paste Values

### Client ID (Ready to Use):
```
036802fb-215b-4a54-9d6e-9826043a6645
```

### App URL:
```
https://beacon-5tffcd7v0-beacon1.vercel.app
```

---

## How to Add in Vercel

1. Go to: https://vercel.com/beacon1/beacon/settings/environment-variables
2. For each variable:
   - Click **"Add"**
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Select **Environment**: All (Production, Preview, Development)
   - Click **"Save"**
3. After adding all variables, **Redeploy** your project

---

## Where to Find Supabase Credentials

1. Go to your Supabase Dashboard
2. Click **Settings** (gear icon) → **API**
3. You'll see:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important**: The service_role key has admin access. Keep it secret!

---

## After Adding Variables

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete
5. Test your dashboard!

---

## Quick Test

After adding variables and redeploying, visit:
- https://beacon-5tffcd7v0-beacon1.vercel.app/dashboard

You should see the dashboard (it might be empty until you add demo data).


