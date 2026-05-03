# Administration Model & Singleton Pattern Guide

## Overview

The `admin.model.js` implements a **Singleton Pattern** for the Administration service in the BucketLab API. This ensures that only one Administration instance exists across the entire system, serving as the centralized hub for all administrative operations, particularly permission request management.

## What is a Singleton?

A Singleton is a design pattern that restricts instantiation to a single, unique object. In the context of the BucketLab Administration service:

- **Only one Administration document** can exist in the MongoDB database
- **All permission requests** from all users flow through this single instance
- **No duplicates** can be accidentally created due to schema constraints
- **Centralized control** ensures consistent permission workflows

## Schema Structure

### Core Fields

#### `_singleton` (Boolean)
- **Type**: Boolean
- **Immutable**: Yes (cannot be changed after creation)
- **Default**: `true`
- **Purpose**: Serves as a marker for the singleton instance
- **Index**: Unique index on `_singleton` prevents multiple instances

#### `initiated_by_profile` (ObjectId)
- **Type**: Schema.Types.ObjectId (references Profile model)
- **Required**: Yes
- **Immutable**: Yes (cannot be changed after creation)
- **Purpose**: Permanently tracks which profile created/initiated the Administration singleton
- **Security Implication**: Only profiles with 'empire' permission should be allowed to initialize

#### `requested_permissions` (Array of Objects)
- **Type**: Array of embedded permission schemas
- **Default**: Empty array `[]`
- **Schema Reference**: `requestedPermissionsSchema`
- **Purpose**: Stores all permission requests from users with status tracking (pending, approved, rejected)
- **Structure**: Each permission object includes:
  - `name`: Permission name being requested
  - `requested_by`: User/Profile ID who requested it
  - `request_status`: Status (pending/approved/rejected)
  - `update_history`: Audit trail of status changes

#### `depends_on_profile` (ObjectId)
- **Type**: Schema.Types.ObjectId (references Auth model)
- **Required**: No
- **Sparse**: Yes (allows missing value without duplicate key error)
- **Immutable**: Yes (only once set, cannot be changed)
- **Purpose**: Optional link to an associated Auth profile for administrative purposes

#### `email` (String)
- **Type**: String
- **Lowercase**: Automatically converted to lowercase
- **Purpose**: Contact email for the administration account
- **Default**: `'administrator@bucketlab.io'`

#### `password` (String)
- **Type**: String
- **Minimum Length**: 9 characters
- **Purpose**: Hashed password for admin authentication
- **Processing**: Automatically hashed via pre-save hook using bcrypt

#### `created_at` (Date)
- **Type**: Date
- **Immutable**: Yes
- **Default**: Current timestamp (ISO string)
- **Purpose**: Tracks when the singleton was initialized

#### `updated_at` (Date)
- **Type**: Date
- **Default**: Current timestamp (ISO string)
- **Purpose**: Tracks when the singleton was last modified

## Singleton Enforcement Mechanism

### MongoDB Unique Index
```javascript
adminSchema.index({ _singleton: 1 }, { unique: true });
```

This creates a unique index on the `_singleton` field. Since `_singleton` is always set to `true`, MongoDB enforces that only one document can have this value:

- **First document creation**: Succeeds, sets `_singleton: true`
- **Second document creation attempt**: **Fails with duplicate key error**

### Immutable Field Protection
```javascript
_singleton: {
  type: Boolean,
  immutable: true,  // Cannot be modified
  default: true
}
```

The `immutable: true` setting prevents any modification to the `_singleton` field after creation, maintaining integrity.

## Static Methods

### `Administration.initializeSingleton(profileId, initiatorPassword, overridePassword)`

**Purpose**: One-time initialization of the Administration singleton. Can only be called successfully once.

**Parameters**:
- `profileId` (String/ObjectId): The profile ID of the account initializing the singleton (must have 'empire' permission)
- `initiatorPassword` (String): Password provided by the initiator, must match `ADMIN_INIT_PASSWORD` environment variable
- `overridePassword` (String, optional): Custom password for the admin account; defaults to temporary placeholder

