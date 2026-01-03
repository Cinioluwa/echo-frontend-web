# Echo Backend API Documentation

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Common Response Formats](#common-response-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication & Users](#authentication--users)
  - [Pings (Posts/Issues)](#pings-postsissues)
  - [Waves (Solutions)](#waves-solutions)
  - [Comments](#comments)
  - [Surges (Likes)](#surges-likes)
  - [Categories](#categories)
  - [Announcements](#announcements)
  - [Public Feed](#public-feed)
  - [Admin Routes](#admin-routes)
  - [Representative Routes](#representative-routes)

---

## Overview

Echo is a multi-tenant platform for organizational feedback and community engagement. Users belong to organizations (identified by email domain) and can create pings (issues/posts), waves (solutions), comments, and surges (likes).

**Key Concepts:**

- **Organization**: Multi-tenant isolation - all data is organization-scoped
- **Ping**: A post/issue/question raised by a user
- **Wave**: A solution or response to a ping
- **Surge**: A like/upvote on a ping or wave
- **Comment**: Discussion on pings or waves
- **Official Response**: Representative's official answer to a ping

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### JWT Payload Structure

```json
{
  "userId": 123,
  "organizationId": 456,
  "role": "USER" | "ADMIN" | "REPRESENTATIVE"
}
```

### User Roles

- **USER**: Standard user (can create pings, waves, comments, surges)
- **REPRESENTATIVE**: Can submit pings for review, create official responses, view submitted pings
- **ADMIN**: Full access to platform stats, user management, announcements

---

## Base URL

Development: `http://127.0.0.1:<PORT>/api`

All routes are prefixed with `/api`

---

## Common Response Formats

### Success Response (Single Resource)

```json
{
  "id": 1,
  "title": "Example Ping",
  "content": "...",
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

### Success Response (List with Pagination)

```json
{
  "data": [...],
  "pagination": {
    "totalPings": 100,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE" // Optional
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Common Error Codes

- `ORG_NOT_FOUND` - No organization for email domain
- `ORG_PENDING_ACTIVATION` - Organization not active yet
- `ACCOUNT_EXISTS` - User already registered
- `ACCOUNT_PENDING_VERIFICATION` - Email not verified
- `CONSUMER_DOMAIN_NOT_ALLOWED` - Personal email not allowed
- `GOOGLE_AUTH_REQUIRED` - Account uses Google Sign-In

---

## Rate Limiting

### Global Rate Limits

- **General requests**: 500 requests per 15 minutes
- **Auth endpoints**: 5 attempts per 15 minutes
- **Create operations** (POST/PATCH/DELETE): 30 requests per 15 minutes

### Rate Limit Headers

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 499
X-RateLimit-Reset: 1699362000
```

---

## API Endpoints

## Authentication & Users

### POST /api/users/register

Register a new user account.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "student@university.edu",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "level": 200 // Optional: student year/level
}
```

**Success Response (201):**

```json
{
  "message": "Account created. Please verify your email to activate your profile.",
  "user": {
    "id": 1,
    "email": "student@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "level": 200,
    "organizationId": 1,
    "role": "USER",
    "status": "PENDING_VERIFICATION",
    "createdAt": "2025-11-07T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Invalid email format, missing fields
- `404` - `ORG_NOT_FOUND` - No organization for email domain
- `409` - `ACCOUNT_EXISTS` - User already exists

---

### POST /api/users/login

Login with email and password.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "student@university.edu",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- `400` - Invalid credentials, `GOOGLE_AUTH_REQUIRED` (if Google OAuth account)
- `401` - Invalid email or password
- `403` - `ACCOUNT_PENDING_VERIFICATION` - Email not verified
- `404` - `ORG_NOT_FOUND` - Organization not found

---

### POST /api/auth/google

Authenticate with Google OAuth.

**Auth Required:** No

**Request Body:**

```json
{
  "token": "google_id_token_here"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- Auto-creates user if doesn't exist
- Auto-verifies email (Google already verified)
- Rejects consumer email domains (gmail.com, yahoo.com, etc.)

---

### POST /api/users/verify-email

Verify email address with token sent via email.

**Auth Required:** No

**Request Body:**

```json
{
  "token": "verification_token_from_email"
}
```

**Success Response (200):**

```json
{
  "message": "Email verified successfully. You can now log in."
}
```

---

### POST /api/users/forgot-password

Request password reset email.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "student@university.edu"
}
```

**Success Response (200):**

```json
{
  "message": "If an account exists, a password reset link has been sent."
}
```

---

### PATCH /api/users/reset-password

Reset password with token from email.

**Auth Required:** No

**Request Body:**

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

---

### POST /api/users/organization-waitlist

Request new organization onboarding.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "admin@neworg.edu",
  "organizationName": "New University",
  "message": "We'd like to use Echo for our campus"
}
```

**Success Response (201):**

```json
{
  "message": "Request submitted. We'll contact you shortly."
}
```

---

### GET /api/users/me

Get current user profile.

**Auth Required:** Yes

**Success Response (200):**

```json
{
  "id": 1,
  "email": "student@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "level": 200,
  "role": "USER",
  "organizationId": 1,
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

---

### PATCH /api/users/me

Update current user profile (first name, last name only).

**Auth Required:** Yes

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "email": "student@university.edu",
  "firstName": "Jane",
  "lastName": "Smith",
  "level": 200,
  "role": "USER"
}
```

---

### DELETE /api/users/me

Delete current user account (permanent).

**Auth Required:** Yes

**Success Response (204):** No content

---

### GET /api/users/me/surges

Get all surges (likes) by current user.

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "pingId": 5,
      "waveId": null,
      "createdAt": "2025-11-07T10:30:00.000Z",
      "ping": {
        "id": 5,
        "title": "Exam Schedule Conflict",
        "surgeCount": 42
      }
    }
  ],
  "pagination": {
    "totalSurges": 15,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 20
  }
}
```

---

### GET /api/users/me/comments

Get all comments by current user.

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "content": "Great idea!",
      "authorId": 1,
      "pingId": 5,
      "waveId": null,
      "createdAt": "2025-11-07T10:30:00.000Z"
    }
  ],
  "pagination": {
    "totalComments": 8,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 20
  }
}
```

---

## Pings (Posts/Issues)

### POST /api/pings

Create a new ping.

**Auth Required:** Yes

**Request Body:**

```json
{
  "title": "Library Hours Too Short",
  "content": "The library closes at 8pm but students need late-night study spaces...",
  "categoryId": 3,
  "hashtag": "library" // Optional
}
```

**Success Response (201):**

```json
{
  "id": 1,
  "title": "Library Hours Too Short",
  "content": "The library closes at 8pm...",
  "categoryId": 3,
  "hashtag": "library",
  "status": "POSTED",
  "progressStatus": "PENDING",
  "surgeCount": 0,
  "authorId": 1,
  "organizationId": 1,
  "createdAt": "2025-11-07T10:30:00.000Z",
  "updatedAt": "2025-11-07T10:30:00.000Z"
}
```

---

### GET /api/pings

Get all pings in organization (with filters & pagination).

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category ID
- `status` (optional): Filter by status (`POSTED`, `UNDER_REVIEW`, `ARCHIVED`)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Library Hours Too Short",
      "content": "The library closes at 8pm...",
      "status": "POSTED",
      "surgeCount": 42,
      "hashtag": "library",
      "createdAt": "2025-11-07T10:30:00.000Z",
      "author": {
        "id": 1,
        "email": "student@university.edu",
        "firstName": "John",
        "lastName": "Doe",
        "level": 200
      },
      "category": {
        "id": 3,
        "name": "Facilities"
      },
      "_count": {
        "waves": 5,
        "comments": 12,
        "surges": 42
      }
    }
  ],
  "pagination": {
    "totalPings": 100,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### GET /api/pings/search

Search pings by hashtag or text query.

**Auth Required:** Yes

**Query Parameters:**

- `hashtag` (optional): Search by hashtag
- `q` (optional): Text search in title/content
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example:** `/api/pings/search?hashtag=library&page=1`

**Success Response (200):**

```json
{
  "data": [...],  // Same structure as GET /api/pings
  "pagination": {...}
}
```

---

### GET /api/pings/me

Get current user's pings.

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Library Hours Too Short",
      "content": "...",
      "status": "POSTED",
      "surgeCount": 42,
      "createdAt": "2025-11-07T10:30:00.000Z",
      "_count": {
        "waves": 5,
        "comments": 12,
        "surges": 42
      }
    }
  ],
  "pagination": {...}
}
```

---

### GET /api/pings/:id

Get a specific ping by ID with full details.

**Auth Required:** Yes

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Library Hours Too Short",
  "content": "The library closes at 8pm...",
  "status": "POSTED",
  "progressStatus": "PENDING",
  "surgeCount": 42,
  "hashtag": "library",
  "createdAt": "2025-11-07T10:30:00.000Z",
  "author": {
    "id": 1,
    "email": "student@university.edu",
    "firstName": "John",
    "lastName": "Doe"
  },
  "waves": [
    {
      "id": 1,
      "solution": "Extend library hours to midnight on weekdays",
      "surgeCount": 15,
      "viewCount": 200,
      "createdAt": "2025-11-07T11:00:00.000Z",
      "_count": {
        "surges": 15,
        "comments": 3
      }
    }
  ],
  "comments": [
    {
      "id": 1,
      "content": "I agree, this is a major issue!",
      "createdAt": "2025-11-07T10:45:00.000Z",
      "author": {
        "id": 2,
        "email": "student2@university.edu",
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  ],
  "officialResponse": {
    "id": 1,
    "content": "We are reviewing library hours for next semester.",
    "createdAt": "2025-11-08T09:00:00.000Z",
    "author": {
      "id": 3,
      "email": "admin@university.edu",
      "firstName": "Admin",
      "lastName": "User"
    }
  }
}
```

---

### PATCH /api/pings/:id

Update a ping (author only).

**Auth Required:** Yes (must be author)

**Request Body:**

```json
{
  "title": "Updated Title", // Optional
  "content": "Updated content..." // Optional
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "updatedAt": "2025-11-07T11:00:00.000Z"
}
```

---

### DELETE /api/pings/:id

Delete a ping (author only).

**Auth Required:** Yes (must be author)

**Success Response (204):** No content

---

### PATCH /api/pings/:id/status

Update ping status (admin only).

**Auth Required:** Yes (ADMIN role)

**Request Body:**

```json
{
  "status": "UNDER_REVIEW" | "POSTED" | "ARCHIVED"
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "status": "UNDER_REVIEW",
  "updatedAt": "2025-11-07T11:00:00.000Z"
}
```

---

### PATCH /api/pings/:id/submit

Submit ping for review (representative only).

**Auth Required:** Yes (REPRESENTATIVE role)

**Success Response (200):**

```json
{
  "id": 1,
  "status": "UNDER_REVIEW",
  "updatedAt": "2025-11-07T11:00:00.000Z"
}
```

---

## Waves (Solutions)

### POST /api/pings/:pingId/waves

Create a wave (solution) for a ping.

**Auth Required:** Yes

**Request Body:**

```json
{
  "solution": "Extend library hours to midnight on weekdays, and offer 24/7 access during finals week."
}
```

**Success Response (201):**

```json
{
  "id": 1,
  "solution": "Extend library hours to midnight...",
  "pingId": 1,
  "surgeCount": 0,
  "viewCount": 0,
  "flaggedForReview": false,
  "organizationId": 1,
  "createdAt": "2025-11-07T11:00:00.000Z"
}
```

---

### GET /api/pings/:pingId/waves

Get all waves for a specific ping.

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "solution": "Extend library hours to midnight...",
      "surgeCount": 15,
      "viewCount": 200,
      "createdAt": "2025-11-07T11:00:00.000Z",
      "comments": [
        {
          "id": 1,
          "content": "Great solution!",
          "author": {
            "id": 2,
            "email": "student2@university.edu",
            "firstName": "Jane",
            "lastName": "Smith"
          }
        }
      ],
      "_count": {
        "comments": 3,
        "surges": 15
      }
    }
  ],
  "pagination": {
    "totalWaves": 5,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 20,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

### GET /api/waves/:id

Get a specific wave by ID (increments view count).

**Auth Required:** Yes

**Success Response (200):**

```json
{
  "id": 1,
  "solution": "Extend library hours to midnight...",
  "surgeCount": 15,
  "viewCount": 201,
  "createdAt": "2025-11-07T11:00:00.000Z",
  "ping": {
    "id": 1,
    "title": "Library Hours Too Short",
    "author": {
      "id": 1,
      "email": "student@university.edu",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "comments": [...],
  "_count": {
    "comments": 3,
    "surges": 15
  }
}
```

---

## Comments

### POST /api/pings/:pingId/comments

Create a comment on a ping.

**Auth Required:** Yes

**Request Body:**

```json
{
  "content": "I completely agree with this!"
}
```

**Success Response (201):**

```json
{
  "id": 1,
  "content": "I completely agree with this!",
  "authorId": 1,
  "pingId": 1,
  "createdAt": "2025-11-07T11:30:00.000Z",
  "author": {
    "id": 1,
    "email": "student@university.edu",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### GET /api/pings/:pingId/comments

Get all comments for a ping.

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "content": "I completely agree with this!",
      "createdAt": "2025-11-07T11:30:00.000Z",
      "author": {
        "id": 1,
        "email": "student@university.edu",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "pagination": {
    "totalComments": 12,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 50
  }
}
```

---

### POST /api/waves/:waveId/comments

Create a comment on a wave.

**Auth Required:** Yes

**Request Body:**

```json
{
  "content": "This solution makes a lot of sense!"
}
```

**Success Response (201):** Same structure as ping comments

---

### GET /api/waves/:waveId/comments

Get all comments for a wave.

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Success Response (200):** Same structure as ping comments

---

## Surges (Likes)

### POST /api/pings/:pingId/surge

Toggle surge (like/unlike) on a ping.

**Auth Required:** Yes

**Success Response (200 or 201):**

```json
{
  "message": "Ping surged", // or "Surge removed from ping"
  "surged": true // or false
}
```

---

### POST /api/waves/:waveId/surge

Toggle surge (like/unlike) on a wave.

**Auth Required:** Yes

**Success Response (200 or 201):**

```json
{
  "message": "Wave surged", // or "Surge removed from wave"
  "surged": true // or false
}
```

---

## Categories

### GET /api/categories

Get all categories for the organization.

**Auth Required:** Yes

**Query Parameters:**

- `q` (optional): Search query to filter categories by name

**Example:** `/api/categories?q=Academic`

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Academic"
    },
    {
      "id": 2,
      "name": "Facilities"
    },
    {
      "id": 3,
      "name": "Events"
    }
  ]
}
```

---

## Announcements

### GET /api/announcements

Get all announcements for the organization.

**Auth Required:** Yes

**Query Parameters:**

- `categoryId` (optional): Filter by category

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Campus Maintenance Notice",
    "content": "The library will be closed for maintenance...",
    "createdAt": "2025-11-07T09:00:00.000Z",
    "author": {
      "firstName": "Admin",
      "lastName": "User"
    },
    "categories": [
      {
        "id": 2,
        "name": "Facilities"
      }
    ]
  }
]
```

---

## Public Feed

### GET /api/public/soundboard

Get trending or new pings (Soundboard view).

**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `top` (optional): Get top N items (e.g., `top=3`)
- `sort` (optional): `trending` (default) or `new`
- `days` (optional): Filter by days (default: 7, or `all`)

**Example:** `/api/public/soundboard?sort=trending&days=7&limit=20`

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Library Hours Too Short",
      "content": "...",
      "category": {
        "id": 3,
        "name": "Facilities"
      },
      "status": "POSTED",
      "surgeCount": 42,
      "createdAt": "2025-11-07T10:30:00.000Z",
      "author": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe"
      },
      "_count": {
        "waves": 5,
        "comments": 12,
        "surges": 42
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "sort": "trending"
  }
}
```

---

### GET /api/public/stream

Get trending or new waves (Stream view).

**Auth Required:** Yes

**Query Parameters:** Same as `/api/public/soundboard`

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "solution": "Extend library hours to midnight...",
      "surgeCount": 15,
      "viewCount": 200,
      "createdAt": "2025-11-07T11:00:00.000Z",
      "ping": {
        "id": 1,
        "title": "Library Hours Too Short"
      },
      "_count": {
        "surges": 15,
        "comments": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "sort": "trending"
  }
}
```

