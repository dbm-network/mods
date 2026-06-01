# IP Login Implementation for nt/nt2 Dashboard

## Current Situation

The `nt` and `nt2` projects use a DBM (Discord Bot Maker) dashboard extension that handles Discord OAuth via Passport.js. Currently, when logging in via IP address, users are redirected to the domain after OAuth callback.

## Solution: JWT Token Authentication for IP Access

Similar to the `webhook.newstargeted.com` implementation, we need to:

1. **Detect IP access** in OAuth initiation
2. **Store original IP host** in OAuth state parameter
3. **Generate JWT token** after successful OAuth (for IP access)
4. **Redirect to IP with JWT token** (instead of using session cookies)
5. **Update auth middleware** to validate JWT tokens for IP access

## Implementation Steps

### 1. Modify OAuth Callback URL Resolution

The dashboard extension uses `Dashboard.resolveCallbackURL(req)` to determine the callback URL. We need to:

- Check if request is from IP address
- If IP, use fixed domain callback URL (like `https://dashboard.newstargeted.com/nt2/dashboard/callback`)
- Store original IP in OAuth state parameter: `state=ip_http://207.180.193.210:3002`

### 2. Modify OAuth Callback Handler

In the callback handler (`/dashboard/callback`):

- Extract `originalHost` from OAuth state parameter
- If `originalHost` exists (IP access):
  - Generate JWT token with user info
  - Redirect to: `${originalHost}/dashboard/@me?token=<jwt_token>`
- If no `originalHost` (domain access):
  - Use session cookie (current behavior)
  - Redirect to: `/dashboard/@me`

### 3. Update Auth Middleware

Modify `auth-middleware.js` to support JWT tokens:

```javascript
async requireAuth(req, res, next) {
    const host = req.get('host') || req.headers.host;
    const isIpAccess = host && host.match(/^\d+\.\d+\.\d+\.\d+/);
    
    // For IP access: Check JWT token
    if (isIpAccess) {
        const token = req.query.token || (req.headers.authorization?.startsWith('Bearer ') 
            ? req.headers.authorization.substring(7) 
            : null);
        
        if (token) {
            try {
                const jwtSecret = Dashboard.settings.tokenSecret || 'v6j0h8heam';
                const decoded = jwt.verify(token, jwtSecret);
                
                // Attach user info to request
                req.user = {
                    id: decoded.userId,
                    username: decoded.username,
                    discriminator: decoded.discriminator,
                    avatar: decoded.avatar,
                    role: decoded.role || 'user'
                };
                req.loggedIn = true;
                req.authMethod = 'jwt';
                
                return next();
            } catch (jwtError) {
                // Invalid token, fall through to redirect
            }
        }
        
        // No valid JWT token for IP access
        const loginUrl = `http://${host}/dashboard/login`;
        return res.redirect(loginUrl);
    }
    
    // For domain access: Use existing session cookie logic
    // ... existing code ...
}
```

### 4. Install Dependencies

Ensure `jsonwebtoken` is installed:

```bash
cd /home/newstargeted.com/dashboard.newstargeted.com/nt2/extensions/dashboard_EXT
npm install jsonwebtoken
```

## Notes

- The dashboard extension might be a compiled/third-party module, so we may need to:
  1. Create wrapper middleware that intercepts requests
  2. Modify the extension's source code directly (if available)
  3. Use DBM action mods to hook into the OAuth flow

- Current callback URLs in `config.json` include:
  - `http://207.180.193.210:3002/dashboard/callback`
  - `https://207.180.193.210:3002/dashboard/callback`
  - Domain URLs

- The dashboard extension likely uses Passport.js's Discord strategy with dynamic callback URL resolution

## Testing

After implementation:

1. Visit: `http://207.180.193.210:3002/dashboard/login`
2. Click "Login with Discord"
3. Authorize on Discord
4. Should redirect to: `http://207.180.193.210:3002/dashboard/@me?token=<jwt_token>`
5. Dashboard should load with user authenticated ✅