**Validation Steps**:
1. **Check Existing Singleton**: Queries for any existing singleton (`_singleton: true`)
   - If found: Throws error with status 409 (Conflict) - prevents multiple instances
2. **Validate Environment Configuration**: Checks if `ADMIN_INIT_PASSWORD` is set in `.env`
   - If missing: Throws error with status 500 (Server Error) - prevents misconfiguration
3. **Verify Initiator Password**: Compares provided password to `ADMIN_INIT_PASSWORD`
   - If mismatch: Throws error with status 401 (Unauthorized) - prevents unauthorized initialization
4. **Create Singleton**: If all validations pass, creates the Administration document with:
   - `_singleton: true`
   - `initiated_by_profile: profileId`
   - Email and password fields
   - Default empty `requested_permissions` array

**Return**: The created Administration document with populated fields

**Error Responses**:
```javascript
// Status 409: Singleton already exists
{
  message: 'Administration singleton has already been initialized. No additional singletons can be created.'
}

// Status 500: Missing environment configuration
{
  message: 'ADMIN_INIT_PASSWORD is not configured in environment variables.'
}

// Status 401: Invalid password
{
  message: 'Invalid initiator password. Cannot create Administration singleton.'
}
```

### `Administration.getSingleton()`

**Purpose**: Retrieve the existing Administration singleton for reading permission requests and status.

**Returns**: The Administration document with `initiated_by_profile` populated (or null if not yet initialized)

**Usage**: Used by controllers when:
- Processing permission requests from users
- Approving/rejecting permission requests
- Reading current permission request queue
- Checking admin status

**Note**: This is a read-only operation and does not modify any data.

## Pre-Save Hook: Password Hashing

```javascript
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // Only hash if password was actually modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } else {
    next();
  }
});
```

**Purpose**: Automatically hashes passwords before saving to database

**Behavior**:
- Checks if password field was modified in this save operation
- If modified: Generates salt and hashes using bcrypt (10 rounds)
- If not modified: Skips hashing (for other field updates)
- Prevents storing plain-text passwords

## Initialization Process

### Step 1: Environment Setup
Ensure `ADMIN_INIT_PASSWORD` is configured in your `.env` file:
```
ADMIN_INIT_PASSWORD=your_secure_initialization_password
```

### Step 2: Endpoint Call
A profile with 'empire' permission makes a POST request to `/permissions/initialize-singleton`:

```javascript
POST /permissions/initialize-singleton
Content-Type: application/json

{
  "initiator_password": "your_secure_initialization_password"
}
```

Headers must include a valid JWT token for the user with 'empire' permission.

### Step 3: Validation & Creation
1. Middleware validates JWT and extracts user ID
2. Controller validates `initiator_password` against environment variable
3. Model's `initializeSingleton()` method:
   - Checks for existing singleton
   - Validates password
   - Creates document with `_singleton: true`
   - Persists to database

### Step 4: Lock-In
Once created, the singleton is locked:
- Same user cannot initialize again (409 Conflict)
- No other user can initialize (409 Conflict)
- `initiated_by_profile` is immutable - permanent record of who initialized
- `_singleton` field is immutable - cannot be manipulated

## Permission Request Workflow

Once the singleton is initialized, the system operates as follows:

### User Requests Permission
```javascript
GET /permissions/request?permission=read:laboratory
Authorization: Bearer <user_jwt_token>
```

### Controller Action
1. Retrieves the singleton via `Administration.getSingleton()`
2. If no singleton exists → returns 503 (Service Unavailable)
3. Adds permission request to singleton's `requested_permissions` array:
   ```javascript
   {
     name: 'read:laboratory',
     requested_by: '<user_id>',
     request_status: 'pending',
     created_at: '<timestamp>'
   }
   ```
4. Saves updated singleton to database
5. Returns success response to user

### Administrator Reviews
Administrator can query the singleton to see:
- All pending permission requests
- User who requested each permission
- Timestamp of each request
- Current status of each request

