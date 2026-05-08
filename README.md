# RFID Tool Tracking & Inventory Management System

A full-stack enterprise-level RFID inventory platform designed for industrial environments. Features include real-time tool tracking, automated issue/return workflows, and a sophisticated RFID scan simulator for inventory audits.

## 🚀 Key Features
- **Modern Enterprise UI:** Clean, technology-focused design built with React.
- **RFID Scan Simulator:** Compare batch scanned IDs against database inventory to identify missing or extra tools.
- **Scalable Backend:** Modular Node.js/Express architecture using TypeScript and Prisma ORM.
- **Secure Authentication:** JWT-based auth with role-based access control (Admin/Operator).
- **Analytics Dashboard:** Real-time visibility into inventory health and recent activities.
- **Normalized MySQL Schema:** Efficient data management with Transactions and Scan History logs.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Framer Motion, Lucide Icons, Recharts, Axios.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM.
- **Database:** MySQL.
- **Validation:** Zod.
- **Security:** bcryptjs, JSON Web Tokens.

---

## ⚙️ Setup Instructions

### 1. Database Setup
1. Ensure you have a MySQL server running.
2. Create a database named `rfid_tracking`.
3. Update the `DATABASE_URL` in `backend/.env`.

### 2. Backend Configuration
1. Navigate to `backend/` directory.
2. Run `npm install` to install dependencies.
3. Run `npx prisma migrate dev --name init` to create tables.
4. Run `npm run prisma:seed` to populate the database with sample data.
5. Start the server with `npm run dev`.

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
