# 4321 Drive Backend — Walkthrough

## What Was Built

Complete Express + MongoDB backend for a multi-vendor vehicle rental broker platform with **52 source files** across a clean, modular architecture.

## Project Structure

```
src/
├── config/         env.js, db.js, constants.js
├── middleware/     auth.js, authorize.js, validate.js, rateLimiter.js, errorHandler.js
├── permissions/    permissions.js, rolePermissions.js
├── models/         User, Vendor, ParentVehicle, VehicleListing, InquiryLog
├── modules/
│   ├── auth/       login, refresh, logout, me
│   ├── users/      admin CRUD (super_admin only)
│   ├── vendors/    full CRUD + status + listings
│   ├── vehicles/   parent vehicle CRUD + display price + status
│   ├── listings/   child listing CRUD + approve/reject workflow
│   ├── inquiries/  WhatsApp click logging + summary
│   ├── imports/    CSV upload with dedup logic
│   └── public/     frontend-safe vehicle endpoints (no auth)
├── seeds/          seedSuperAdmin.js
├── utils/          asyncHandler, ApiError, ApiResponse, logger
├── app.js          Express setup with all middleware and routes
└── server.js       Entry point (DB + server start)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/health` | — | Health check |
| `POST` | `/api/v1/auth/login` | — | Login |
| `POST` | `/api/v1/auth/refresh` | — | Refresh token |
| `POST` | `/api/v1/auth/logout` | ✅ | Logout |
| `GET` | `/api/v1/auth/me` | ✅ | Current user |
| `POST/GET` | `/api/v1/users/admins` | ✅ | Admin CRUD |
| `GET/PATCH/DELETE` | `/api/v1/users/admins/:id` | ✅ | Admin by ID |
| `POST/GET` | `/api/v1/vendors` | ✅ | Vendor CRUD |
| `GET/PATCH` | `/api/v1/vendors/:id` | ✅ | Vendor by ID |
| `PATCH` | `/api/v1/vendors/:id/status` | ✅ | Vendor status |
| `GET` | `/api/v1/vendors/:id/listings` | ✅ | Vendor listings |
| `POST/GET` | `/api/v1/vehicles/parents` | ✅ | Parent vehicle CRUD |
| `GET/PATCH` | `/api/v1/vehicles/parents/:id` | ✅ | Parent by ID |
| `PATCH` | `/api/v1/vehicles/parents/:id/status` | ✅ | Vehicle status |
| `PATCH` | `/api/v1/vehicles/parents/:id/display-price` | ✅ | Display price |
| `POST/GET` | `/api/v1/vehicle-listings` | ✅ | Child listing CRUD |
| `GET/PATCH` | `/api/v1/vehicle-listings/:id` | ✅ | Listing by ID |
| `PATCH` | `/api/v1/vehicle-listings/:id/status` | ✅ | Listing status |
| `PATCH` | `/api/v1/vehicle-listings/:id/approve` | ✅ | Approve listing |
| `PATCH` | `/api/v1/vehicle-listings/:id/reject` | ✅ | Reject listing |
| `POST` | `/api/v1/inquiries/whatsapp-click` | — | Log inquiry (public) |
| `GET` | `/api/v1/inquiries` | ✅ | List inquiries |
| `GET` | `/api/v1/inquiries/summary` | ✅ | Inquiry summary |
| `POST` | `/api/v1/imports/vehicles/csv` | ✅ | CSV import |
| `GET` | `/api/v1/public/vehicles` | — | Public vehicle list |
| `GET` | `/api/v1/public/vehicles/:slug` | — | Public vehicle detail |

## Verification

- ✅ All 52 files created with no syntax errors
- ✅ [app.js](file:///c:/Desktop/4321-drive-backend/src/app.js) loads and initializes without import errors
- ✅ All dependencies installed successfully

## How to Run

1. **Fill in your [.env](file:///c:/Desktop/4321-drive-backend/.env)** — add your MongoDB URI, JWT secrets, CORS origin
2. **Seed super admin:** `npm run seed:super-admin`
3. **Start dev server:** `npm run dev`
4. **Test:** `GET http://localhost:5130/api/v1/health`
