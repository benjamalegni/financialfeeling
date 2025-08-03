# Google OAuth Setup for Supabase

## Prerequisites
- Supabase project with authentication enabled
- Google Cloud Console account

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 1.2 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:54321/auth/v1/callback` (for local development)
5. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

### 2.1 Add Google Provider
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
5. Save the configuration

### 2.2 Configure Redirect URLs
In your Supabase project settings, add these redirect URLs:
- `https://your-domain.com/auth/callback`
- `http://localhost:3000/auth/callback` (for local development)

## Step 3: Test the Integration

### 3.1 Local Testing
1. Start your development server
2. Go to the login/signup page
3. Click "Sign In with Google"
4. Complete the Google OAuth flow

### 3.2 Production Testing
1. Deploy your application
2. Test the Google OAuth flow in production
3. Verify that users can sign in/sign up with Google

## Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"**: Make sure the redirect URI in Google Cloud Console matches your Supabase callback URL
2. **"Provider not enabled"**: Ensure Google provider is enabled in Supabase Authentication settings
3. **"Client ID not found"**: Verify that the Client ID and Secret are correctly entered in Supabase

### Debug Steps:
1. Check browser console for errors
2. Verify Supabase authentication logs
3. Test with a different Google account
4. Ensure your domain is authorized in Google Cloud Console

## Security Considerations

1. **Environment Variables**: Store Google OAuth credentials securely
2. **HTTPS Only**: Use HTTPS in production
3. **Domain Verification**: Verify your domain in Google Cloud Console
4. **Rate Limiting**: Monitor for abuse and implement rate limiting if needed

## Example Configuration

```typescript
// In your Supabase configuration
const supabase = createClient(
  'https://your-project-ref.supabase.co',
  'your-anon-key'
)

// Google OAuth call
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

## Next Steps

1. Test the integration thoroughly
2. Add error handling for OAuth failures
3. Implement user profile creation after OAuth signup
4. Add logout functionality
5. Consider adding other OAuth providers (GitHub, etc.) 