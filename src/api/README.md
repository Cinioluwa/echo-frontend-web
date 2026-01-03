# Echo API Services

Comprehensive API service layer for the Echo frontend application. All services are organized by functionality and use Axios for HTTP requests.

## Structure

```
api/
├── axios.config.ts           # Axios instance with interceptors
├── types.ts                  # Shared TypeScript types
├── index.ts                  # Centralized exports
└── services/
    ├── auth.service.ts           # Authentication & user registration
    ├── user.service.ts           # User profile management
    ├── ping.service.ts           # Pings (posts/issues) management
    ├── wave.service.ts           # Waves (solutions) management
    ├── comment.service.ts        # Comments on pings and waves
    ├── surge.service.ts          # Surges (likes) management
    ├── category.service.ts       # Category retrieval
    ├── announcement.service.ts   # Announcements retrieval
    ├── public.service.ts         # Public feeds (soundboard & stream)
    ├── admin.service.ts          # Admin-only operations
    ├── representative.service.ts # Representative-only operations
    └── health.service.ts         # Health check
```

## Setup

### 1. Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_API_BASE_URL=http://127.0.0.1:3000/api
```

### 2. Import Services

```typescript
import { authService, pingService, userService } from "./api";
```

## Usage Examples

### Authentication

```typescript
import { authService } from "./api";

// Register a new user
try {
  const response = await authService.register({
    email: "student@university.edu",
    password: "SecurePass123!",
    firstName: "John",
    lastName: "Doe",
    level: 200,
  });
  console.log(response.message);
} catch (error) {
  console.error("Registration failed:", error);
}

// Login
try {
  const response = await authService.login({
    email: "student@university.edu",
    password: "SecurePass123!",
  });
  // Token is automatically stored in localStorage
  console.log("Logged in successfully");
} catch (error) {
  console.error("Login failed:", error);
}

// Google OAuth
try {
  const response = await authService.googleAuth({
    token: "google_id_token_here",
  });
  console.log("Logged in with Google");
} catch (error) {
  console.error("Google auth failed:", error);
}

// Logout
authService.logout();
```

### Pings (Posts/Issues)

```typescript
import { pingService } from "./api";

// Create a ping
const newPing = await pingService.create({
  title: "Library Hours Too Short",
  content:
    "The library closes at 8pm but students need late-night study spaces...",
  categoryId: 3,
  hashtag: "library",
});

// Get all pings with filters
const pings = await pingService.getAll({
  page: 1,
  limit: 20,
  category: 3,
  status: "POSTED",
});

// Search pings
const searchResults = await pingService.search({
  hashtag: "library",
  page: 1,
});

// Get a specific ping
const ping = await pingService.getById(1);

// Update a ping (author only)
await pingService.update(1, {
  title: "Updated Title",
});

// Delete a ping (author only)
await pingService.delete(1);

// Get my pings
const myPings = await pingService.getMyPings({ page: 1, limit: 10 });
```

### Waves (Solutions)

```typescript
import { waveService } from "./api";

// Create a wave for a ping
const wave = await waveService.create(1, {
  solution: "Extend library hours to midnight on weekdays",
});

// Get all waves for a ping
const waves = await waveService.getByPingId(1, { page: 1, limit: 20 });

// Get a specific wave (increments view count)
const waveDetail = await waveService.getById(1);
```

### Comments

```typescript
import { commentService } from "./api";

// Comment on a ping
const pingComment = await commentService.createOnPing(1, {
  content: "I completely agree with this!",
});

// Comment on a wave
const waveComment = await commentService.createOnWave(1, {
  content: "This solution makes sense!",
});

// Get comments for a ping
const pingComments = await commentService.getByPingId(1, { page: 1 });

// Get comments for a wave
const waveComments = await commentService.getByWaveId(1, { page: 1 });
```

### Surges (Likes)

```typescript
import { surgeService } from "./api";

// Toggle surge on a ping
const result = await surgeService.toggleOnPing(1);
console.log(result.message); // "Ping surged" or "Surge removed from ping"
console.log(result.surged); // true or false

// Toggle surge on a wave
const waveResult = await surgeService.toggleOnWave(1);
```

### User Profile

```typescript
import { userService } from "./api";

// Get current user profile
const user = await userService.getMe();

// Update profile
await userService.updateMe({
  firstName: "Jane",
  lastName: "Smith",
});

