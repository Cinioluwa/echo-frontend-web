# Frontend Multitenancy Integration Guide

## Overview

Echo API is a multi-tenant platform where each organization has completely isolated data. Users belong to one organization and can only access data within their organization. This guide explains how frontend applications should interact with the API to properly handle multitenancy.

## Key Concepts

### What is a Tenant?
- A **tenant** is an organization (e.g., a university, company, or institution)
- Each tenant has its own users, pings, waves, comments, and all other data
- Tenants are completely isolated - Organization A cannot see Organization B's data

### Organization Identification
- Organizations are identified by:
  - **ID**: Numeric identifier (e.g., `1`, `2`, `3`)
  - **Domain**: Unique domain string (e.g., `university.edu`, `company.com`)

## Authentication & Organization Context

### User Registration Flow

When a user registers, they must be associated with an organization:

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@university.edu",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": 1
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 123,
    "email": "user@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "organizationId": 1,
    "role": "USER",
    "status": "PENDING"
  }
}
```

### Login Flow

When a user logs in, the JWT token automatically includes their organization context:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@university.edu",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 123,
    "email": "user@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "organizationId": 1,
    "role": "USER"
  }
}
```

**Important:** The JWT token contains:
- `userId`: The user's ID
- `organizationId`: The user's organization ID
- `role`: The user's role (USER, REPRESENTATIVE, ADMIN, SUPER_ADMIN)

### Google OAuth Flow

Google OAuth also requires organization context:

```http
POST /api/auth/google/callback
Content-Type: application/json

{
  "credential": "google_id_token_here",
  "organizationId": 1
}
```

## Making API Requests

### Standard Authenticated Requests

For most API calls, simply include the JWT token. The backend automatically scopes all data to the user's organization:

```javascript
// Example: Fetch all pings
fetch('/api/pings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

The backend will:
1. Verify the token
2. Extract the `organizationId` from the token
3. Return only pings from that organization

### Creating Content

When creating content (pings, waves, comments), you **don't need** to send `organizationId` - it's automatically added from your token:

```javascript
// Create a ping
fetch('/api/pings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "New Feature Request",
    content: "We need a dark mode",
    categoryId: 5,
    hashtag: "feature"
  })
  // No organizationId needed!
})
```

### Public Endpoints

Public endpoints (no authentication required) need the organization context via domain or ID:

```javascript
// Option 1: Query parameter with organizationId
fetch('/api/public/pings?organizationId=1')

// Option 2: Query parameter with domain
fetch('/api/public/pings?domain=university.edu')

// Option 3: Custom header
fetch('/api/public/pings', {
  headers: {
    'x-organization-domain': 'university.edu'
  }
})
```

## User Roles & Permissions

### Role Hierarchy

1. **USER** - Regular users
   - Can create pings, waves, comments
   - Can surge (like) content
   - Can only see content from their organization

2. **REPRESENTATIVE** - Elevated users
   - All USER permissions
   - Can flag waves for admin review
   - Can view flagged content

3. **ADMIN** - Organization administrators
   - All REPRESENTATIVE permissions
   - Can manage users within their organization
   - Can create announcements
   - Can update ping progress status
   - Can delete content within their organization
   - **Cannot access other organizations' data**

4. **SUPER_ADMIN** - Platform administrators
   - Can access any organization's data
   - Must explicitly specify which organization to operate on

### SUPER_ADMIN Special Handling

If your user is a SUPER_ADMIN, you must specify the target organization:

```javascript
// Option 1: Via header (recommended)
fetch('/api/admin/stats', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-organization-id': '1',
    'Content-Type': 'application/json'
  }
})

