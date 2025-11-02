# Twilio OTP Setup Guide

This guide explains how to configure Twilio for SMS OTP verification in the Atria application.

## Step 1: Create a Twilio Account

1. Visit [Twilio](https://www.twilio.com/)
2. Sign up for a free account (trial account works for testing)
3. Verify your email address

## Step 2: Get Twilio Credentials

1. Log in to your Twilio Console
2. Navigate to the Dashboard
3. You'll find your credentials:
   - **Account SID** (e.g., `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** (click "View" to reveal)

## Step 3: Get a Twilio Phone Number

1. In Twilio Console, go to **Phone Numbers** > **Manage** > **Buy a number**
2. For India, search for phone numbers with country code **+91**
3. Select and purchase a phone number (free trial accounts can use trial numbers)

**Note:** Trial accounts can only send SMS to verified phone numbers. To send to any number:
- Upgrade your Twilio account, OR
- Verify the phone numbers you want to test with in the Twilio Console

## Step 4: Configure Environment Variables

Add the following to your `backend/.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
```

**Important:**
- Replace `your_account_sid_here` with your actual Account SID
- Replace `your_auth_token_here` with your actual Auth Token
- Replace `+91XXXXXXXXXX` with your Twilio phone number (include country code)

## Step 5: Install Dependencies

The Twilio SDK is already added to `package.json`. Install it:

```bash
cd backend
npm install
```

## Step 6: Test the Integration

1. Start your backend server:
   ```bash
   npm start
   ```

2. Use the registration form and enter a phone number
3. Click "Send OTP"
4. Check the phone for the OTP message

## Troubleshooting

### Issue: "Invalid phone number format"
- **Solution:** Ensure phone numbers are 10 digits (without country code)
- The service automatically adds +91 for India

### Issue: "Phone number is unverified"
- **Solution:** If using a Twilio trial account, you must verify the recipient phone numbers in Twilio Console
- Go to **Phone Numbers** > **Verified Caller IDs** > **Add a new number**
- OR upgrade to a paid Twilio account

### Issue: "Invalid phone number"
- **Solution:** Check that `TWILIO_PHONE_NUMBER` in `.env` includes the country code (+91)
- Format should be: `+91XXXXXXXXXX`

### Issue: OTP not received
- **Solution:** 
  - Check Twilio Console > Logs for error messages
  - Verify your Twilio credentials are correct
  - Check if your Twilio account has sufficient balance (for paid accounts)
  - For trial accounts, verify the recipient number in Twilio Console

## OTP Behavior

- **OTP Length:** 6 digits
- **Expiration:** 5 minutes
- **Max Attempts:** 5 attempts per OTP
- **Format:** Numeric only

## Production Considerations

1. **Use Redis for OTP Storage:** Currently using in-memory storage. For production, use Redis:
   - More scalable
   - Survives server restarts
   - Better for distributed systems

2. **Rate Limiting:** Implement rate limiting to prevent abuse:
   - Limit OTP requests per phone number
   - Limit OTP requests per IP address

3. **Error Handling:** Add more sophisticated error handling for production

4. **Logging:** Add comprehensive logging for OTP send/verify operations

## Current Implementation

- ✅ Twilio SMS integration
- ✅ 6-digit OTP generation
- ✅ 5-minute expiration
- ✅ 5 attempt limit
- ✅ Automatic cleanup of expired OTPs
- ✅ Integration with all registration forms (Donor, Blood Bank, Hospital)

## Next Steps

1. Add Twilio credentials to `.env`
2. Test with a verified phone number (or upgrade Twilio account)
3. Deploy and test in production
4. Monitor Twilio usage and costs

For more information, visit: https://www.twilio.com/docs/sms