// Get my surges
const mySurges = await userService.getMySurges({ page: 1, limit: 20 });

// Get my comments
const myComments = await userService.getMyComments({ page: 1, limit: 20 });

// Delete account
await userService.deleteMe();
```

### Public Feeds

```typescript
import { publicService } from "./api";

// Get soundboard (trending pings)
const soundboard = await publicService.getSoundboard({
  sort: "trending",
  days: 7,
  page: 1,
  limit: 20,
});

// Get stream (trending waves)
const stream = await publicService.getStream({
  sort: "new",
  page: 1,
  limit: 20,
});

// Get top items
const topPings = await publicService.getSoundboard({
  top: 3,
  sort: "trending",
});
```

### Categories & Announcements

```typescript
import { categoryService, announcementService } from "./api";

// Get all categories
const categories = await categoryService.getAll();

// Search categories
const filteredCategories = await categoryService.getAll({ q: "Academic" });

// Get announcements
const announcements = await announcementService.getAll();

// Filter announcements by category
const categoryAnnouncements = await announcementService.getAll({
  categoryId: 2,
});
```

### Admin Operations (ADMIN role required)

```typescript
import { adminService } from "./api";

// Get platform stats
const stats = await adminService.getStats();

// Get all pings
const allPings = await adminService.getAllPings({
  page: 1,
  limit: 50,
});

// Delete any ping
await adminService.deletePing(1);

// Get all users
const users = await adminService.getAllUsers();

// Get user details
const userDetail = await adminService.getUserById(1);

// Update user role
await adminService.updateUserRole(1, { role: "REPRESENTATIVE" });

// Create announcement
const announcement = await adminService.createAnnouncement({
  title: "Campus Maintenance Notice",
  content: "The library will be closed...",
  categoryIds: [2, 3],
});

// Update announcement
await adminService.updateAnnouncement(1, {
  title: "Updated Title",
});

// Delete announcement
await adminService.deleteAnnouncement(1);

// Get analytics
const levelAnalytics = await adminService.getAnalyticsByLevel();
const categoryAnalytics = await adminService.getAnalyticsByCategory();
```

### Representative Operations (REPRESENTATIVE role required)

```typescript
import { representativeService } from "./api";

// Get pings submitted for review
const submittedPings = await representativeService.getSubmittedPings({
  page: 1,
  limit: 20,
});

// Get top waves
const topWaves = await representativeService.getTopWaves({
  days: 7,
  take: 10,
});

// Forward waves for review
await representativeService.forwardWaves({
  waveIds: [1, 5, 12],
});

// Create official response
const officialResponse = await representativeService.createOfficialResponse(1, {
  content:
    "We are reviewing this issue and will announce changes by December 1st.",
});
```

## Features

### Automatic Token Management

The axios config automatically:

- Adds JWT token to all authenticated requests
- Stores token on login
- Removes token and redirects to login on 401 errors

### Error Handling

All services use consistent error handling:

- Rate limiting (429) - Logs error message
- Unauthorized (401) - Clears token and redirects to login
- All errors are propagated to caller for custom handling

### Type Safety

All services and responses are fully typed with TypeScript for better developer experience.

## API Base URL

The base URL is configured in `axios.config.ts` and can be overridden with the `VITE_API_BASE_URL` environment variable.

Default: `http://127.0.0.1:3000/api`

## Rate Limits

- **General requests**: 500 per 15 minutes
- **Auth endpoints**: 5 per 15 minutes
- **Create operations**: 30 per 15 minutes

## Authentication Flow

1. Register → Verify Email → Login → Receive Token
2. Token stored in localStorage
3. Token included in all subsequent requests
4. Token cleared on logout or 401 errors

## Error Codes

Common error codes from the API:

- `ORG_NOT_FOUND` - No organization for email domain
- `ORG_PENDING_ACTIVATION` - Organization not active
- `ACCOUNT_EXISTS` - User already registered
- `ACCOUNT_PENDING_VERIFICATION` - Email not verified
- `CONSUMER_DOMAIN_NOT_ALLOWED` - Personal email not allowed
- `GOOGLE_AUTH_REQUIRED` - Account uses Google Sign-In

## Health Check

```typescript
import { healthService } from "./api";

const health = await healthService.check();
console.log(health.status); // "ok"
```
