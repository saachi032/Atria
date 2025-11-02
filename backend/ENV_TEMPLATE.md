# Environment Variables Template

Copy this template to create your `.env` file in the `backend/` directory.

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5001
FRONTEND_URL=http://localhost:5173

# ============================================
# MONGODB CONFIGURATION
# ============================================
MONGO_URI=mongodb+srv://atriauser:ATRIAUSER123@atriaapp.6ajk8y5.mongodb.net/?appName=AtriaApp

# ============================================
# JWT SECRET
# ============================================
# Change this to a secure random string in production
JWT_SECRET=mysecretkey123

# ============================================
# TWILIO CONFIGURATION (Required for OTP SMS)
# ============================================
# Get these from: https://console.twilio.com/
# 
# 1. Account SID - Found on Twilio Console Dashboard
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 2. Auth Token - Found on Twilio Console Dashboard (click "View" to reveal)
TWILIO_AUTH_TOKEN=your_auth_token_here

# 3. Twilio Phone Number - Your purchased Twilio phone number (include country code)
# Format: +91XXXXXXXXXX (for India)
# Example: +919876543210
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX

# ============================================
# API SETU CONFIGURATION (Optional)
# ============================================
# For real-time blood bank data from e-RaktKosh
# API_SETU_BASE_URL=https://api.setu.gov.in
# API_SETU_API_KEY=your_api_key_here
# API_SETU_ACCESS_TOKEN=your_access_token_here
```

## How to Get Twilio Credentials

1. **Sign up/Log in** at https://www.twilio.com/
2. **Go to Console Dashboard** at https://console.twilio.com/
3. **Find Account SID** - It's displayed on the dashboard (starts with `AC`)
4. **Find Auth Token** - Click "View" next to Auth Token to reveal it
5. **Get Phone Number** - Go to Phone Numbers > Manage > Buy a number (or use existing)
   - For India, search for numbers with country code +91
   - Copy the full number including +91

## Quick Setup

1. Copy the template above
2. Create a file named `.env` in the `backend/` folder
3. Paste the template
4. Replace all placeholder values with your actual credentials
5. Save the file

## Important Notes

- **Never commit `.env` file to Git** - It contains sensitive information
- **TWILIO_PHONE_NUMBER** must include country code (e.g., `+91XXXXXXXXXX` for India)
- For **Twilio Trial Accounts**: You can only send SMS to verified phone numbers
- To send to any number, verify the number in Twilio Console or upgrade your account

