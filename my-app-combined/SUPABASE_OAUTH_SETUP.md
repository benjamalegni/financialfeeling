# Supabase OAuth Setup Guide

## Problem: OAuth redirecting to localhost:3000

The issue is that OAuth is redirecting to `localhost:3000` instead of the production URL. This happens because:

1. **Supabase OAuth configuration is not updated with production URLs**
2. **The redirectTo parameter might not be respected**

## Solution: Update Supabase OAuth Configuration

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `yhxdyndkdhhnuginaekn`

### Step 2: Configure Authentication Settings
1. Go to **Authentication** → **Settings**
2. Scroll down to **URL Configuration**
3. Update the following URLs:

#### Site URL:
```
https://benjamalegni.github.io
```

#### Redirect URLs:
```
https://benjamalegni.github.io/financialfeeling/auth/callback
https://benjamalegni.github.io/financialfeeling
https://benjamalegni.github.io/financialfeeling/
```

### Step 3: Configure Google OAuth Provider
1. Go to **Authentication** → **Providers**
2. Find **Google** and click **Configure**
3. Update the **Redirect URL** to:
```
https://benjamalegni.github.io/financialfeeling/auth/callback
```

### Step 4: Configure GitHub OAuth Provider
1. Go to **Authentication** → **Providers**
2. Find **GitHub** and click **Configure**
3. Update the **Redirect URL** to:
```
https://benjamalegni.github.io/financialfeeling/auth/callback
```

### Step 5: Update Google Cloud Console (if using Google OAuth)
1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Add to **Authorized redirect URIs**:
```
https://benjamalegni.github.io/financialfeeling/auth/callback
```

### Step 6: Update GitHub OAuth App (if using GitHub OAuth)
1. Go to https://github.com/settings/developers
2. Find your OAuth App
3. Update **Authorization callback URL** to:
```
https://benjamalegni.github.io/financialfeeling/auth/callback
```

## Testing the Fix

After updating the configuration:

1. **Clear browser cache and cookies**
2. **Try OAuth again**
3. **Check browser console for logs**
4. **Verify redirect goes to correct URL**

## Debug Information

The updated code includes:
- Better error logging
- OAuth parameter checking
- Improved callback handling
- Console logs for debugging

## Current OAuth URLs in Code

- **Google OAuth**: `https://benjamalegni.github.io/financialfeeling/auth/callback`
- **GitHub OAuth**: `https://benjamalegni.github.io/financialfeeling/auth/callback`
- **Callback Page**: `/financialfeeling/auth/callback`

## Important Notes

1. **Supabase configuration must match the URLs in the code**
2. **Google Cloud Console must have the correct redirect URI**
3. **GitHub OAuth App must have the correct callback URL**
4. **All URLs must use HTTPS in production**
5. **The callback page handles the OAuth response and redirects to the main app**

## Troubleshooting

If OAuth still redirects to localhost:
1. Check Supabase dashboard configuration
2. Verify Google Cloud Console settings
3. Check GitHub OAuth App settings
4. Clear browser cache
5. Check browser console for errors 