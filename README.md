# CareSync — Backend API

A multi-tenant REST API for caregiver organisations to manage patients, shifts, medications, and handover notes. Each organisation (company) is fully isolated — users only ever see data that belongs to their own company.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Multi-Tenancy Model](#multi-tenancy-model)
3. [Database Models](#database-models)
4. [Authentication & Authorisation](#authentication--authorisation)
5. [API Endpoints](#api-endpoints)
   - [Auth](#auth)
   - [Company](#company)
   - [Patients](#patients)
   - [Shifts](#shifts)
   - [Handover Notes](#handover-notes)
   - [Medication Administration](#medication-administration)
   - [Users](#users)
6. [Tech Stack](#tech-stack)
7. [Key Design Decisions](#key-design-decisions)

---

## Architecture Overview

```
src/
├── controllers/        # HTTP layer — validates input, calls services, sends response
│   ├── AuthController.js
│   ├── PatientController.js
│   ├── ShiftController.js
│   ├── HandoverController.js
│   ├── MedicationController.js
│   └── UserController.js
├── services/           # Business logic — all DB access lives here
│   ├── authService.js
│   ├── patientService.js
│   ├── shiftService.js
│   ├── handoverService.js
│   ├── medicationService.js
│   └── userService.js
├── models/             # Mongoose schemas
│   ├── companyModel.js
│   ├── userModel.js
│   ├── patientModel.js
│   ├── shiftModel.js
│   ├── handoverNotesModel.js
│   └── medicationModel.js
├── routes/             # Express routers
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   ├── patientRoutes.js
│   └── userRoutes.js
├── utils/
│   └── middleware.js   # authenticateUser, authorizeRoles, error handling
└── functions/
    └── jwtFunctions.js # JWT generation and verification
```

---

## Multi-Tenancy Model

Every piece of data in the system is scoped to a **Company**. This is the primary isolation boundary.

```
Company
  └── Users          (companyId → Company)
  └── Patients       (companyId → Company)
       └── Shifts    (patientId → Patient)
       └── Handover Notes
       └── Medication Records
```

**Access rule**: a user can only read or write data where `companyId` matches their own. This is enforced at the service layer on every query — it is never the caller's responsibility.

### Joining a company

| Scenario | How it works |
|---|---|
| First user of a new organisation | Registers with a **company name** → becomes Admin, company is created, invite code generated automatically |
| Subsequent users | Register with an **invite code** provided by their Admin → join as User role |

The Admin can view and regenerate the invite code at any time via `GET /company/invite` and `POST /company/invite/regenerate`.

---

## Database Models

### Company

```js
{
  name:       String (required),
  createdBy:  ObjectId → User,
  inviteCode: String (unique, auto-generated 12-char hex),
  isActive:   Boolean,
  createdAt, updatedAt
}
```

---

### User

```js
{
  companyId:   ObjectId → Company (required),
  firstName:   String (required),
  lastName:    String (required),
  username:    String (required, unique),
  email:       String (required, unique),
  password:    String (bcrypt hashed),
  role:        'Admin' | 'User',
  profileImg:  String,
  isActive:    Boolean,
  lastLogin:   Date,
  deletedAt:   Date,
  createdAt, updatedAt
}
```

**Indexes**: `{ companyId, isActive, deletedAt }`, `username`, `email`

---

### Patient

```js
{
  companyId:           ObjectId → Company (required),
  firstName:           String (required),
  lastName:            String (required),
  profileImg:          String,
  dateOfBirth:         Date (required),
  allergies:           [String],
  alerts:              [String],
  emergencyContacts:   [{ firstName, lastName, relationship, phoneNumber, email }],
  medicationSchedule:  [{ name, dosage, route, frequency, scheduledTimes, prescribedBy, startDate, endDate, isActive }],
  careTaskSchedule:    [{ task, frequency, category, instructions }],
  isActive:            Boolean,
  deletedAt:           Date,
  createdAt, updatedAt
}
```

**Virtuals**: `fullName`, `age`

**Indexes**: `{ companyId, isActive }`, `{ companyId, lastName, firstName }`

> Note: there is no per-patient caregiver list. Company membership is the access boundary — all users in a company can see all company patients. Roles (Admin / User) control what they can modify.

---

### Shift

```js
{
  patientId:      ObjectId → Patient (required),
  caregiverId:    ObjectId → User (required),
  date:           Date (required),
  shiftType:      'morning' | 'afternoon' | 'evening' | 'night',
  scheduledStart: String HH:MM (required),
  scheduledEnd:   String HH:MM (required),
  actualClockIn:  Date,
  actualClockOut: Date,
  status:         'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show',
  notes:          String,
  createdAt, updatedAt
}
```

**Indexes**: `{ patientId, date }`, `{ caregiverId, date }`

---

### HandoverNote

```js
{
  patientId:   ObjectId → Patient (required),
  userId:      ObjectId → User (required),
  title:       String (required, max 100),
  content:     String (required),
  tags:        [String],
  createdAt, updatedAt
}
```

**Indexes**: `{ patientId, createdAt }`, `{ userId, createdAt }`

---

### MedicationAdministration

```js
{
  patientId:                ObjectId → Patient (required),
  medicationName:           String (required),
  dosage:                   String (required),
  route:                    'Oral' | 'Topical' | 'Injection' | 'Sublingual' | ... (required),
  scheduledTime:            String HH:MM (required),
  actualAdministrationTime: Date,
  administeredBy:           ObjectId → User (required),
  status:                   'given' | 'refused' | 'missed' | 'held' | 'unvalidated',
  refusalReason:            String,
  notes:                    String,
  witnessedBy:              ObjectId → User,
  unvalidatedAt:            Date,
  unvalidatedBy:            ObjectId → User,
  unvalidationReason:       String,
  createdAt, updatedAt
}
```

**Indexes**: `{ patientId, actualAdministrationTime }`, `{ administeredBy, actualAdministrationTime }`

---

## Authentication & Authorisation

### JWT payload

```json
{
  "id":        "userId",
  "username":  "jdoe",
  "role":      "Admin",
  "firstName": "Jane",
  "lastName":  "Doe",
  "companyId": "companyId"
}
```

Access tokens expire in **15 minutes**. Refresh tokens expire in **7 days**. The `authenticateUser` middleware decodes the token and attaches `req.user` (including `companyId`) to every authenticated request.

### Role authorisation

| Role | Can do |
|---|---|
| `User` | Read all company patients/shifts/notes; record medications |
| `Admin` | Everything a User can do, plus: update patients, view/regenerate invite code |

---

## API Endpoints

All endpoints (except public auth routes) require `Authorization: Bearer <token>`.

---

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register — creates a company (with `companyName`) or joins one (with `inviteCode`) |
| POST | `/auth/signin` | Public | Login |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Bearer | Invalidate refresh token |
| POST | `/auth/forgot-password` | Public | Send password reset email |
| POST | `/auth/reset-password` | Public | Reset password via token |

#### POST /auth/signup — create a new company
```json
{
  "firstName":   "Jane",
  "lastName":    "Doe",
  "username":    "jdoe",
  "email":       "jane@sunrise.care",
  "password":    "SecurePass123!",
  "companyName": "Sunrise Care"
}
```

#### POST /auth/signup — join an existing company
```json
{
  "firstName":  "Alex",
  "lastName":   "Smith",
  "username":   "asmith",
  "email":      "alex@sunrise.care",
  "password":   "SecurePass123!",
  "inviteCode": "a1b2c3d4e5f6"
}
```

**Response** (both, 201):
```json
{
  "success": true,
  "message": "User created successfully.",
  "user": { "_id": "...", "firstName": "Jane", "lastName": "Doe", "role": "Admin", "companyId": "..." },
  "token": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

---

### Company

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/company/invite` | Bearer + Admin | Get current company name and invite code |
| POST | `/company/invite/regenerate` | Bearer + Admin | Rotate the invite code (invalidates previous) |

**GET /company/invite response**:
```json
{
  "success": true,
  "data": { "name": "Sunrise Care", "inviteCode": "a1b2c3d4e5f6" }
}
```

---

### Patients

All patient endpoints are scoped automatically to `req.user.companyId`.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/patient` | Bearer | List all active patients for this company |
| GET | `/patient/:id` | Bearer | Get a single patient |
| PATCH | `/patient/:id` | Bearer + Admin | Update patient fields |
| PATCH | `/patient/:id/profile-image` | Bearer + Admin | Upload profile photo |
| GET | `/patient/:id/shifts` | Bearer | Get shifts grouped by date for a given month |
| GET | `/patient/:id/handover-notes` | Bearer | Get handover notes for a date |
| POST | `/patient/:id/medication-administrations` | Bearer | Record a medication administration |
| GET | `/patient/:id/medication-administrations` | Bearer | Get medication records for a date |
| PATCH | `/patient/:patientId/medication-administrations/:recordId/unvalidate` | Bearer | Unvalidate a record |

#### GET /patient?  →  GET /patient

Returns all active patients for the authenticated user's company, sorted by last name.

#### GET /patient/:id/shifts?month=YYYY-MM

Returns shifts grouped by date key (`YYYY-MM-DD`):
```json
{
  "success": true,
  "data": {
    "2026-06-03": [
      { "id": "...", "caregiver": "Jane Doe", "time": "8:00 AM – 4:00 PM", "type": "Morning Care", "status": "completed" }
    ]
  }
}
```

---

### Shifts

Shift creation and management is handled via seed scripts or a future admin interface. Querying is via `/patient/:id/shifts`.

---

### Handover Notes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/patient/:id/handover-notes?date=YYYY-MM-DD` | Bearer | Notes for a specific date |

---

### Medication Administration

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/patient/:id/medication-administrations` | Bearer | Record administration |
| GET | `/patient/:id/medication-administrations?date=YYYY-MM-DD` | Bearer | Records for a date |
| PATCH | `/patient/:patientId/medication-administrations/:recordId/unvalidate` | Bearer | Unvalidate with reason |

#### POST /patient/:id/medication-administrations
```json
{
  "medicationName": "Lisinopril",
  "dosage": "10mg",
  "route": "Oral",
  "scheduledTime": "08:00"
}
```

---

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/user/fetchallusers` | Bearer | List all active users in this company |
| PUT | `/user/:id` | Bearer (owner or Admin) | Update user details |
| DELETE | `/user/:id` | Bearer (owner or Admin) | Soft delete user |
| PATCH | `/user/:id/profile-image` | Bearer (owner or Admin) | Upload profile photo |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (access token 15m, refresh token 7d) |
| Password hashing | bcrypt (12 rounds) |
| File uploads | Cloudinary (via multer) |
| Email | Nodemailer |
| API docs | Swagger / OpenAPI (`/api-docs`) |
| Security | Helmet, express-rate-limit, CORS allowlist |

---

## Key Design Decisions

### Company as the isolation boundary
Rather than per-patient caregiver assignment lists, access is controlled at the company level. Any user in a company can see all company patients. This reduces admin overhead and is appropriate for small-to-medium care organisations where all staff work across all patients.

### Invite code onboarding
New companies are created during registration (first user becomes Admin). Subsequent users join via a 12-character hex invite code that the Admin can rotate at any time. This keeps onboarding simple without requiring an email-invite flow.

### companyId in the JWT
The `companyId` is embedded in the JWT payload so every authenticated request knows its tenant without an additional DB lookup. The service layer uses this to scope all queries — callers never need to remember to filter by company.

### Medication records are append-only
Administration records are never deleted, only unvalidated (status change + reason). This preserves a full audit trail for legal and compliance purposes.

### Soft deletes throughout
Users and patients use `isActive: false` + `deletedAt` rather than hard deletes, so historical records remain intact.

### Services own all DB access
Controllers handle HTTP concerns only (parsing, responding). All MongoDB queries live in services. This keeps the layer boundary clean and makes the business logic testable in isolation.