---

## Admin Routes

All admin routes require `ADMIN` role.

### GET /api/admin/stats

Get platform statistics.

**Auth Required:** Yes (ADMIN)

**Success Response (200):**

```json
{
  "totalUsers": 1250,
  "totalPings": 450,
  "totalSurges": 3200,
  "totalWaves": 890,
  "totalComments": 2100
}
```

---

### GET /api/admin/pings

Get all pings (admin view with filters).

**Auth Required:** Yes (ADMIN)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category ID
- `status` (optional): Filter by status

**Success Response (200):** Same structure as `GET /api/pings`

---

### DELETE /api/admin/pings/:id

Delete any ping (admin privilege).

**Auth Required:** Yes (ADMIN)

**Success Response (204):** No content

---

### GET /api/admin/users

Get all users in organization.

**Auth Required:** Yes (ADMIN)

**Success Response (200):**

```json
[
  {
    "id": 1,
    "email": "student@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2025-11-07T10:30:00.000Z"
  }
]
```

---

### GET /api/admin/users/:id

Get detailed user info including activity.

**Auth Required:** Yes (ADMIN)

**Success Response (200):**

```json
{
  "id": 1,
  "email": "student@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "level": 200,
  "createdAt": "2025-11-07T10:30:00.000Z",
  "pings": [...],
  "comments": [...],
  "surges": [...]
}
```

