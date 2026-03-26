# 4321 Drive Backend Instructions (Phase 1 with Phase 2-ready design)

## 1. Purpose

This document defines the backend architecture, data model, permissions, workflows, and security requirements for the 4321 Drive platform.

The backend must support the current **Phase 1 business workflow** while being structured so that **Phase 2 vendor login and vendor self-service** can be added later with minimal refactoring.

Phase 1 is an **inquiry-first broker platform**, not a booking engine.

- Customers browse vehicles on the frontend.
- Customers see one public parent listing per vehicle model/group.
- Customers submit inquiries through WhatsApp.
- Internal staff manually contact the relevant vendor(s) to confirm availability and final pricing.
- Vendor pricing stays internal.
- No online payment, booking pipeline, CRM automation, or commission dashboard is included in Phase 1.

---

## 2. Final Product Direction

### 2.1 Business model

4321 Drive acts as a **broker / operator**.

Flow:

1. Customer sees one public vehicle listing such as **Audi A8**.
2. Multiple vendors may have uploaded or provided the same vehicle model.
3. Internally, the system stores multiple vendor-specific child listings under one public parent vehicle.
4. Frontend only shows one public vehicle page/card.
5. Frontend displays a **Starting From** price.
6. On inquiry, internal staff decide whether to fulfill from:
   - own fleet / 4321 Drive vendor record
   - external vendor record
7. Internal staff contact the selected vendor manually by phone / WhatsApp.

### 2.2 Phase 1 active users

For **actual live Phase 1 usage**, only these roles are active:

- `super_admin`
- `admin`

### 2.3 Phase 2-ready design

Even though vendor login is **not active in Phase 1**, the backend should be designed so that a `vendor` role can be enabled later without large schema changes.

That means:

- keep `vendor` as a role in the system design
- keep ownership fields on vendor child listings
- keep approval workflow fields
- keep permission layer extensible
- do **not** expose vendor login routes in Phase 1 production unless explicitly enabled later

---

## 3. Core Architecture Decision

## Public Parent Vehicle + Internal Vendor Child Listing

This is the most important backend decision.

### 3.1 Why this structure is required

Multiple vendors may offer the same car model, but the frontend must show only one public listing.

Example:

- Vendor A has Audi A8 at AED 2200/day
- Vendor B has Audi A8 at AED 2000/day
- 4321 Drive own fleet has Audi A8 at AED 2400/day

Frontend should show:

- one parent vehicle: **Audi A8**
- public label: **Starting From AED 2000/day** or admin-selected display value

Internally, admin/super admin must see all vendor child listings under that parent vehicle.

### 3.2 Long-term best-practice split

#### Parent Vehicle (public catalog entity)

The parent vehicle stores shared public-facing information.

Recommended fields:

- canonical title / display name
- brand / make
- model
- variant / trim (optional)
- model year
- category
- tags
- public description
- long description
- highlights
- features
- why choose
- specs shared at catalog level
- main image
- image gallery
- SEO slug
- meta title
- meta description
- public status
- display priority / featured flags
- lowest visible price snapshot
- selected display price override
- pricing unit defaults

#### Vendor Child Listing (supply entity)

Each child listing stores vendor-specific operational and commercial data.

Recommended fields:

- parent vehicle reference
- vendor reference
- vendor-specific title override (optional)
- own-fleet flag
- vendor base price
- website selling price
- display price candidate
- public display participation flag
- chauffeur availability
- chauffeur price per day
- pricing units / optional weekly monthly fields
- availability status
- verification status
- approved by
- approved at
- source type (manual / csv / scrape / api in future)
- source notes
- internal notes
- soft-delete state

### 3.3 Key rule

**Parent vehicle data should never be used to store vendor-specific price or availability directly if that value can differ by vendor.**

---

## 4. Role and Permission Model

## 4.1 Roles

### `super_admin`

Full access to the entire system.

Permissions:

- CRUD admins
- CRUD vendors
- Read all users
- Activate / disable users
- Soft delete any user
- Permanently remove vehicle records if business allows that in maintenance tools
- CRUD parent vehicles
- CRUD vendor child listings
- Approve / reject listings
- Change display price settings
- View all inquiries
- View all vendors and all vendor-linked vehicles
- View all internal fields

### `admin`

Operational manager role.

Permissions:

- Create vendors
- Read vendors
- Update vendors
- Cannot delete vendors
- Create parent vehicles
- Read parent vehicles
- Update parent vehicles
- Disable parent vehicles
- Create vendor child listings
- Read vendor child listings
- Update vendor child listings
- Disable vendor child listings
- Delete vendor child listings only as soft delete / inactive
- Approve / verify listings if business allows
- View vendor contact details
- View inquiries
- Manage prices shown on frontend

Restrictions:

- cannot delete vendor records permanently
- cannot manage super admin accounts
- cannot read password hashes or sensitive credential internals

### `vendor` (Phase 2-ready only, disabled in Phase 1)

Not active in Phase 1 UI/API exposure, but should be supported by the design.

Planned permissions later:

- read own account
- update own profile
- create own child listings
- update own child listings
- read own child listings only
- cannot see other vendors
- cannot see admins or super admins
- cannot approve own listing
- cannot see internal pricing of other vendors

## 4.2 Permission implementation recommendation

Use **RBAC** with permission constants instead of hardcoded if/else scattered through the codebase.

Example permission groups:

- `users.read`
- `users.create_admin`
- `users.create_vendor`
- `users.update_vendor`
- `users.delete_vendor`
- `vehicles.parent.read`
- `vehicles.parent.create`
- `vehicles.parent.update`
- `vehicles.parent.disable`
- `vehicles.child.read`
- `vehicles.child.create`
- `vehicles.child.update`
- `vehicles.child.approve`
- `pricing.read_internal`
- `pricing.update_display`
- `inquiries.read`

---

## 5. User Module Requirements

## 5.1 User entity

Recommended fields:

- `_id`
- `full_name`
- `email`
- `phone`
- `role` (`super_admin`, `admin`, `vendor`)
- `password_hash`
- `status` (`active`, `inactive`, `suspended`)
- `last_login_at`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at` (nullable)

## 5.2 Authentication

Use JWT-based authentication with refresh strategy or short-lived access tokens.

Recommended:

- access token: short expiry
- refresh token: stored securely
- password hashing: bcrypt or argon2
- never expose password hash in responses
- never log raw passwords

## 5.3 Account rules

- all write APIs must require authentication
- all protected routes must validate token and permissions
- user credentials must be hidden from all roles except internal auth system behavior
- even super admin should not see raw credentials, only account metadata

---

## 6. Vendor Module Requirements

## 6.1 Vendor business record

Vendor is a business entity, separate from user authentication.

A vendor may later get a linked user account, but in Phase 1 vendor records can exist without vendor login.

### Recommended vendor fields

- `_id`
- `vendor_code`
- `vendor_type` (`own_fleet`, `external_vendor`)
- `company_name`
- `garage_name`
- `contact_person_name`
- `contact_person_email`
- `contact_person_phone`
- `whatsapp_number`
- `company_phone`
- `alternate_phone`
- `address_line_1`
- `address_line_2`
- `city`
- `country`
- `logo_image`
- `profile_image`
- `trade_license_number` (optional)
- `tax_number` / `vat_number` (optional)
- `notes`
- `status` (`active`, `inactive`, `pending_verification`, `blocked`)
- `priority_rank`
- `is_priority_vendor`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at`

## 6.2 Own fleet handling

4321 Drive own fleet should be represented as a normal vendor record.

Recommended:

- create a vendor record such as `4321 Drive`
- set `vendor_type = own_fleet`
- set `is_priority_vendor = true`

This keeps the system consistent and avoids special-case code.

## 6.3 Vendor deletion rule

- vendor records should be soft deleted / disabled
- vendor records should not be hard deleted in normal admin workflow
- existing vehicle history must remain linked for internal reference

---

## 7. Vehicle Data Model

## 7.1 Parent Vehicle Collection

Suggested collection name: `parent_vehicles`

