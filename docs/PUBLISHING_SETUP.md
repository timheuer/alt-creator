# Automated Publishing Setup

This guide explains how to set up automated publishing to Chrome Web Store and Microsoft Edge Add-ons using GitHub Actions.

## Overview

The workflow at `.github/workflows/publish.yml` will:
1. Build the extension ZIP package
2. Publish to Chrome Web Store
3. Publish to Edge Add-ons

**Triggers:**
- Automatically when you create a GitHub Release
- Manually via "Run workflow" button in Actions tab

---

## Chrome Web Store Setup

### Step 1: Get Your Extension ID

After your extension is published, find it at:
```
https://chrome.google.com/webstore/detail/alt-text-creator/[EXTENSION_ID]
```

The extension ID is the long string at the end of the URL.

### Step 2: Create Google Cloud Project & OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Chrome Web Store API**:
   - Go to APIs & Services → Library
   - Search for "Chrome Web Store API"
   - Click Enable

4. Create OAuth credentials:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Desktop app**
   - Name: "GitHub Actions Publisher"
   - Click Create
   - Download or copy the **Client ID** and **Client Secret**

5. Configure OAuth consent screen:
   - Go to APIs & Services → OAuth consent screen
   - User Type: External
   - Add your email as a test user

### Step 3: Get Refresh Token

1. Open this URL in your browser (replace `YOUR_CLIENT_ID`):
   ```
   https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob
   ```

2. Sign in and authorize the app
3. Copy the authorization code shown
4. Exchange it for a refresh token:
   ```bash
   curl -X POST "https://oauth2.googleapis.com/token" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=YOUR_AUTH_CODE" \
     -d "grant_type=authorization_code" \
     -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
   ```
5. Copy the `refresh_token` from the response

### Step 4: Add GitHub Secrets

Go to your repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name | Value |
|-------------|-------|
| `CHROME_EXTENSION_ID` | Your extension ID from the store URL |
| `CHROME_CLIENT_ID` | OAuth Client ID from Google Cloud |
| `CHROME_CLIENT_SECRET` | OAuth Client Secret from Google Cloud |
| `CHROME_REFRESH_TOKEN` | Refresh token from Step 3 |

---

## Microsoft Edge Add-ons Setup

### Step 1: Get Your Product ID

After your extension is published, find it in Partner Center:
- Go to [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
- Click on your extension
- The Product ID is in the URL or extension details

### Step 2: Create API Credentials

1. In Partner Center, go to **Settings** (gear icon) → **Developer settings**
2. Click **API credentials** → **Create new credentials**
3. Note down:
   - **Client ID**
   - **Client Secret** (shown only once!)
   - **Access Token URL** (usually `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`)

### Step 3: Add GitHub Secrets

| Secret Name | Value |
|-------------|-------|
| `EDGE_PRODUCT_ID` | Your extension's Product ID |
| `EDGE_CLIENT_ID` | API Client ID from Partner Center |
| `EDGE_CLIENT_SECRET` | API Client Secret from Partner Center |
| `EDGE_ACCESS_TOKEN_URL` | The token URL from Partner Center |

---

## Publishing a New Version

### Option 1: Create a GitHub Release (Recommended)

1. Update `version` in `manifest.json`
2. Commit and push
3. Go to GitHub → Releases → "Create a new release"
4. Tag: `v1.0.1` (match your manifest version)
5. Publish release → workflow runs automatically

### Option 2: Manual Trigger

1. Go to Actions tab
2. Select "Publish Extension" workflow
3. Click "Run workflow"
4. Optionally enter a version
5. Click "Run workflow"

---

## Troubleshooting

### Chrome Web Store Errors

- **401 Unauthorized**: Check your refresh token is valid
- **403 Forbidden**: Ensure Chrome Web Store API is enabled
- **Upload failed**: Version must be higher than current published version

### Edge Add-ons Errors

- **Authentication failed**: Regenerate API credentials in Partner Center
- **Product not found**: Verify Product ID is correct
- **Submission failed**: Check Partner Center for detailed error

### Common Issues

1. **Version not bumped**: Both stores require a higher version number for updates
2. **Secrets not set**: Verify all secrets are added in repo settings
3. **API not enabled**: For Chrome, ensure the Chrome Web Store API is enabled

---

## Security Notes

- Never commit API credentials to the repository
- Use GitHub Secrets for all sensitive values
- Rotate credentials periodically
- Chrome refresh tokens don't expire but can be revoked
- Edge credentials may expire - check Partner Center for validity
