# Domain Setup for beaconindex.com.au

## Overview

This Beacon Index site will be deployed at **beaconindex.com.au** as a standalone domain.

## DNS Configuration

After deploying to Vercel, you'll need to configure DNS records at your domain registrar.

### Option 1: Use Vercel Nameservers (Recommended)

1. In Vercel dashboard → Project Settings → Domains
2. Add `beaconindex.com.au` and `www.beaconindex.com.au`
3. Vercel will provide nameservers (e.g., `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
4. At your domain registrar, update the nameservers for `beaconindex.com.au` to point to Vercel's nameservers
5. Vercel will automatically configure all DNS records

### Option 2: Use Registrar DNS (Manual)

If you prefer to keep DNS management at your registrar:

1. In Vercel dashboard → Project Settings → Domains
2. Add `beaconindex.com.au` and `www.beaconindex.com.au`
3. Vercel will show you the required DNS records:
   - **A record** for `beaconindex.com.au` → Vercel's IP address (e.g., `76.76.21.21`)
   - **CNAME record** for `www.beaconindex.com.au` → Vercel's CNAME target (e.g., `cname.vercel-dns.com`)
4. Add these records at your domain registrar
5. Wait for DNS propagation (usually 5-30 minutes, can take up to 48 hours)

## SSL Certificate

Vercel will automatically provision an SSL certificate once DNS is correctly configured. This usually happens within a few minutes after DNS propagation.

## Verification

To verify DNS is working:

```bash
# Check A record
dig beaconindex.com.au

# Check CNAME record
dig www.beaconindex.com.au

# Check nameservers
dig NS beaconindex.com.au
```

## Troubleshooting

- **Certificate not generating?** Ensure DNS records are correct and propagated (use `dig` to verify)
- **Domain not resolving?** Wait for DNS propagation (can take up to 48 hours)
- **SSL errors?** Vercel will automatically retry certificate generation once DNS is correct

## Current Status

- ✅ Site code ready
- ✅ PowerPoint file in `public/` folder
- ⏳ Awaiting deployment to Vercel
- ⏳ Awaiting DNS configuration