### Administrator Approves/Rejects
Administrator updates permission status in the singleton's array via PATCH controller:
- Changes `request_status` from 'pending' to 'approved' or 'rejected'
- Records status change in `update_history` for audit trail

## Security Considerations

### 1. Initialization Password
- Must be strong and stored securely in `.env`
- Different from regular user passwords
- Not used after singleton creation
- Only checked during initialization

### 2. Immutable Fields
- `_singleton`: Cannot be changed (enforced by schema)
- `initiated_by_profile`: Permanent audit trail of who initialized
- Cannot be exploited to create multiple singletons

### 3. Unique Index Enforcement
- MongoDB enforces uniqueness at database level
- Even if application logic is bypassed, schema constraint prevents duplicates
- Application must handle duplicate key error (409) gracefully

### 4. Permission Access
- Singleton initialization requires 'empire' permission (verified in middleware)
- Permission requests require valid JWT token
- Reading singleton is admin-only (future: implement authorization checks)

## Common Operations

### Initialize Singleton (Once Only)
```javascript
const admin = await Administration.initializeSingleton(
  profileId,
  'ADMIN_INIT_PASSWORD_value',
  'optional_custom_password'
);
```

### Get Singleton for Reading
```javascript
const admin = await Administration.getSingleton();

// Check if initialized
if (!admin) {
  console.log('Singleton not yet initialized');
}

// Access permission requests
admin.requested_permissions.forEach(req => {
  console.log(`${req.name} requested by ${req.requested_by}`);
});
```

### Modify Permission Request Status
```javascript
const admin = await Administration.getSingleton();

// Find and update permission
const permReq = admin.requested_permissions.find(p => p.name === 'read:laboratory');
if (permReq) {
  permReq.request_status = 'approved';
  admin.updated_at = new Date();
  await admin.save();
}
```

## Error Handling

When working with the singleton, handle these scenarios:

```javascript
try {
  // Try to initialize
  const admin = await Administration.initializeSingleton(profileId, password);
} catch (error) {
  switch (error.status) {
    case 401:
      // Invalid password
      res.status(401).json({ message: 'Invalid initiator password' });
      break;
    case 409:
      // Already initialized
      res.status(409).json({ message: 'Singleton already exists' });
      break;
    case 500:
      // Server configuration error
      res.status(500).json({ message: 'Server misconfiguration' });
      break;
    default:
      res.status(500).json({ message: 'Unexpected error' });
  }
}
```

## Testing the Singleton

### Verify Only One Instance Exists
```javascript
const count = await Administration.countDocuments();
// Should always be 0 (not initialized) or 1 (initialized)
```

### Attempt to Create Duplicate (Should Fail)
```javascript
const admin1 = new Administration({
  _singleton: true,
  initiated_by_profile: profileId1,
  email: 'admin1@test.com',
  password: 'password123'
});
await admin1.save(); // Succeeds

const admin2 = new Administration({
  _singleton: true,
  initiated_by_profile: profileId2,
  email: 'admin2@test.com',
  password: 'password456'
});
await admin2.save(); // Fails: duplicate key error
```

## Related Files

- **Controller**: `/src/v1/controllers/PermissionsController/POST/initializeSingleton.js` - Handles initialization endpoint
- **Routes**: `/src/v1/routes/permissionsRouter.js` - Defines `/initialize-singleton` endpoint
- **Middleware**: `/src/v1/middleware/permissionsMiddleware.js` - Validates JWT for protected endpoints
- **Permissions Schema**: `/src/v1/models/permissions.schema.js` - Defines permission request structure
- **Environment**: `.env` - Must contain `ADMIN_INIT_PASSWORD`

## Summary

The Administration singleton pattern provides:
- ✅ **Uniqueness**: Only one admin instance ever exists
- ✅ **Centralization**: All permission requests flow through one location
- ✅ **Security**: Requires special password and profile permission to initialize
- ✅ **Auditability**: Tracks which profile initialized the system
- ✅ **Permanence**: Once created, cannot be duplicated or reset
- ✅ **Immutability**: Critical fields cannot be modified after creation
