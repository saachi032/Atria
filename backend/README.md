# Atria Backend

This is the Node.js + Express backend for the Atria App, using MongoDB and JWT auth.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in `backend/` with:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://atriauser:ATRIAUSER123@atriaapp.6ajk8y5.mongodb.net/?appName=AtriaApp
   JWT_SECRET=mysecretkey123
   FRONTEND_URL=http://localhost:5173
   ```

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