---

### PATCH /api/admin/users/:id/role

Update user role.

**Auth Required:** Yes (ADMIN)

**Request Body:**

```json
{
  "role": "USER" | "ADMIN" | "REPRESENTATIVE"
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "email": "student@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "role": "REPRESENTATIVE",
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

---

### POST /api/admin/announcements

Create an announcement.

**Auth Required:** Yes (ADMIN)

**Request Body:**

```json
{
  "title": "Campus Maintenance Notice",
  "content": "The library will be closed for maintenance on Nov 15.",
  "categoryIds": [2, 3] // Optional: array of category IDs
}
```

**Success Response (201):**

```json
{
  "id": 1,
  "title": "Campus Maintenance Notice",
  "content": "The library will be closed...",
  "authorId": 1,
  "organizationId": 1,
  "createdAt": "2025-11-07T09:00:00.000Z",
  "author": {
    "firstName": "Admin",
    "lastName": "User"
  },
  "categories": [
    {
      "id": 2,
      "name": "Facilities"
    }
  ]
}
```

---

### PATCH /api/admin/announcements/:id

Update an announcement.

**Auth Required:** Yes (ADMIN)

**Request Body:**

```json
{
  "title": "Updated Title", // Optional
  "content": "Updated content...", // Optional
  "categoryIds": [2, 4] // Optional
}
```

**Success Response (200):** Same structure as create

---

### DELETE /api/admin/announcements/:id

Delete an announcement.

**Auth Required:** Yes (ADMIN)

**Success Response (204):** No content

---

### GET /api/admin/analytics/by-level

Get ping statistics by student level.

**Auth Required:** Yes (ADMIN)

**Success Response (200):**

```json
[
  {
    "name": "Level 100",
    "value": 45
  },
  {
    "name": "Level 200",
    "value": 120
  },
  {
    "name": "Level 300",
    "value": 95
  }
]
```

---

### GET /api/admin/analytics/by-category

Get ping statistics by category.

**Auth Required:** Yes (ADMIN)

**Success Response (200):**

```json
[
  {
    "name": "Academic",
    "count": 180
  },
  {
    "name": "Facilities",
    "count": 95
  },
  {
    "name": "Events",
    "count": 65
  }
]
```

---

### PATCH /api/admin/pings/:id/progress-status

Update ping progress status.

**Auth Required:** Yes (ADMIN)

**Request Body:**

```json
{
  "status": "PENDING" | "IN_PROGRESS" | "RESOLVED" | "WONT_FIX"
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Library Hours Too Short",
  "progressStatus": "IN_PROGRESS",
  "progressUpdatedAt": "2025-11-07T15:00:00.000Z"
}
```

---

## Representative Routes

All representative routes require `REPRESENTATIVE` role.

### GET /api/representatives/pings/submitted

Get pings submitted for review (status: UNDER_REVIEW).

**Auth Required:** Yes (REPRESENTATIVE)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Library Hours Too Short",
      "content": "...",
      "status": "UNDER_REVIEW",
      "createdAt": "2025-11-07T10:30:00.000Z",
      "author": {
        "email": "student@university.edu",
        "firstName": "John",
        "lastName": "Doe"
      },
      "_count": {
        "waves": 5,
        "comments": 12,
        "surges": 42
      }
    }
  ],
  "pagination": {
    "totalPings": 15,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 20
  }
}
```

