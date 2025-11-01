# 🩸 Atria

Atria is a smart blood donation platform designed to connect **donors, recipients, and hospitals** quickly and securely.  
It simplifies the donation process, promotes awareness, and ensures timely access to life-saving blood units.

## ❤️ Key Features

- **Real-Time Donor Matching** – Instantly find compatible donors based on blood type and location.  
- **Hospital Coordination** – Verified hospitals can request and manage blood donations securely.  
- **Donor Dashboard** – Track donation history, eligibility, and upcoming drives.  
- **Urgent Request Alerts** – Get notified of nearby urgent cases needing immediate help.  
- **Secure Authentication** – Role-based access for donors, recipients, and hospital admins.  
- **Location-Based Search** – Use geolocation to find donors or blood banks nearby.  
- **Responsive Design** – Accessible and user-friendly on all devices.  

---

## 🧠 Tech Stack

- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Vercel / Render

---

## 🚀 Getting Started

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Configure environment:**
   - Create `backend/.env` with:
     ```env
     PORT=5001
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_secret_key
     ```

3. **Start development servers:**
   ```bash
   # Terminal 1: Backend
   cd backend && node index.js
   
   # Terminal 2: Frontend
   npm run dev
   ```

4. **Access the app:**
   - Local: `http://localhost:5173`
   - Network: Vite shows your network IP (e.g., `http://192.168.x.x:5173`)

### Production Deployment

**Important:** Set `FRONTEND_URL` in your production environment:
```env
FRONTEND_URL=https://yourdomain.com
```

This ensures QR codes point to your deployed website instead of localhost.

