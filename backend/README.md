# Atria Backend

This is the Node.js + Express backend for the Atria App, using MongoDB and JWT auth.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in `backend/` with:
   ```env
   # Server Configuration
   PORT=5001
   FRONTEND_URL=http://localhost:5173

   # MongoDB Configuration
   MONGO_URI=mongodb+srv://atriauser:ATRIAUSER123@atriaapp.6ajk8y5.mongodb.net/?appName=AtriaApp

   # JWT Secret (change this to a secure random string in production)
   JWT_SECRET=mysecretkey123

   # Twilio Configuration for OTP SMS
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
   ```
   
   **Note:** You can also copy `.env.example` to `.env` and fill in your values.

3. Start the server:
   ```bash
   node index.js
   ```

## Features
- CORS enabled
- JSON parsing
- MongoDB with mongoose
- User registration (password hashed)
- JWT login/auth
- Modular ES import/export syntax
- Routes:
  - POST `/api/auth/register` - Register new donor
  - POST `/api/auth/login` - Login donor
  - GET `/api/auth/me` - Get current user profile
  - PUT `/api/auth/me` - Update user profile
  - GET `/api/auth/qr` - Generate donor QR code
  - GET `/api/auth/donor/:donorId` - Get donor info by ID (for health card)
