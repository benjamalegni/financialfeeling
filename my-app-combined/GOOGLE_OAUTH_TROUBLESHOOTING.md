# Google OAuth Troubleshooting Guide

## Error: "Provider not enabled"

### Solution:
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Save the configuration

## Error: "Invalid redirect URI"

### Solution:
1. In **Google Cloud Console**:
   - Go to **APIs & Services** → **Credentials**
   - Edit your OAuth 2.0 Client ID
   - Add these authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     http://localhost:54321/auth/v1/callback
     https://your-domain.com/auth/callback
     http://localhost:3000/auth/callback
     ```

2. In **Supabase Dashboard**:
   - Go to **Authentication** → **URL Configuration**
   - Add your site URL and redirect URLs

## Error: "Client ID not found"

### Solution:
1. Verify your Google OAuth credentials in Supabase
2. Make sure you're using the correct Client ID and Secret
3. Check that the credentials are for a "Web application" type

## Testing Steps

### 1. Check Console Logs
Open browser developer tools and check for errors when clicking "Sign In with Google"

### 2. Verify Supabase Configuration
```bash
# Check if Google provider is enabled
curl -X GET "https://your-project-ref.supabase.co/auth/v1/providers" \
  -H "apikey: your-anon-key"
```

### 3. Test with Different Browser
Try in incognito/private mode to rule out cache issues

## Common Configuration Issues

### 1. Wrong OAuth Client Type
- Make sure you created a "Web application" OAuth client
- Not "Android", "iOS", or "Desktop app"

### 2. Missing APIs
- Enable Google+ API in Google Cloud Console
- Enable Google Identity API

### 3. Domain Verification
- Add your domain to authorized domains in Google Cloud Console
- Verify domain ownership if required

## Quick Fix Checklist

- [ ] Google OAuth provider enabled in Supabase
- [ ] Correct Client ID and Secret entered
- [ ] Redirect URIs configured in Google Cloud Console
- [ ] Site URL configured in Supabase
- [ ] Testing in incognito mode
- [ ] No browser extensions blocking OAuth

## Emergency Fallback

If Google OAuth continues to fail, users can still:
1. Sign up with email/password
2. Sign in with GitHub (if configured)
3. Contact support for manual account creation 