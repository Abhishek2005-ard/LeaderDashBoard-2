# 🚀 Smart Leads Dashboard (Lead Management System)

A production-ready, highly aesthetic Lead Management and Analytics platform built using the MERN stack with TypeScript. Every user enjoys complete multi-tenant style data isolation, secure authentication, and real-time visual analytics.

---

## ⚡ Quick Start: Spin Up Containerized Services

We provide a complete containerized architecture (Frontend, Backend, and MongoDB) utilizing Docker and Compose. Named volumes keep database records fully persistent, and host directories are bind-mounted directly into the container workspace to support **hot module replacement (HMR)** and backend **hot-reloading** during development.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 🏃 Setup Commands

1. **Spin Up the Containers**:
   ```bash
   docker compose up --build
   ```
   *This command will build the frontend and backend images, pull MongoDB, wire up the internal network, and mount your local code folders with hot-reloading active.*

2. **Access the Application**:
   - **Frontend App**: `http://localhost:5173`
   - **Backend REST API**: `http://localhost:5000/api/v1`
   - **Local MongoDB Database**: `mongodb://localhost:27017/leaderboard`

3. **Shutdown Services**:
   ```bash
   docker compose down
   ```
   *To completely remove container states but keep your persistent database volume.*

---

## 🏗️ Core Architecture Overview

### 🔒 User-Specific Multi-Tenant Isolation
Every single database query or mutation in the backend is scoped strictly to the currently authenticated user session (`req.user._id` extracted from standard JWT tokens in Bearer headers):
- **Leads Isolation**: Users (regardless of whether they are `Admin` or `Sales User`) can only see, search, edit, update, export, and delete leads they created.
- **IDs Hardening**: The controller prevents accessing or deleting another tenant's lead by ID, returning a secure `404 Not Found or unauthorized access` block.
- **Dynamic Stats**: The dashboard stats endpoint (`GET /api/v1/leads/stats`) leverages MongoDB Aggregation (`$match`, `$group`, and `$cond`) to compute metrics for the active session only.

### 📊 Real-Time Analytics Cards Grid
The dashboard features an aesthetic 4-card KPI grid dynamically linked to your lead statuses:
1. **Total Leads**: Solid slate accent showing all leads created by your account.
2. **New Leads**: Sky-blue accents highlighting incoming, uncontacted prospects.
3. **Contacted Leads**: Warm amber accents showing active, in-progress prospects.
4. **Qualified Leads**: Emerald-green accents calculating the active **Conversion Rate** (`Qualified / Total * 100`) dynamically inside a high-contrast pill badge.

### 🔍 Debounced Search Filter
The search bar implements a custom React hook `useDebounce.ts` with a **500ms delay**. This buffers your keyboard typing, preventing rapid and redundant API fetches, and only fires the fuzzy query matching when you stop typing.

### 📥 Isolated CSV Data Export
Clicking **Export CSV** triggers an isolated backend dataset download (`exportLeadsCSV` in `leadService.ts`). The system compiles matching records into clean tabular CSV columns without leaking metadata from other accounts.

---

## 🛠️ Technology Stack
- **Frontend**: React (v19), TypeScript, Vite (v8), Tailwind CSS (v4), Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript, Mongoose/MongoDB, JSON Web Tokens (JWT), BcryptJS
- **Containerization**: Docker, Docker Compose, Nginx (high-performance client SPA serving)
