# Caregiver Portal Application

This application is a portal for caregivers to organize patient shifts, medications, ADLs and handover notes. The point of this application is to streamline and integrate patient data and care/medications administered to the patient in order to reduce the risk of miscommunication between caregivers and keep all relevant parties current on any changes to the patient's condition/routine.

---

## Table of Contents

1. [Database Models](#database-models)
2. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [Patients](#patients)
   - [Medication Administration Records](#medication-administration-records-mar)
   - [ADL Records](#adl-records)
   - [Shifts](#shifts)
   - [Handover Notes](#handover-notes)
   - [Change Requests / Approvals](#change-requests--approvals)
   - [User Management](#user-management)
   - [Dashboard / Reports](#dashboard--reports)
   - [Notifications](#notifications-optional)
3. [Key Design Decisions](#key-design-decisions)
4. [Data Flow Examples](#data-flow-examples)
5. [Tech Stack](#tech-stack-considerations)
6. [Security Considerations](#security-considerations)

---

## Database Models

### Model Structure
```
models/
├── userModel.js                      (caregivers, family members)
├── patientModel.js                   (patient demographics + care plan)
├── medicationAdministrationModel.js  (legal record of meds given)
├── adlRecordModel.js                 (daily care activities logged)
├── shiftModel.js                     (caregiver scheduling)
├── handoverNoteModel.js              (shift communication)
├── changeRequestModel.js             (approval workflow)
└── notificationModel.js              (optional - system notifications)
```

---

### 1. User Model

**Purpose**: Caregivers, family members, administrators

**Schema**:
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: String (default: 'user'), // Global role, not patient-specific
  patientIds: [ObjectId] (ref: 'Patient'),
  isActive: Boolean (default: true),
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastPasswordChange: Date,
  deletedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `email: 1` (unique)
- `username: 1` (unique)

---

### 2. Patient Model

**Purpose**: Patient demographics and care plan (reference data - what SHOULD happen)

**Schema**:
```javascript
{
  firstName: String (required),
  lastName: String (required),
  profileImg: String (URL),
  dateOfBirth: Date (required),
  
  allergies: [String],
  alerts: [String],
  
  emergencyContacts: [{
    firstName: String (required),
    lastName: String (required),
    relationship: String (required),
    phoneNumber: String (required),
    email: String,
    userId: ObjectId (ref: 'User'), // Optional - if they're also a user
    isPrimary: Boolean (default: false)
  }],
  
  medicationSchedule: [{
    name: String (required),
    dosage: String (required),
    frequency: String (required),
    scheduledTimes: [String], // ["08:00", "20:00"]
    route: String (required), // "Oral", "Topical", "Injection"
    prescribedBy: String,
    startDate: Date (required),
    endDate: Date, // null for ongoing
    isActive: Boolean (default: true)
  }],
  
  careTaskSchedule: [{
    task: String (required),
    frequency: String (required),
    category: String, // "personal-care", "mobility", "medication", "nutrition", "safety", "other"
    instructions: String
  }],
  
  caregivers: [{
    userId: ObjectId (ref: 'User', required),
    role: String (enum: ['admin', 'viewer'], default: 'viewer'),
    addedAt: Date (default: Date.now)
  }],
  
  isActive: Boolean (default: true),
  deletedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Virtuals**:
- `fullName`: `${firstName} ${lastName}`
- `age`: Calculated from dateOfBirth

**Indexes**:
- `caregivers.userId: 1, isActive: 1` (compound)
- `firstName: 1, lastName: 1`

---

### 3. MedicationAdministration Model

**Purpose**: Legal record of medications actually given (WHO gave WHAT WHEN)

**Schema**:
```javascript
{
  patientId: ObjectId (ref: 'Patient', required),
  medicationName: String (required),
  dosage: String (required),
  route: String (required), // "Oral", "Topical", "Injection", "Sublingual"
  scheduledTime: String (required), // "08:00"
  actualAdministrationTime: Date (required, default: Date.now),
  administeredBy: ObjectId (ref: 'User', required),
  status: String (enum: ['given', 'refused', 'missed', 'held'], required),
  refusalReason: String,
  notes: String,
  witnessedBy: ObjectId (ref: 'User'), // For controlled substances
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `patientId: 1, actualAdministrationTime: -1`
- `administeredBy: 1, actualAdministrationTime: -1`

**Notes**:
- Immutable - never delete, only add corrections
- Complete audit trail for legal compliance

---

### 4. ADLRecord Model

**Purpose**: Daily activities of living and vital signs (proof of care provided)

**Schema**:
```javascript
{
  patientId: ObjectId (ref: 'Patient', required),
  date: Date (required),
  shift: String (enum: ['morning', 'afternoon', 'evening', 'night'], required),
  
  activities: {
    bathing: {
      completed: Boolean (default: false),
      assistanceLevel: String (enum: ['independent', 'supervision', 'minimal', 'moderate', 'full']),
      time: Date,
      notes: String
    },
    dressing: {
      completed: Boolean (default: false),
      assistanceLevel: String (enum: ['independent', 'supervision', 'minimal', 'moderate', 'full']),
      time: Date,
      notes: String
    },
    toileting: {
      completed: Boolean (default: false),
      assistanceLevel: String (enum: ['independent', 'supervision', 'minimal', 'moderate', 'full']),
      time: Date,
      notes: String
    },
    eating: {
      completed: Boolean (default: false),
      assistanceLevel: String (enum: ['independent', 'supervision', 'minimal', 'moderate', 'full']),
      mealType: String, // "Breakfast", "Lunch", "Dinner"
      amountConsumed: String, // "100%", "75%", "50%", "25%"
      time: Date,
      notes: String
    },
    mobility: {
      completed: Boolean (default: false),
      assistanceLevel: String (enum: ['independent', 'supervision', 'minimal', 'moderate', 'full']),
      distance: String,
      time: Date,
      notes: String
    },
    positioning: {
      completed: Boolean (default: false),
      time: Date,
      notes: String
    }
  },
  
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      time: Date
    },
    heartRate: {
      value: Number,
      time: Date
    },
    temperature: {
      value: Number,
      unit: String (enum: ['F', 'C'], default: 'F'),
      time: Date
    },
    oxygenSaturation: {
      value: Number,
      time: Date
    },
    bloodGlucose: {
      value: Number,
      time: Date
    }
  },
  
  generalNotes: String,
  recordedBy: ObjectId (ref: 'User', required),
  reviewedBy: ObjectId (ref: 'User'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `patientId: 1, date: -1, shift: 1`
- `recordedBy: 1, date: -1`

**Notes**:
- One record per shift per day
- Soft delete only with reason

---

### 5. Shift Model

**Purpose**: Caregiver scheduling and attendance tracking

**Schema**:
```javascript
{
  patientId: ObjectId (ref: 'Patient', required),
  caregiverId: ObjectId (ref: 'User', required),
  date: Date (required),
  shiftType: String (enum: ['morning', 'afternoon', 'evening', 'night'], required),
  scheduledStart: String (required), // "08:00"
  scheduledEnd: String (required), // "16:00"
  actualClockIn: Date,
  actualClockOut: Date,
  status: String (enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'], default: 'scheduled'),
  notes: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `patientId: 1, date: -1`
- `caregiverId: 1, date: -1`
- `patientId: 1, caregiverId: 1, date: 1` (compound for unique constraint)

---

### 6. HandoverNote Model

**Purpose**: Shift communication and patient observations

**Schema**:
```javascript
{
  patientId: ObjectId (ref: 'Patient', required),
  caregiverId: ObjectId (ref: 'User', required),
  date: Date (required, default: Date.now),
  shift: String (enum: ['morning', 'afternoon', 'evening', 'night']),
  title: String (required, maxLength: 100),
  content: String (required),
  tags: [String],
  priority: String (enum: ['low', 'normal', 'high', 'urgent'], default: 'normal'),
  isResolved: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `patientId: 1, date: -1`
- `caregiverId: 1, date: -1`
- `patientId: 1, shift: 1, date: -1`

---

### 7. ChangeRequest Model

**Purpose**: Approval workflow for non-admin caregiver changes

**Schema**:
```javascript
{
  patientId: ObjectId (ref: 'Patient', required),
  requestedBy: ObjectId (ref: 'User', required),
  reviewedBy: ObjectId (ref: 'User'),
  requestType: String (enum: ['patient-update', 'medication-change', 'shift-change', 'caregiver-access'], required),
  targetId: ObjectId, // ID of the resource being changed (shift, medication, etc.)
  originalData: Object, // Current state (optional)
  proposedChanges: Object (required), // Requested changes
  status: String (enum: ['pending', 'approved', 'rejected', 'withdrawn'], default: 'pending'),
  reason: String, // Reason for request
  rejectionReason: String, // If rejected
  reviewedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `patientId: 1, status: 1`
- `requestedBy: 1, status: 1`
- `patientId: 1, createdAt: -1`

---

### 8. Notification Model (Optional)

**Purpose**: System notifications for users

**Schema**:
```javascript
{
  userId: ObjectId (ref: 'User', required),
  patientId: ObjectId (ref: 'Patient'),
  type: String (enum: ['change-request', 'shift-reminder', 'medication-due', 'approval-needed', 'access-granted'], required),
  message: String (required),
  link: String, // Deep link to relevant resource
  isRead: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId: 1, isRead: 1, createdAt: -1`

---

## API Endpoints

### Authentication

**Purpose**: User registration, login, and password management

**Authorization**: Public (except refresh token)

#### POST /api/auth/signup
Register a new caregiver account

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "555-0123"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status**: ✅ TESTED

---

#### POST /api/auth/signin
Login with email and password

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User signed in successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status**: ✅ TESTED

---

#### POST /api/auth/refresh
Refresh access token using refresh token

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status**: PENDING

---

#### POST /api/auth/forgot-password
Request password reset email

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "An email reset link has been sent."
}
```

**Notes**:
- Always returns success for security (doesn't reveal if email exists)
- Sends reset token via email
- Token expires in 1 hour

**Status**: ✅ TESTED

---

#### POST /api/auth/reset-password
Reset password using token from email

**Request Body**:
```json
{
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "newPassword": "NewSecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password successfully reset."
}
```

**Status**: ✅ TESTED

---

### Patients

**Purpose**: Manage patient profiles and caregiver access

**Authorization**: 
- Create: Any authenticated user
- Read: Caregivers assigned to patient
- Update: Admin only (or via approved change request)
- Delete: Admin only

---

#### GET /api/patients
Get all patients the current user has access to

**Authorization**: Authenticated user

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)
- `search` (optional): Search by patient name

**Response** (200):
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Margaret",
        "lastName": "Johnson",
        "fullName": "Margaret Johnson",
        "age": 79,
        "profileImg": null,
        "dateOfBirth": "1945-03-15T00:00:00.000Z",
        "allergies": ["Penicillin", "Shellfish"],
        "alerts": ["Fall risk", "Requires assistance with medication"],
        "caregivers": [
          {
            "userId": {
              "_id": "507f191e810c19729de860ea",
              "firstName": "John",
              "lastName": "Doe"
            },
            "role": "admin",
            "addedAt": "2024-01-15T08:00:00.000Z"
          }
        ],
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**Status**: PENDING

---

#### GET /api/patients/:id
Get detailed patient information

**Authorization**: Caregiver assigned to patient

**URL Parameters**:
- `id`: Patient ID

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Margaret",
    "lastName": "Johnson",
    "fullName": "Margaret Johnson",
    "age": 79,
    "profileImg": null,
    "dateOfBirth": "1945-03-15T00:00:00.000Z",
    "allergies": ["Penicillin", "Shellfish"],
    "alerts": ["Fall risk", "Requires assistance with medication"],
    "emergencyContacts": [
      {
        "firstName": "Sarah",
        "lastName": "Johnson",
        "relationship": "Daughter",
        "phoneNumber": "555-0101",
        "email": "sarah.johnson@example.com",
        "isPrimary": true
      }
    ],
    "medicationSchedule": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "scheduledTimes": ["08:00"],
        "route": "Oral",
        "prescribedBy": "Dr. Sarah Mitchell",
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": null,
        "isActive": true
      }
    ],
    "careTaskSchedule": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "task": "Blood pressure check",
        "frequency": "Twice daily",
        "category": "medication",
        "instructions": "Check before morning and evening medications"
      }
    ],
    "caregivers": [
      {
        "userId": {
          "_id": "507f191e810c19729de860ea",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "role": "admin",
        "addedAt": "2024-01-15T08:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  }
}
```

**Status**: PENDING

---

#### POST /api/patients
Create a new patient profile (creator becomes admin)

**Authorization**: Authenticated user

**Request Body**:
```json
{
  "firstName": "Margaret",
  "lastName": "Johnson",
  "dateOfBirth": "1945-03-15",
  "profileImg": null,
  "allergies": ["Penicillin", "Shellfish"],
  "alerts": ["Fall risk", "Requires assistance with medication"],
  "emergencyContacts": [
    {
      "firstName": "Sarah",
      "lastName": "Johnson",
      "relationship": "Daughter",
      "phoneNumber": "555-0101",
      "email": "sarah.johnson@example.com",
      "isPrimary": true
    }
  ],
  "medicationSchedule": [
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Once daily",
      "scheduledTimes": ["08:00"],
      "route": "Oral",
      "prescribedBy": "Dr. Sarah Mitchell",
      "startDate": "2024-01-15",
      "isActive": true
    }
  ],
  "careTaskSchedule": [
    {
      "task": "Blood pressure check",
      "frequency": "Twice daily",
      "category": "medication",
      "instructions": "Check before morning and evening medications"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Margaret",
    "lastName": "Johnson",
    "fullName": "Margaret Johnson",
    "age": 79,
    "caregivers": [
      {
        "userId": "507f191e810c19729de860ea",
        "role": "admin",
        "addedAt": "2024-10-25T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-10-25T10:00:00.000Z",
    "updatedAt": "2024-10-25T10:00:00.000Z"
  }
}
```

**Notes**:
- Creator is automatically added as admin caregiver
- Creator's patientIds array is updated

**Status**: PENDING

---

#### PUT /api/patients/:id
Update patient information (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `id`: Patient ID

**Request Body** (partial update):
```json
{
  "allergies": ["Penicillin", "Shellfish", "Latex"],
  "alerts": ["Fall risk", "Requires assistance with medication", "New alert"]
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Margaret",
    "lastName": "Johnson",
    "allergies": ["Penicillin", "Shellfish", "Latex"],
    "alerts": ["Fall risk", "Requires assistance with medication", "New alert"],
    "updatedAt": "2024-10-25T10:30:00.000Z"
  }
}
```

**Notes**:
- If requester is not admin, creates a ChangeRequest instead
- Cannot update caregivers array (use dedicated endpoints)

**Status**: PENDING

---

#### DELETE /api/patients/:id
Soft delete patient profile (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `id`: Patient ID

**Response** (200):
```json
{
  "success": true,
  "message": "Patient deactivated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false,
    "deletedAt": "2024-10-25T10:45:00.000Z"
  }
}
```

**Notes**:
- Soft delete only (sets isActive: false)
- Related records remain intact for legal compliance

**Status**: PENDING

---

#### GET /api/patients/:id/caregivers
List all caregivers with access to this patient

**Authorization**: Caregiver assigned to patient

**URL Parameters**:
- `id`: Patient ID

**Response** (200):
```json
{
  "success": true,
  "data": {
    "caregivers": [
      {
        "userId": {
          "_id": "507f191e810c19729de860ea",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "phoneNumber": "555-0123"
        },
        "role": "admin",
        "addedAt": "2024-01-15T08:00:00.000Z"
      },
      {
        "userId": {
          "_id": "507f191e810c19729de860eb",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com",
          "phoneNumber": "555-0124"
        },
        "role": "viewer",
        "addedAt": "2024-02-20T14:30:00.000Z"
      }
    ]
  }
}
```

**Status**: PENDING

---

#### POST /api/patients/:id/caregivers
Invite/add a caregiver to patient (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `id`: Patient ID

**Request Body**:
```json
{
  "userId": "507f191e810c19729de860eb",
  "role": "viewer"
}
```

**Alternative** (invite by email):
```json
{
  "email": "jane@example.com",
  "role": "viewer"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Caregiver added successfully",
  "data": {
    "userId": "507f191e810c19729de860eb",
    "role": "viewer",
    "addedAt": "2024-10-25T11:00:00.000Z"
  }
}
```

**Notes**:
- If user doesn't exist, may send invitation email
- Updates user's patientIds array
- Creates notification for invited user

**Status**: PENDING

---

#### PUT /api/patients/:id/caregivers/:userId
Update caregiver role (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `id`: Patient ID
- `userId`: User ID of caregiver to update

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Caregiver role updated successfully",
  "data": {
    "userId": "507f191e810c19729de860eb",
    "role": "admin",
    "addedAt": "2024-02-20T14:30:00.000Z"
  }
}
```

**Notes**:
- Cannot change own role if you're the only admin
- Must have at least one admin

**Status**: PENDING

---

#### DELETE /api/patients/:id/caregivers/:userId
Remove caregiver access (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `id`: Patient ID
- `userId`: User ID of caregiver to remove

**Response** (200):
```json
{
  "success": true,
  "message": "Caregiver access removed successfully"
}
```

**Notes**:
- Cannot remove yourself if you're the only admin
- Removes patient from user's patientIds array
- User loses access to all patient data

**Status**: PENDING

---

### Medication Administration Records (MAR)

**Purpose**: Manage medication schedules and log actual administrations

**Authorization**:
- Read: All caregivers assigned to patient
- Create log: All caregivers
- Update schedule: Admin only

---

#### GET /api/patients/:patientId/medications
Get medication schedule for patient

**Authorization**: Caregiver assigned to patient

**URL Parameters**:
- `patientId`: Patient ID

**Query Parameters**:
- `activeOnly` (optional): Boolean (default: true)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "medications": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "scheduledTimes": ["08:00"],
        "route": "Oral",
        "prescribedBy": "Dr. Sarah Mitchell",
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": null,
        "isActive": true
      }
    ]
  }
}
```

**Status**: PENDING

---

#### POST /api/patients/:patientId/medications
Add medication to schedule (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `patientId`: Patient ID

**Request Body**:
```json
{
  "name": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "scheduledTimes": ["08:00", "18:00"],
  "route": "Oral",
  "prescribedBy": "Dr. James Park",
  "startDate": "2024-10-25",
  "isActive": true
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Medication added to schedule",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Metformin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "scheduledTimes": ["08:00", "18:00"],
    "route": "Oral",
    "prescribedBy": "Dr. James Park",
    "startDate": "2024-10-25T00:00:00.000Z",
    "endDate": null,
    "isActive": true
  }
}
```

**Notes**:
- If requester is not admin, creates ChangeRequest instead

**Status**: PENDING

---

#### PUT /api/patients/:patientId/medications/:id
Update medication in schedule (admin only)

**Authorization**: Admin caregiver for this patient

**URL Parameters**:
- `patientId`: Patient ID
- `id`: Medication ID

**Request Body** (partial update):
```json
{
  "dosage": "1000mg",
  "scheduledTimes": ["08:00", "20:00"]
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Medication updated",
  "data": {
    "_id": "507