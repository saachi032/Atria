# API Setu Integration Setup Guide

This guide explains how to configure API Setu to fetch real-time data from e-RaktKosh instead of using simulated data.

## Step 1: Register on API Setu Portal

1. Visit the [API Setu Partner Portal](https://partners.apisetu.gov.in/signup)
2. Sign up using your DigiLocker - MeriPehchaan credentials
3. Complete the registration process

## Step 2: Subscribe to e-RaktKosh API

1. Log in to the API Setu portal
2. Navigate to the API Directory
3. Search for "e-RaktKosh" or "blood bank"
4. Select the relevant APIs that provide:
   - Blood centres statistics
   - Today's blood availability
   - Statewise statistics
5. Click "Subscribe" and wait for approval from the API publisher

## Step 3: Obtain API Credentials

Once approved, you'll receive:
- **API Key** (X-API-Key header) OR
- **Access Token** (Bearer token in Authorization header)

## Step 4: Configure Environment Variables

Add the following to your `backend/.env` file:

```env
# API Setu Configuration
API_SETU_BASE_URL=https://api.setu.gov.in
API_SETU_API_KEY=your_api_key_here
# OR
API_SETU_ACCESS_TOKEN=your_access_token_here
```

**Note:** You only need to set either `API_SETU_API_KEY` or `API_SETU_ACCESS_TOKEN`, not both.

## Step 5: Update API Endpoints (if needed)

The current implementation uses placeholder endpoints. Once you have API Setu access, you'll need to update the endpoints in `backend/api/apiSetuService.js`:

```javascript
// Current placeholder endpoints (update these based on actual API Setu documentation):
// - /eraktkosh/blood-bank/statistics
// - /eraktkosh/blood-bank/today-availability
// - /eraktkosh/blood-bank/statewise-statistics
```

Refer to the API Setu documentation for the actual endpoint paths.

## Step 6: Update Data Transformation (if needed)

The API Setu response format may differ from your dashboard's expected format. Update the `transformApiSetuStatsData()` function in `backend/api/apiSetuService.js` to match the actual API Setu response structure.

## Step 7: Test the Integration

1. Restart your backend server
2. Check the console logs - you should see messages indicating whether API Setu is being used or if it's falling back to simulated data
3. The response will include a `source` field indicating `"api-setu"` or `"simulated"`

## Fallback Behavior

If API Setu credentials are not configured or if the API calls fail, the system will automatically fall back to simulated data. This ensures your dashboard always displays data, even without API Setu access.

## Troubleshooting

- **"API Setu credentials not configured"**: Add credentials to `.env` file
- **"API Setu request failed"**: Check your API credentials and endpoint URLs
- **Data not displaying**: Check the browser console and backend logs for errors
- **Wrong data format**: Update the `transformApiSetuStatsData()` function to match API Setu's response format

## Current Status

- ✅ API Setu integration structure is ready
- ⏳ Waiting for API Setu credentials and endpoint documentation
- ⏳ Data transformation function needs to be customized based on actual API response

Once you have the API Setu credentials and endpoint documentation, update the endpoints and transformation logic accordingly.

