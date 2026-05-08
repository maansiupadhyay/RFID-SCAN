# RFID Tracking System API Documentation

**Base URL:** `http://localhost:5000/api`

## Authentication

### Register User
`POST /auth/register`
- **Body:** `{ name, email, password, role? }`
- **Response:** `201 Created` with user data and JWT token.

### Login
`POST /auth/login`
- **Body:** `{ email, password }`
- **Response:** `200 OK` with user data and JWT token.

---

## Tool Management (Protected)

### List Tools
`GET /tools`
- **Query Params:** `page`, `limit`, `search`, `status`, `category`
- **Response:** List of tools with pagination metadata.

### Get Tool by ID
`GET /tools/:id`

### Create Tool (Admin Only)
`POST /tools`
- **Body:** `{ toolCode, name, category, location? }`

---

## Transactions (Protected)

### Issue Tool
`POST /transactions/issue`
- **Body:** `{ toolCode, issuedTo, remarks? }`
- **Logic:** Validates availability and marks tool as `ISSUED`.

### Return Tool
`POST /transactions/return`
- **Body:** `{ toolCode, remarks? }`
- **Logic:** Marks tool as `AVAILABLE`.

### Transaction History
`GET /transactions/history`

---

## RFID Scanning (Protected)

### Perform Batch Scan
`POST /scans/scan`
- **Body:** `{ scannedIds: string[] }`
- **Logic:** Compares scanned codes against DB. Returns matched, missing, and extra tools. Updates missing tools to `MISSING` status.

### Scan History
`GET /scans/history`

---

## Dashboard (Protected)

### Get Statistics
`GET /dashboard/stats`
- **Response:** Counts for total, available, issued, and missing tools + recent activity.