// Option 2: Via query parameter
fetch('/api/admin/stats?organizationId=1', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

**Note:** Regular ADMIN users don't need to specify `organizationId` - it's automatically taken from their token.

## Frontend Implementation Patterns

### 1. Store Organization Context

After login, store the user's organization information:

```javascript
// Store in state management (Redux, Zustand, etc.)
const loginUser = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Store token and user info
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return {
    token: data.token,
    user: data.user // includes organizationId
  };
};
```

### 2. Display Organization Context (Optional)

You can optionally display which organization the user belongs to:

```jsx
// React example
function Header({ user }) {
  return (
    <header>
      <h1>Echo - {user.organization?.name || 'Your Organization'}</h1>
      <p>Welcome, {user.firstName}!</p>
    </header>
  );
}
```

### 3. Handle Public Pages

For public pages (landing pages, public feed), allow organization selection:

```jsx
// Organization selector for public pages
function PublicFeed() {
  const [selectedOrg, setSelectedOrg] = useState('university.edu');
  
  useEffect(() => {
    fetch(`/api/public/pings?domain=${selectedOrg}`)
      .then(res => res.json())
      .then(data => setPings(data));
  }, [selectedOrg]);
  
  return (
    <div>
      <select value={selectedOrg} onChange={e => setSelectedOrg(e.target.value)}>
        <option value="university.edu">University</option>
        <option value="company.com">Company</option>
      </select>
      {/* Display pings */}
    </div>
  );
}
```

### 4. Error Handling

Handle organization-related errors:

```javascript
const handleApiError = (response) => {
  if (response.status === 403) {
    if (response.data?.error?.includes('Organization is not active')) {
      // Organization is inactive - show appropriate message
      showError('Your organization account is currently inactive. Please contact support.');
    }
  }
  
  if (response.status === 400) {
    if (response.data?.error?.includes('Organization context missing')) {
      // Token is invalid or missing organization context
      logout();
      redirectToLogin();
    }
  }
};
```

## API Endpoints Reference

### Authentication Endpoints
- `POST /api/auth/register` - Register (requires `organizationId`)
- `POST /api/auth/login` - Login (returns user with `organizationId`)
- `POST /api/auth/google/callback` - Google OAuth (requires `organizationId`)

### Public Endpoints (No Auth Required)
All public endpoints accept organization via query params or headers:
- `GET /api/public/pings?domain=university.edu` - Get public pings
- `GET /api/public/pings?organizationId=1` - Get public pings (by ID)
- `GET /api/public/categories?domain=university.edu` - Get categories

### Protected Endpoints (Auth Required)
These automatically use the user's organization from the token:
- `GET /api/pings` - Get all pings (from your org)
- `POST /api/pings` - Create ping (in your org)
- `GET /api/waves/:pingId` - Get waves for ping (from your org)
- `POST /api/comments` - Create comment (in your org)
- `GET /api/announcements` - Get announcements (from your org)

### Admin Endpoints (ADMIN/SUPER_ADMIN Required)
- Regular ADMINs: Automatically scoped to their organization
- SUPER_ADMINs: Must specify `x-organization-id` header or `organizationId` query param

## Common Scenarios

### Scenario 1: User Signs Up
```javascript
// 1. User selects their organization (from a dropdown/search)
const organizations = await fetch('/api/public/organizations').then(r => r.json());

// 2. User submits registration with selected organization
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newuser@university.edu',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Doe',
    organizationId: selectedOrganizationId
  })
});
```

### Scenario 2: User Views Feed
```javascript
// Simply fetch - backend handles organization scoping
const pings = await fetch('/api/pings', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// All pings returned are from the user's organization only
```

### Scenario 3: Admin Views Statistics
```javascript
// ADMIN user - automatically scoped
const stats = await fetch('/api/admin/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// SUPER_ADMIN user - must specify organization
const stats = await fetch('/api/admin/stats', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'x-organization-id': '1'
  }
}).then(r => r.json());
```

### Scenario 4: Public User Browses Content
```javascript
// No authentication, must specify organization
const publicPings = await fetch('/api/public/pings?domain=university.edu')
  .then(r => r.json());
```

## Security Notes

### What Happens Automatically
✅ **Organization isolation** - Backend enforces this at the database level  
✅ **Token validation** - Backend verifies JWT and extracts organization  
✅ **Data scoping** - All queries automatically filter by organization  

### What You Should NOT Do
❌ Don't send `organizationId` in request bodies (except registration/OAuth)  
❌ Don't try to access other organizations' data  
❌ Don't cache data across different organization contexts  
❌ Don't assume organization IDs in code (always get from API)  

### What You Should Do
✅ Store and use the JWT token for all authenticated requests  
✅ Handle 403 errors (organization inactive)  
✅ Handle 401 errors (token invalid/expired)  
✅ Provide organization selection for public pages  
✅ Show clear feedback when user's organization is inactive  

## Testing Multitenancy

### Create Test Users in Different Organizations
```javascript
// Organization 1 User
const user1 = await register({
  email: 'user1@org1.edu',
  password: 'pass123',
  organizationId: 1
});

// Organization 2 User
const user2 = await register({
  email: 'user2@org2.edu',
  password: 'pass123',
  organizationId: 2
});

// Verify isolation: user1 cannot see user2's pings
const user1Token = await login('user1@org1.edu', 'pass123');
const pings = await fetch('/api/pings', {
  headers: { 'Authorization': `Bearer ${user1Token}` }
});
// Should only return organization 1 pings
```

## Troubleshooting

### "Organization context missing" Error
**Cause:** Token is invalid or doesn't contain organizationId  
**Solution:** User needs to log in again

### "Organization is not active" Error
**Cause:** User's organization has been deactivated  
**Solution:** Show message to contact administrator

### "SUPER_ADMIN must specify an organization" Error
**Cause:** SUPER_ADMIN made request without organization context  
**Solution:** Add `x-organization-id` header or `organizationId` query param

### Data Appears Empty
**Cause:** User's organization might not have any data yet  
**Solution:** Verify organization has data, or guide user to create content

## Summary

**For Frontend Developers:**
1. Store the JWT token after login - it contains everything needed
2. Include `Authorization: Bearer <token>` header in all authenticated requests
3. The backend automatically handles organization scoping - you don't need to think about it
4. For public endpoints, specify organization via query param or header
5. Handle SUPER_ADMIN role specially (requires explicit organization specification)
6. Trust the backend to enforce isolation - focus on building great UX

**What Makes This Simple:**
- No complex organization switching logic needed
- No manual filtering of data by organization
- No risk of accidentally showing wrong data
- Token-based automatic scoping
- Clear error messages when something's wrong

The multitenancy is designed to be **invisible to regular users** while providing complete data isolation between organizations.
