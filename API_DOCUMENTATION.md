# 4321 Drive Backend — API Documentation

Base URL: `http://localhost:5130/api/v1`  

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

The access token is obtained from `/auth/login` or `/auth/register`.

---

## 🔓 Auth Module

### Register (Create Admin Account)

```
POST /auth/register
```

> ⚠️ No authentication required — use this to create your first admin account.

**Body:**

```json
{
  "full_name": "John Admin",
  "email": "john@4321drive.com",
  "password": "mypassword123",
  "phone": "+971501234567"       // optional
}
```

**Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "...",
      "full_name": "John Admin",
      "email": "john@4321drive.com",
      "role": "admin",
      "status": "active"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

---

### Login

```
POST /auth/login
```

> ⚠️ No authentication required.

**Body:**

```json
{
  "email": "john@4321drive.com",
  "password": "mypassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

---

### Refresh Token

```
POST /auth/refresh
```

> ⚠️ No authentication required — uses refresh token from body.

**Body:**

```json
{
  "refresh_token": "eyJhbG..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### Logout

```
POST /auth/logout
```

> 🔒 Requires Auth Token

**Headers:** `Authorization: Bearer <accessToken>`  
**Body:** None  

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User

```
GET /auth/me
```

> 🔒 Requires Auth Token

**Headers:** `Authorization: Bearer <accessToken>`  

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "full_name": "John Admin",
    "email": "john@4321drive.com",
    "role": "admin",
    "status": "active",
    "last_login_at": "2026-03-18T..."
  }
}
```

---

## 👤 Users Module

> 🔒 All endpoints require Auth Token

### Create Admin

```
POST /users/admins
```

**Body:**

```json
{
  "full_name": "New Admin",
  "email": "newadmin@4321drive.com",
  "password": "securepass123",
  "phone": "+971501234567",
  "status": "active"
}
```

---

### List Admins

```
GET /users/admins
```

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `status` | string | — | Filter: `active`, `inactive`, `suspended` |
| `search` | string | — | Search by name or email |

---

### Get Admin by ID

```
GET /users/admins/:id
```

---

### Update Admin

```
PATCH /users/admins/:id
```

**Body (all fields optional):**

```json
{
  "full_name": "Updated Name",
  "email": "newemail@4321drive.com",
  "password": "newpassword",
  "phone": "+971509876543",
  "status": "inactive"
}
```

---

### Delete Admin (Soft Delete)

```
DELETE /users/admins/:id
```

---

## 🏢 Vendors Module

> 🔒 All endpoints require Auth Token

### Create Vendor

```
POST /vendors
```

**Body:**

```json
{
  "vendor_type": "external_vendor",
  "company_name": "Premium Cars LLC",
  "garage_name": "Premium Garage",
  "contact_person_name": "Ahmed Ali",
  "contact_person_email": "ahmed@premiumcars.com",
  "contact_person_phone": "+971501111111",
  "whatsapp_number": "+971501111111",
  "company_phone": "+971041111111",
  "alternate_phone": "+971502222222",
  "address_line_1": "Dubai Marina",
  "address_line_2": "",
  "city": "Dubai",
  "country": "UAE",
  "trade_license_number": "TL-12345",
  "tax_number": "VAT-67890",
  "notes": "Reliable vendor",
  "status": "active",
  "priority_rank": 0,
  "is_priority_vendor": false
}
```

> **vendor_type options:** `own_fleet`, `external_vendor`  
> **status options:** `active`, `inactive`, `pending_verification`, `blocked`

---

### List Vendors

```
GET /vendors
```

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | — | Filter by status |
| `vendor_type` | string | — | Filter: `own_fleet` or `external_vendor` |
| `search` | string | — | Search by company name, contact name, or vendor code |

---

### Get Vendor by ID

```
GET /vendors/:id
```

---

### Update Vendor

```
PATCH /vendors/:id
```

**Body:** Same fields as create (all optional, at least 1 required)

---

### Update Vendor Status

```
PATCH /vendors/:id/status
```

**Body:**

```json
{
  "status": "blocked"
}
```

---

### Get Vendor's Vehicle Listings

```
GET /vendors/:id/listings
```

**Query Params:** `page`, `limit`

---

## 🚗 Parent Vehicles Module

> 🔒 All endpoints require Auth Token

### Create Parent Vehicle

```
POST /vehicles/parents
```

**Body:**

```json
{
  "display_name": "Audi A8",
  "brand": "Audi",
  "model": "A8",
  "variant": "L",
  "model_year": 2024,
  "category": "Luxury Sedan",
  "tags": ["luxury", "sedan", "premium"],
  "location_default": "Dubai",
  "main_image": "https://example.com/audi-a8.jpg",
  "gallery_images": ["https://example.com/a8-1.jpg", "https://example.com/a8-2.jpg"],
  "thumbnail": "https://example.com/a8-thumb.jpg",
  "description": "Experience luxury driving",
  "long_description": "The Audi A8 is the flagship sedan...",
  "features": ["Massage Seats", "Bang & Olufsen Sound"],
  "highlights": ["V8 Engine", "Matrix LED"],
  "why_choose": ["Unmatched comfort", "Latest technology"],
  "specs": {
    "passengers": 5,
    "luggage": 3,
    "transmission": "Automatic",
    "doors": 4,
    "engine": "4.0L V8 Twin Turbo",
    "fuel_type": "Petrol",
    "horsepower": "460 HP",
    "acceleration": "4.4s 0-100 km/h",
    "top_speed": "250 km/h",
    "drive_type": "AWD"
  },
  "display_settings": {
    "is_featured": true,
    "sort_priority": 10,
    "show_on_frontend": true
  },
  "public_status": "draft",
  "seo": {
    "meta_title": "Rent Audi A8 in Dubai",
    "meta_description": "Rent a luxury Audi A8 starting from AED 2000/day",
    "canonical_url": "/vehicles/audi-a8"
  }
}
```

> **public_status options:** `draft`, `active`, `inactive`, `archived`

---

### List Parent Vehicles

```
GET /vehicles/parents
```

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `public_status` | string | — | Filter by status |
| `brand` | string | — | Filter by brand |
| `category` | string | — | Filter by category |
| `is_featured` | boolean | — | Filter featured only |
| `search` | string | — | Search by name, brand, model |
| `sort_by` | string | `created_at` | Sort: `created_at`, `display_name`, `sort_priority`, `public_starting_price` |
| `sort_order` | string | `desc` | `asc` or `desc` |

---

### Get Parent Vehicle by ID

```
GET /vehicles/parents/:id
```

---

### Update Parent Vehicle

```
PATCH /vehicles/parents/:id
```

**Body:** Same fields as create (all optional, at least 1 required)

---

### Update Vehicle Status

```
PATCH /vehicles/parents/:id/status
```

**Body:**

```json
{
  "public_status": "active"
}
```

---

### Update Display Price

```
PATCH /vehicles/parents/:id/display-price
```

**Body:**

```json
{
  "display_price_mode": "manual_override",
  "display_price_override": 2000,
  "weekly_price_public": 12000,
  "monthly_price_public": 45000
}
```

> **display_price_mode options:** `auto_min_child_price`, `manual_override`, `preferred_vendor_price`

---

## 📋 Vehicle Listings (Child) Module

> 🔒 All endpoints require Auth Token

### Create Vehicle Listing

```
POST /vehicle-listings
```

**Body:**

```json
{
  "parent_vehicle_id": "parent_vehicle_object_id",
  "vendor_id": "vendor_object_id",
  "listing_title_override": "Audi A8 - Premium Package",
  "own_fleet_priority": false,
  "pricing": {
    "vendor_base_price_per_day": 1800,
    "website_selling_price_per_day": 2200,
    "display_price_candidate_per_day": 2200,
    "weekly_price": 14000,
    "monthly_price": 50000,
    "future_price_fields": {
      "per_hour": null,
      "per_week": null,
      "per_month": null
    }
  },
  "pricing_unit_default": "day",
  "chauffeur": {
    "driver_available": true,
    "driver_price_per_day": 500,
    "driver_notes": "Professional chauffeur included"
  },
  "availability_status": "draft",
  "source": {
    "source_type": "manual",
    "source_reference": ""
  },
  "internal_notes": "Vendor confirmed availability"
}
```

> **availability_status options:** `draft`, `pending_approval`, `active`, `temporarily_unavailable`, `booked`, `inactive`, `rejected`, `archived`  
> **source_type options:** `manual`, `csv`, `scrape`, `api_future`  
> **pricing_unit_default options:** `day`, `hour`, `week`, `month`

---

### List Vehicle Listings

```
GET /vehicle-listings
```

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `parent_vehicle_id` | string | Filter by parent vehicle |
| `vendor_id` | string | Filter by vendor |
| `availability_status` | string | Filter by status |
| `search` | string | Search by listing title |

---

### Get Listing by ID

```
GET /vehicle-listings/:id
```

---

### Update Listing

```
PATCH /vehicle-listings/:id
```

**Body:** Same fields as create except `parent_vehicle_id` and `vendor_id` (all optional)

---

### Update Listing Status

```
PATCH /vehicle-listings/:id/status
```

**Body:**

```json
{
  "availability_status": "active"
}
```

---

### Approve Listing

```
PATCH /vehicle-listings/:id/approve
```

> Sets listing to `active` + `approved` and recalculates parent pricing.

**Body (optional):**

```json
{
  "approval_notes": "Verified and approved"
}
```

---

### Reject Listing

```
PATCH /vehicle-listings/:id/reject
```

**Body (optional):**

```json
{
  "approval_notes": "Price too high"
}
```

---

## 💬 Inquiries Module

### Log WhatsApp Click

```
POST /inquiries/whatsapp-click
```

> ⚠️ No authentication required — called by frontend.

**Body:**

```json
{
  "parent_vehicle_id": "parent_vehicle_object_id",
  "driver_selected": true,
  "page_type": "detail",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer_deals"
}
```

---

### List Inquiries

```
GET /inquiries
```

> 🔒 Requires Auth Token

**Query Params:** `page`, `limit`, `parent_vehicle_id`

---

### Get Inquiry Summary

```
GET /inquiries/summary
```

> 🔒 Requires Auth Token

**Response (200):**

```json
{
  "success": true,
  "data": {
    "total": 150,
    "last_7_days": 23,
    "top_vehicles": [
      {
        "_id": "...",
        "count": 45,
        "last_inquiry": "2026-03-18T...",
        "vehicle_name": "Audi A8",
        "brand": "Audi",
        "model": "A8"
      }
    ]
  }
}
```

---

## 📥 Import Module

> 🔒 Requires Auth Token

### Import Vehicles via CSV

```
POST /imports/vehicles/csv
```

**Content-Type:** `multipart/form-data`  
**Body:** File field named `file` (CSV, max 5MB)

**CSV Columns:**

| Column | Required | Description |
|--------|----------|-------------|
| `brand` | ✅ | Vehicle brand |
| `model` | ✅ | Vehicle model |
| `variant` | — | Vehicle variant/trim |
| `model_year` | — | Year (number) |
| `category` | — | Category |
| `description` | — | Description |
| `passengers` | — | Number of passengers |
| `luggage` | — | Luggage capacity |
| `transmission` | — | Transmission type |
| `doors` | — | Number of doors |
| `engine` | — | Engine description |
| `fuel_type` | — | Fuel type |
| `vendor_code` | — | Match vendor by code |
| `vendor_company_name` | — | Match vendor by name (if no code) |
| `vendor_base_price` | — | Vendor base price/day |
| `selling_price` | — | Website selling price/day |
| `display_price` | — | Display price candidate/day |
| `weekly_price` | — | Weekly price |
| `monthly_price` | — | Monthly price |
| `driver_available` | — | `true` or `false` |
| `driver_price` | — | Driver price/day |
| `status` | — | Listing status |
| `notes` | — | Internal notes |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "total_rows": 50,
    "success": 45,
    "failed": 5,
    "created_parents": 10,
    "matched_parents": 35,
    "created_listings": 45,
    "errors": [
      { "row": 12, "message": "Vendor not found" }
    ]
  }
}
```

---

## 🌐 Public Module (Frontend)

> ⚠️ No authentication required — these are for the frontend.

### List Public Vehicles

```
GET /public/vehicles
```

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `brand` | string | — | Filter by brand |
| `category` | string | — | Filter by category |
| `search` | string | — | Search by name, brand, model |
| `sort_by` | string | `sort_priority` | Sort: `sort_priority`, `price`, `created_at` |
| `sort_order` | string | `desc` | `asc` or `desc` |

> ℹ️ Only returns vehicles with `public_status: active` and `show_on_frontend: true`. No vendor data is exposed.

---

### Get Public Vehicle by Slug

```
GET /public/vehicles/:slug
```

> Returns a single vehicle with public-safe fields only.

---

## 🏥 Health Check

```
GET /health
```

> ⚠️ No authentication required.

**Response (200):**

```json
{
  "success": true,
  "message": "4321 Drive Backend is running",
  "environment": "development",
  "timestamp": "2026-03-18T..."
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / Validation error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 409 | Conflict (duplicate entry) |
| 429 | Too many requests (rate limited) |
| 500 | Internal server error |