---

### GET /api/representatives/waves/top

Get top waves for review (most surged).

**Auth Required:** Yes (REPRESENTATIVE)

**Query Parameters:**

- `days` (optional): Filter by days (default: 7, or `all`)
- `take` (optional): Number of results (default: 3, max: 20)

**Success Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "solution": "Extend library hours to midnight...",
      "surgeCount": 42,
      "createdAt": "2025-11-07T11:00:00.000Z",
      "ping": {
        "id": 1,
        "title": "Library Hours Too Short",
        "status": "POSTED"
      },
      "_count": {
        "surges": 42,
        "comments": 8
      }
    }
  ]
}
```

---

### POST /api/representatives/waves/forward

Forward waves for review (flag them).

**Auth Required:** Yes (REPRESENTATIVE)

**Request Body:**

```json
{
  "waveIds": [1, 5, 12]
}
```

**Success Response (200):**

```json
{
  "message": "Waves forwarded for review",
  "count": 3
}
```

---

### POST /api/pings/:pingId/official-response

Create official response to a ping.

**Auth Required:** Yes (REPRESENTATIVE)

**Request Body:**

```json
{
  "content": "We are reviewing library hours for next semester and will announce changes by December 1st."
}
```

**Success Response (201):**

```json
{
  "id": 1,
  "content": "We are reviewing library hours...",
  "authorId": 3,
  "pingId": 1,
  "organizationId": 1,
  "createdAt": "2025-11-08T09:00:00.000Z"
}
```

**Note:** Only one official response per ping (subsequent calls will error with unique constraint).

---

## Additional Notes

### Pagination Best Practices

- Default page size is 20 items
- Maximum page size is 100 items
- Always check `hasNextPage` and `hasPreviousPage` for navigation
- Use `totalPages` to build pagination UI

### Organization Scoping

- All data is automatically scoped to the user's organization
- Users in different organizations cannot see each other's data
- Organization is determined by email domain during registration

### Status Enums

**Ping Status:**

- `POSTED` - Publicly visible
- `UNDER_REVIEW` - Submitted for review
- `ARCHIVED` - Hidden from public view

**Progress Status:**

- `PENDING` - Not yet addressed
- `IN_PROGRESS` - Being worked on
- `RESOLVED` - Issue resolved
- `WONT_FIX` - Will not be addressed

**User Status:**

- `PENDING_VERIFICATION` - Email not verified
- `ACTIVE` - Active account
- `SUSPENDED` - Temporarily disabled

### Authentication Flow

1. Register with organization email → Receive verification email
2. Verify email with token → Account activated
3. Login → Receive JWT token
4. Include token in `Authorization: Bearer <token>` header for all requests

### Google OAuth Flow

1. Frontend gets Google ID token from Google Sign-In
2. Send token to `POST /api/auth/google`
3. Backend verifies with Google, creates/logs in user
4. Returns JWT token
5. Use JWT for subsequent requests

---

## Healthcheck

### GET /healthz

Check if server is running.

**Auth Required:** No

**Success Response (200):**

```json
{
  "status": "ok"
}
```

---

## Need Help?

For issues or questions about the API:

- Check error messages - they include helpful codes
- Verify JWT token is valid and not expired
- Ensure correct role permissions for admin/representative routes
- Check rate limit headers if requests are failing

Happy coding! 🚀