### Recommended fields

- `_id`
- `slug`
- `display_name`
- `brand`
- `model`
- `variant`
- `model_year`
- `category`
- `tags[]`
- `location_default`
- `main_image`
- `gallery_images[]`
- `thumbnail`
- `description`
- `long_description`
- `features[]`
- `highlights[]`
- `why_choose[]`
- `specs`
  - `passengers`
  - `luggage`
  - `transmission`
  - `doors`
  - `engine`
  - `fuel_type`
  - `horsepower`
  - `acceleration`
  - `top_speed`
  - `drive_type`
- `pricing_summary`
  - `display_price_mode`
  - `display_price_override`
  - `calculated_min_daily_price`
  - `public_starting_price`
  - `weekly_price_public`
  - `monthly_price_public`
  - `price_source_child_listing_id`
- `display_settings`
  - `is_featured`
  - `sort_priority`
  - `show_on_frontend`
- `public_status` (`draft`, `active`, `inactive`, `archived`)
- `seo`
  - `meta_title`
  - `meta_description`
  - `canonical_url`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at`

## 7.2 Vendor Child Listing Collection

Suggested collection name: `vehicle_listings`

Each record is one vendor supply entry under one parent vehicle.

### Recommended fields

- `_id`
- `parent_vehicle_id`
- `vendor_id`
- `vendor_user_id` (nullable, Phase 2-ready)
- `listing_title_override`
- `own_fleet_priority` (boolean)
- `pricing`
  - `vendor_base_price_per_day`
  - `website_selling_price_per_day`
  - `display_price_candidate_per_day`
  - `weekly_price`
  - `monthly_price`
  - `future_price_fields`
    - `per_hour`
    - `per_week`
    - `per_month`
- `pricing_unit_default` (`day` for now)
- `chauffeur`
  - `driver_available`
  - `driver_price_per_day`
  - `driver_notes`
- `availability_status`
  - `draft`
  - `pending_approval`
  - `active`
  - `temporarily_unavailable`
  - `booked`
  - `inactive`
  - `rejected`
  - `archived`
- `verification`
  - `is_verified`
  - `verified_by_user_id`
  - `verified_at`
  - `approval_status`
  - `approval_notes`
- `source`
  - `source_type` (`manual`, `csv`, `scrape`, `api_future`)
  - `source_reference`
- `internal_notes`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `deleted_at`

## 7.3 Why this split is practical

This model supports:

- multiple vendors under one public car
- future vendor logins
- own-fleet prioritization
- public starting price logic
- manual approval workflow
- future commission tracking without refactoring the parent vehicle schema

---

## 8. Pricing Strategy

## 8.1 Required separation

The system must separate these values:

1. **Vendor Base Price**
   - internal only
   - what vendor charges 4321 Drive

2. **Website Selling Price**
   - internal only
   - intended selling rate by 4321 Drive

3. **Display Price / Public Starting Price**
   - public-facing
   - shown as `Starting From AED X/day`

## 8.2 Admin-controlled display pricing

The system must include a field that tells admin which price is currently shown on frontend without changing vendor pricing.

Recommended pricing mode on parent vehicle:

- `auto_min_child_price`
- `manual_override`
- `preferred_vendor_price`

Recommended behavior now:

- compute minimum valid active child selling price
- save as `calculated_min_daily_price`
- allow admin to override using `display_price_override`
- save final shown value in `public_starting_price`

This ensures admin can change the public display price without disturbing vendor base price or website selling price.

## 8.3 Future-ready pricing fields

Even if Phase 1 uses daily pricing only, the schema should allow future fields for:

- hourly
- weekly
- monthly

Backend can keep these nullable until needed.

---

## 9. Vehicle Status and Approval Workflow

## 9.1 Parent vehicle statuses

Recommended parent statuses:

- `draft`
- `active`
- `inactive`
- `archived`

## 9.2 Child listing statuses

Recommended child listing statuses:

- `draft`
- `pending_approval`
- `active`
- `temporarily_unavailable`
- `booked`
- `inactive`
- `rejected`
- `archived`

## 9.3 Approval process

Required behavior:

- a vendor-linked listing should not become publicly active without approval
- approval must store:
  - `verified_by_user_id`
  - `verified_at`
  - `approval_status`
  - optional `approval_notes`

Even though only admin/super admin are creating listings in Phase 1, this workflow should still exist because it will be needed when vendor self-upload is enabled later.

---

## 10. Frontend Data Rules from Backend

## 10.1 Public listing behavior

Frontend should consume only parent/public vehicle data.

Public API must never expose:

- vendor identity
- vendor base price
- vendor contact details
- hidden child listing internals

## 10.2 Starting price rule

Public listing should show one value:

- `Starting From AED X/day`

That value should come from parent `public_starting_price`.

## 10.3 Own fleet prioritization

Since own fleet is represented as a vendor, the backend should support priority selection.

Suggested rules:

- admin panel: show own-fleet child listings first
- frontend listing sort: support prioritization of own-fleet vehicles when applicable
- parent price calculation may still use lowest eligible price unless admin overrides it

---

## 11. Inquiry Logging (Phase 1)

Phase 1 uses WhatsApp only.

No CRM pipeline is required.

Suggested collection name: `inquiry_logs`

### Recommended fields

- `_id`
- `parent_vehicle_id`
- `source_action` (`whatsapp_click`)
- `driver_selected` (boolean)
- `created_at`
- `page_type` (`listing`, `detail`, `featured`, etc.)
- `utm_source` (optional)
- `utm_medium` (optional)
- `utm_campaign` (optional)

Do not store sensitive personal user data unless later explicitly required.

---

## 12. Authentication and Security Requirements

## 12.1 Required security baseline

Every authenticated API must have:

- JWT auth middleware
- role / permission middleware
- request validation
- input sanitization
- rate limiting
- secure password hashing
- secure error handling
- audit-safe logging

## 12.2 Security recommendations

- use `helmet` or equivalent security headers
- use `bcrypt` or `argon2`
- hash passwords with proper salt
- use refresh token rotation if implemented
- store secrets in environment variables
- enforce HTTPS in production
- set CORS properly
- rate limit auth routes harder than general admin routes
- never trust client-side role claims
- validate file uploads
- restrict image MIME types and file size

## 12.3 Soft deletion policy

### Vehicle records

- normal delete action should mark vehicle or listing inactive / archived
- do not hard delete in regular admin operations
- only super admin may access permanent deletion tools if ever enabled

### Vendor records

- disable vendor instead of deleting
- preserve historical listing linkage

### User records

- prefer inactive / suspended over hard delete

---

## 13. Bulk Upload and Import Rules

## 13.1 CSV import still required

Even if scraping is added later, CSV import should remain part of the backend because it is useful for manual operations and fallback.

## 13.2 Import behavior

CSV import should support:

- parent vehicle core identity fields
- child vendor listing fields
- specs
- pricing
- chauffeur fields
- vendor assignment
- status

## 13.3 Import validation

- validate required columns
- validate numbers and enums
- reject corrupted files
- mark incomplete records as `draft` or `inactive`
- generate import report for success/failure rows

## 13.4 Deduplication strategy

When importing, the system should try to match parent vehicle using normalized keys such as:

- brand
- model
- model_year
- variant (if available)
- category

Then create or attach child vendor listing under the matched parent.

---

## 14. Suggested API Modules

## 14.1 Auth module

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## 14.2 User module

- `POST /users/admins`
- `GET /users/admins`
- `PATCH /users/admins/:id`
- `DELETE /users/admins/:id` (super admin only, soft delete recommended)
- `POST /users/vendors` (Phase 2-ready, not public now if unused)

## 14.3 Vendor module

- `POST /vendors`
- `GET /vendors`
- `GET /vendors/:id`
- `PATCH /vendors/:id`
- `PATCH /vendors/:id/status`
- `GET /vendors/:id/listings`

## 14.4 Parent vehicle module

- `POST /vehicles/parents`
- `GET /vehicles/parents`
- `GET /vehicles/parents/:id`
- `PATCH /vehicles/parents/:id`
- `PATCH /vehicles/parents/:id/status`
- `PATCH /vehicles/parents/:id/display-price`

## 14.5 Child listing module

- `POST /vehicle-listings`
- `GET /vehicle-listings`
- `GET /vehicle-listings/:id`
- `PATCH /vehicle-listings/:id`
- `PATCH /vehicle-listings/:id/status`
- `PATCH /vehicle-listings/:id/approve`
- `PATCH /vehicle-listings/:id/reject`

## 14.6 Inquiry module

- `POST /inquiries/whatsapp-click`
- `GET /inquiries`
- `GET /inquiries/summary`

## 14.7 Import module

- `POST /imports/vehicles/csv`
- `GET /imports/:id/status`
- `GET /imports/:id/report`

---

## 15. Suggested Database Indexes

At minimum:

- users: `email` unique
- vendors: `company_name`, `status`
- parent_vehicles: `slug` unique
- parent_vehicles: `brand`, `model`, `category`, `public_status`
- vehicle_listings: `parent_vehicle_id`
- vehicle_listings: `vendor_id`
- vehicle_listings: `availability_status`
- vehicle_listings: compound index on `(parent_vehicle_id, vendor_id, deleted_at)`
- inquiry_logs: `parent_vehicle_id`, `created_at`

---

## 16. Recommended Tech Stack

Aligned with current project direction:

- Node.js
- Express or NestJS
- MongoDB with Mongoose or equivalent ODM
- JWT authentication
- Cloud storage for images
- Redis optional for rate limiting / caching

If long-term maintainability is important, NestJS may be cleaner for:

- modules
- guards / RBAC
- DTO validation
- dependency injection

If the team prefers speed and familiarity, Express is acceptable.

---

## 17. What is intentionally NOT included in this backend for Phase 1

Do not overbuild these into active Phase 1 features:

- online booking engine
- payment gateway
- vendor portal UI
- automated vendor payouts
- automated commission dashboard
- booking management pipeline
- CRM automation
- advanced analytics dashboard
- automatic vendor availability sync

Schema can be future-ready, but active implementation should stay Phase 1 focused.

---

## 18. Important Implementation Notes

1. Do not hardcode vendor logic directly into parent vehicle schema.
2. Do not expose vendor data on public APIs.
3. Keep own fleet as a vendor record, not a special one-off code path.
4. Build approval fields now even if only admin/super admin use them at first.
5. Keep display pricing separate from vendor and internal selling prices.
6. Use soft deletion by default.
7. Keep CSV import as a first-class feature.
8. Keep future hourly/weekly/monthly pricing fields nullable and optional.
9. Keep code ready for vendor role activation later.
10. Since customer fulfillment is manual, availability should remain admin-controlled, not auto-reserved.

---

## 19. Final Recommended Build Order

### Phase 1 backend implementation order

1. Auth + user module
2. Vendor module
3. Parent vehicle module
4. Child vendor listing module
5. Pricing + display-price logic
6. Inquiry logging
7. CSV import pipeline
8. Public read APIs for frontend
9. Security hardening
10. Approval workflow refinement

---

## 20. Final Assumptions used in this document

These assumptions are based on the latest product clarification:

- Only super admin and admin actively use the backend in Phase 1.
- Vendor login is not active yet, but schema must support it later.
- Vehicles are displayed publicly as parent vehicles.
- Vendor-specific records are stored as child listings.
- WhatsApp is the only inquiry channel for now.
- Vehicle data is manually entered or imported; no third-party vehicle API is required right now.
- Deletion is mostly soft deletion / inactive state.
- Audit logs are postponed.

---

## 21. Short Summary

Build the backend as a **multi-vendor broker inventory system** with:

- RBAC
- parent/public vehicles
- child/vendor listings
- hidden internal pricing
- admin-controlled display price
- approval workflow
- WhatsApp inquiry logging
- soft deletion
- Phase 2-ready vendor role support

This approach is optimized for current needs and prevents major refactoring when vendor self-service is introduced later.
