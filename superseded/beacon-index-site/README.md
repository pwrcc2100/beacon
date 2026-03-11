# Beacon Index Marketing Site

A standalone marketing website for **Beacon Index** — the psychosocial risk governance instrument. This site is **separate** from the Beacon Advisory website (beaconeffect.com.au): different product, different offering, different deployment.

## Quick Start

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Deployment

This site deploys on its own (e.g. beacon-index.vercel.app or a custom domain). It is not part of the Beacon Advisory app or beaconeffect.com.au.

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from this directory**:
   ```bash
   cd beacon-index-site
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Custom Domain Setup

**Target Domain:** `beaconindex.com.au`

Once deployed, add the custom domain in the Vercel dashboard:
- Go to your project settings → Domains
- Add `beaconindex.com.au` (and optionally `www.beaconindex.com.au`)
- Follow Vercel's DNS instructions to add the required records at your registrar

## Adding the Pilot Pack File

To make the "Download pilot pack" link work:

1. Place `MASTER_Beacon Pilot Information Pack Dec 4 2025.pptx` in the `public/` folder
2. Update the download link in `src/app/page.tsx` to:
   ```tsx
   <a href="/MASTER_Beacon Pilot Information Pack Dec 4 2025.pptx" download>
     Download pilot pack
   </a>
   ```

**Note:** If the file name has spaces, you may want to rename it to something URL-friendly like `beacon-index-pilot-pack.pptx` and update the link accordingly.

## Project Structure

```
beacon-index-site/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout with metadata
│       ├── page.tsx        # Main marketing page
│       └── globals.css     # Global styles
├── public/                 # Static assets (add PPTX here)
├── vercel.json            # Vercel deployment config
└── package.json
```

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **React 19**
