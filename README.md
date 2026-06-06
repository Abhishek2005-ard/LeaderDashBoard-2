# Smart Leads CRM

A MERN stack Lead Management CRM built with TypeScript, featuring user authentication, statistics dashboard, search, and CSV export.

## Features

- **Lead Fields**: Tracks Name, Email, Phone, Company, Status (New, Contacted, Qualified, Lost), Source, and detailed notes.
- **Data Isolation**: All operations are scoped strictly to the authenticated user ID (`createdBy`). Users can only view, edit, or search their own leads.
- **Statistics Dashboard**: Real-time counters showing total leads, statuses breakdown, and lead conversion rates.
- **Debounced Search**: Search bar searches by name, email, phone, and company using a debounced React hook to optimize API calls.
- **CSV Export**: Clean download of lead reports with escaped text mappings to prevent injection or broken CSV formatting.
- **Graceful Port Failover**: If the preferred port (5000/5173) is busy, both frontend and backend automatically attempt to start on the next sequential port.
- **Dynamic CORS**: Accepts any localhost port origin in development to prevent CORS blocking during port collisions.

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS/Vite
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Database**: MongoDB (Atlas or Local)

## Directory Structure

```text
├── backend
│   ├── src
│   │   ├── config       # DB Connection
│   │   ├── controllers  # Request handling logic
│   │   ├── middlewares  # Auth & error helpers
│   │   ├── models       # Mongoose schemas
│   │   ├── types        # Global TypeScript interfaces
│   │   ├── utils        # CSV helper, custom error class
│   │   └── app.ts       # Express app configuration
│   └── package.json
└── frontend
    ├── src
    │   ├── api          # Axios service calls
    │   ├── components   # Form, table, details components
    │   ├── pages        # Login, Register, Dashboard views
    │   └── App.tsx      # Routing and application entry
    └── package.json
```

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Configuration
1. Navigate to the `backend` directory.
2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Set your variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/crm
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

### 2. Frontend Configuration
1. Navigate to the `frontend` directory.
2. Create a `.env` file:
   ```bash
   VITE_API_URL=http://localhost:5000
   ```
3. Install dependencies and start the client:
   ```bash
   npm install
   npm run dev
   ```

---

## Docker Compose Setup
To run the frontend, backend, and a local MongoDB instance concurrently using Docker:

```bash
docker compose up --build
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Local DB**: mongodb://localhost:27017/leaderboard
