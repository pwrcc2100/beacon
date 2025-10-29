# Beacon - Team Wellbeing Surveys

A Next.js application for anonymous team wellbeing surveys with Supabase backend.

## Features

- ✅ Anonymous survey responses with tokenized links
- ✅ 3-point UX mapped to 5-point analytics
- ✅ Rate limiting and security
- ✅ Supabase integration with RLS
- ✅ Modern UI with consistent design tokens
- ✅ TypeScript throughout

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Upstash Redis account (for rate limiting)

### Installation

1. **Install dependencies:**
   ```bash
   cd beacon
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.template .env.local
   ```
   
   Fill in your Supabase and Upstash credentials in `.env.local`

3. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL from `database-schema.sql` in your Supabase SQL editor
   - Get your project URL and keys from Settings > API

4. **Start development server:**
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── responses/     # Survey submission
│   │   └── surveys/issue/ # Token generation
│   ├── survey/[token]/    # Survey page
│   └── thanks/           # Thank you page
├── components/
│   └── survey/           # Survey UI components
├── lib/                  # Utilities and config
└── styles/               # CSS and design tokens
```

## API Usage

### Issue Survey Token
```bash
POST /api/surveys/issue
{
  "client_id": "uuid",
  "employee_id": "uuid", // optional
  "ttl_days": 7,
  "channel": "web"
}
```

### Submit Survey Response
```bash
POST /api/responses
{
  "token": "uuid",
  "sentiment_3": 1, "sentiment_5": 5,
  "clarity_3": 2, "clarity_5": 3,
  // ... other questions
  "meta": {}
}
```

## Design System

The app uses CSS custom properties for consistent theming:

- **Good**: `#64afac` (teal) with `✓` icon
- **Okay**: `#5d89a9` (blue) with `–` icon  
- **Attention**: `#ea9999` (pink) with `△` icon

## Security

- Row Level Security (RLS) enabled on all tables
- Service role key for server-side operations only
- Rate limiting on survey submissions
- Single-use tokens with TTL
- No direct client access to tokens table

## Deployment

1. Deploy to Vercel
2. Add environment variables in Vercel dashboard
3. Set `NEXT_PUBLIC_APP_URL` to your production domain
4. Configure Supabase for production

## Next Steps

- [ ] Admin dashboard with analytics
- [ ] Team hierarchy and manager views
- [ ] SMS integration with Twilio
- [ ] Automated weekly surveys
- [ ] Export functionality
- [ ] Multi-language support

