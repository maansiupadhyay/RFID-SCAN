# RFID Tool Tracking & Inventory Management System

A full-stack enterprise-level RFID inventory platform designed for industrial environments. Features include real-time tool tracking, automated issue/return workflows, and a sophisticated RFID scan simulator for inventory audits.

## 🚀 Key Features
- **Modern Enterprise UI:** Clean, technology-focused design built with React.
- **RFID Scan Simulator:** Compare batch scanned IDs against database inventory to identify missing or extra tools.
- **Modular Backend:** Node.js/Express with TypeScript and direct MySQL access (`mysql2`).
- **Secure Authentication:** JWT-based auth with role-based access control (Admin/Operator).
- **Analytics Dashboard:** Real-time visibility into inventory health and recent activities.
- **Normalized MySQL Schema:** Efficient data management with Transactions and Scan History logs.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Framer Motion, Lucide Icons, Recharts, Axios.
- **Backend:** Node.js, Express, TypeScript, MySQL (`mysql2`).
- **Database:** MySQL.
- **Validation:** Zod.
- **Security:** bcryptjs, JSON Web Tokens.

---

## ⚙️ Setup Instructions

### 1. Database Setup
1. Ensure MySQL is running.
2. In `backend/.env`, set `DATABASE_URL` (must include the database name at the end), e.g. `mysql://USER:PASSWORD@127.0.0.1:3306/rfid_tracking`. You **do not** need to create the database manually — the next step does it.

### 2. Backend Configuration
1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Run **`npm run db:seed`** — this creates the database from `DATABASE_URL` if needed, applies `db/schema.sql`, and loads sample data.
4. Start the server with `npm run dev`.

*(Optional)* To apply only the SQL schema by hand instead: create the database, then `mysql -u root -p rfid_tracking < backend/db/schema.sql`.

**Backend .env Template:**
```env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/rfid_tracking"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

### 3. Frontend Configuration
1. Navigate to `frontend/` directory.
2. Run `npm install`.
3. Start the development server with `npm run dev`.
4. Access the application at `http://localhost:5173`.

---

## 👤 Sample Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@rfid.com | password123 |
| **Operator** | operator@rfid.com | password123 |

---

## 📖 API Documentation
Full API documentation can be found in `docs/API_DOCUMENTATION.md`.
A Postman collection is also available at `docs/postman_collection.json`.
