# Deploy to Vercel

## Quick Start

1. **Install Vercel CLI** (optional, but recommended):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from CLI**:
   ```bash
   cd my-app-combined
   vercel
   ```

3. **Or use Vercel Dashboard**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

## Configuration

### Build Settings (Auto-detected)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Root Directory**: `my-app-combined`

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Alpha Vantage API
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

## Custom Domain

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add `www.financialfeeling.com` and `financialfeeling.com`
4. Update your DNS records as instructed by Vercel

### DNS Configuration
Add these records in your domain registrar:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

## API Routes

✅ **API Routes work automatically** on Vercel
- `/api/analyze-stocks` → Serverless Function
- ffback integration will work without changes
- No CORS issues

## Advantages over GitHub Pages

- ✅ API Routes work (serverless functions)
- ✅ Server-side rendering (SSR)
- ✅ Automatic HTTPS
- ✅ Edge network (fast globally)
- ✅ Preview deployments for PRs
- ✅ Analytics included
- ✅ Zero configuration

## Deployment Flow

```bash
# Development
npm run dev

# Test production build locally
npm run build
npm run start

# Deploy to Vercel
vercel --prod
```

## Automatic Deployments

Once connected to GitHub:
- Push to `main` → Automatic production deploy
- Push to other branches → Preview deployment
- Pull requests → Preview URL in PR

## Troubleshooting

### Build fails
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set
- Test `npm run build` locally first

### API Routes not working
- Verify Next.js API routes are in `app/api/` directory
- Check serverless function logs in Vercel Dashboard
- API Routes timeout after 10s on free tier (30s on our config)

### ffback issues
- Increase memory limit in vercel.json if needed
- Check if models are downloading correctly
- Monitor function execution time

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: support@vercel.com

