This application is a portal for caregivers to organise patient shifts, medications, ADLs and handover notes. The point of this application is to streamline and integrate patient data and care/medications adminsitered to the patient in order to reduce the risk of miscommunication between caregivers and keep all relevant parties current on any changes to the patient's condition/routine.

Database Models (7 collections):

User - Caregivers, family members, admins, patients
Patient - Patient information and medical history
Shift - Caregiver scheduling
Medication - Prescribed medications (master list)
MedicationLog - Daily medication tracking (completion records)
ADL - Activities of Daily Living templates
ADLLog - Daily ADL completion records
Handover Notes - Allow caregivers to log handover notes at the end of their shift, for the next shift to access. It will also allow each person to make notes on future dates, in case the person on that day needs to be reminded of a stand-alone/out-of-routine appointment or task.

*API Endpoints:*

### **Authentication**

Notes:
- This will allow the cargiver to create a profile to interact with the patient profile
- This will have a roles/permissions aspect -> one caregiver (admin) can create the patient profile. Whomever creates the patient profile should be the main next of kin/emergency contact as they will have all admin permissions.
- This means that one caregiver may have admin permissions for a patient but then have other patients that they're not the admin for (if created by another user).
- This admin user will then be able to invite other users to access the patient profile
- Once the other users are granted access to the profile, they will automatically have permission to post handover notes without further approval. However, if they was to update the patient profile information or the medication list, the original user (admin) will have to approve the changes before they are presented to all users on this patient's profile.
- 
```
POST /api/auth/register ✓ [TESTED]
POST /api/auth/login ✓ [TESTED]
POST /api/auth/refresh (ADD - for token refresh) [NOT WRITTEN]
POST /api/auth/forgot-password [TESTED]
POST /api/auth/reset-password [TESTED]

- password reset function/controller
   1. initiate reset: find user by email, generate random reset token, save hashed token to user, send reset password email
   2. reset password(token, new_pw) -> hash token for comparison, find user w corresponding token, update pw + clear reset token
- 
```

### **Patients**

Notes:
- After logging in as a caregiver, you will have access to your patient list on the left. You can have access to more than one patient so long as you've been approved by the admin, then they will remain there unless access is removed by the admin.
- Any user can create a patient profile.

```
GET /api/patients ✓
GET /api/patients/:id ✓
POST /api/patients ✓
PUT /api/patients/:id ✓
DELETE /api/patients/:id (ADD - for removing patients)
GET /api/patients/:id/caregivers (ADD - list all caregivers with access)
POST /api/patients/:id/caregivers (ADD - invite/add caregiver)
DELETE /api/patients/:id/caregivers/:userId (ADD - remove caregiver access)
```

### **Shifts**

Notes:
- All caregivers should have access to all shift and medication information
- Only the admin/main caregiver will be able to create, update or delete shifts and/or medications.
- However, all other users should be able to submit a request to create, update or delete shifts and/or medications -> the request will be sent to the admin user to be approved. Once approved it will appear on the calender.

```
GET /api/patients/:patientId/shifts?startDate=xxx&endDate=xxx
POST /api/patients/:patientId/shifts
PUT /api/patients/:patientId/shifts/:id
DELETE /api/patients/:patientId/shifts/:id
GET /api/shifts/my-shifts?startDate=xxx&endDate=xxx (ADD - for caregiver's personal schedule)
```

### **Medications**

```
GET /api/patients/:patientId/medications ✓
POST /api/patients/:patientId/medications ✓
PUT /api/patients/:patientId/medications/:id (ADD)
DELETE /api/patients/:patientId/medications/:id (ADD)

GET /api/patients/:patientId/medications/logs?date=xxx&startDate=xxx&endDate=xxx
POST /api/patients/:patientId/medications/logs ✓
PUT /api/patients/:patientId/medications/logs/:id (ADD - for corrections)
DELETE /api/patients/:patientId/medications/logs/:id (ADD)
```

### **ADLs**

Notes:
- This section can be accessed and edited by all users without permissions required.

```
GET /api/patients/:patientId/adls ✓
POST /api/patients/:patientId/adls ✓
PUT /api/patients/:patientId/adls/:id (ADD)
DELETE /api/patients/:patientId/adls/:id (ADD)

GET /api/patients/:patientId/adls/logs?date=xxx&startDate=xxx&endDate=xxx
POST /api/patients/:patientId/adls/logs ✓
PUT /api/patients/:patientId/adls/logs/:id (ADD - for corrections)
DELETE /api/patients/:patientId/adls/logs/:id ✓
```

### **Handover Notes**

Notes:
- All users should be able to post handover notes, and they should be allowed to edit  r delete notes that they themselves have posted.

```
GET /api/patients/:patientId/notes?date=xxx&startDate=xxx&endDate=xxx ✓
POST /api/patients/:patientId/notes ✓
PUT /api/patients/:patientId/notes/:noteId (FIXED)
DELETE /api/patients/:patientId/notes/:noteId (FIXED)
```

### **7. Permissions/Approvals (NEW Section)**

```
GET /api/patients/:patientId/pending-requests (get all pending approval requests)
POST /api/patients/:patientId/requests (submit a change request)
PUT /api/patients/:patientId/requests/:requestId/approve (approve request)
PUT /api/patients/:patientId/requests/:requestId/reject (reject request)
DELETE /api/patients/:patientId/requests/:requestId (withdraw request)
```


### **Key Design Decisions:**

Separation of Templates & Logs - Medications and ADLs have master records and daily completion logs
JWT Authentication - Token-based auth with middleware
Indexing - Added indexes on frequently queried fields (patient + date)
Population - Relations populated for richer responses
Role-Based Access - User roles for different permission levels



### **OTHER CONSIDERATIONS**

1. **User Management Endpoints** (if users need to update profiles):
```
   GET /api/users/:id
   PUT /api/users/:id
   PUT /api/users/:id/password
```

2. **Dashboard/Summary Endpoints**:
```
   GET /api/patients/:patientId/dashboard?date=xxx
   // Returns summary: upcoming shifts, pending meds, incomplete ADLs, recent notes
```

3. **Notifications**:
```
   GET /api/notifications
   PUT /api/notifications/:id/read