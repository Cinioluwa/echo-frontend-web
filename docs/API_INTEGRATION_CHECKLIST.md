# API Integration Checklist

This document outlines all components and pages in the Echo frontend application and their required API integrations.

---

## 📄 **PAGES**

### **1. Login Page**

**File:** `src/pages/Login.tsx`

**API Integrations Needed:**

- ✅ `POST /api/users/login` - Email/password login
- ✅ `POST /api/auth/google` - Google OAuth authentication

**Implementation Status:** ⏳ Pending

---

### **2. SignUp Page**

**File:** `src/pages/SignUp.tsx`

**API Integrations Needed:**

- ✅ `POST /api/users/register` - User registration
- ✅ `POST /api/auth/google` - Google OAuth registration
- ✅ `POST /api/users/organization-waitlist` - For new organizations

**Implementation Status:** ⏳ Pending

---

### **3. Stream Page**

**File:** `src/pages/Stream.tsx`

**API Integrations Needed:**

- ✅ `GET /api/public/stream` - Fetch all waves (proposed solutions)
- ✅ `GET /api/announcements` - Fetch announcements (if needed)
- ✅ `POST /api/pings/:pingId/waves` - Create a new wave
- ✅ `POST /api/waves/:waveId/surge` - Toggle surge on wave
- ✅ `POST /api/waves/:waveId/comments` - Add comments to wave

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Fetches and displays waves from `/api/public/stream` with pagination
- Surge (like) functionality integrated with toggle capability
- Wave creation through modal form with API integration
- Loading and error states for better UX
- Real-time surge count updates
- Refresh functionality after wave creation

---

### **4. SoundBoard Page**

**File:** `src/pages/SoundBoard.tsx`

**API Integrations Needed:**

- ✅ `GET /api/public/soundboard` - Fetch all pings (issues)
- ✅ `POST /api/pings` - Create a new ping
- ✅ `POST /api/pings/:pingId/surge` - Toggle surge on ping
- ✅ `POST /api/pings/:pingId/waves` - Propose a wave for a ping
- ✅ `POST /api/pings/:pingId/comments` - Add comments to ping (API ready, UI pending)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Fetches and displays pings from `/api/public/soundboard` with pagination
- Loading and error states for better UX
- Ping creation through modal form with API integration
- Surge (like) functionality with toggle capability and optimistic UI updates
- Real-time surge count updates
- Wave proposal integrated with API
- Pagination controls for browsing pings
- Refresh functionality after creating new pings or waves
- Comment service methods ready for future UI implementation

---

### **5. WaveHistory Page**

**File:** `src/pages/WaveHistory.tsx`

**API Integrations Needed:**

- ✅ `GET /api/public/stream` - Get wave history (with date filtering)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Fetches and displays waves from `/api/public/stream` with pagination
- Loading and error states for better UX
- Automatic date grouping (Today, Yesterday, or specific dates)
- Wave cards display author name, timestamp, category, and statistics
- Top-ranked wave badges (Top 1, Top 2, Top 3) shown conditionally
- Load More functionality for paginated results
- View count and surge count display
- Empty state handling
- Refresh capability on error

---

## 🧩 **COMPONENTS**

### **6. NavBar Component**

**File:** `src/components/NavBar.tsx`

**API Integrations Needed:**

- ✅ `GET /api/users/me` - Fetch current user info (for UserInfo component)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Created AuthContext for centralized user state management
- Automatic user data fetching on app load
- Token-based authentication check
- Error handling for unauthorized access
- Logout functionality
- Context available across all components

---

### **7. UserInfo Component**

**File:** `src/components/UserInfo.tsx`

**API Integrations Needed:**

- ✅ `GET /api/users/me` - Display user profile (name, avatar)
- ⏳ `PATCH /api/users/me` - Update profile (future feature)
- ⏳ `DELETE /api/users/me` - Delete account (future feature)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Displays user's first and last name from API
- Loading state with skeleton animation
- Error/guest state handling
- Consumes AuthContext for user data
- Welcome back message display
- Profile image display

---

### **8. SearchInput Component**

**File:** `src/components/SearchInput.tsx`

**API Integrations Needed:**

- ✅ `GET /api/pings/search` - Search pings by hashtag or text query
- ✅ `GET /api/public/soundboard?q=...` - Search in soundboard
- ✅ `GET /api/public/stream?q=...` - Search in stream

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Created dedicated search service with API methods
- Context-aware search based on current page (SoundBoard, Stream, WaveHistory)
- Dynamic placeholder text based on page context
- Real-time search with query state management
- Integrated search functionality in all three main pages
- Automatic page reset on new search query
- Search uses appropriate endpoints (searchPings, searchSoundboard, searchStream)
- Form submission handling with Enter key support

---

### **9. SideBar Component**

**File:** `src/components/SideBar.tsx`

**API Integrations Needed:**

- ✅ `GET /api/categories` - Fetch categories for filtering

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Uses Categories component which fetches categories from API
- Categories are dynamically loaded and displayed
- Loading and error states handled by Categories component

---

### **10. Categories Component**

**File:** `src/components/Categories.tsx`

**API Integrations Needed:**

- ✅ `GET /api/categories` - Fetch all categories

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Fetches categories from `/api/categories` endpoint
- Dynamic category count display
- Maps API category names to local icons using CategoryImages
- Loading state with user feedback
- Error handling with error message display
- All Categories toggle functionality
- Individual category selection

---

### **11. CategorySelector Component**

**File:** `src/components/CategorySelector.tsx`

**API Integrations Needed:**

- ✅ `GET /api/categories` - Fetch categories for dropdown/selection

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Fetches categories from `/api/categories` endpoint
- Dynamic category rendering in horizontal selector
- Active category highlighting
- Loading state display
- Error handling
- Callbacks to parent component with selected category data

---

### **12. PingFormModal Component**

**File:** `src/components/PingFormModal.tsx`

**API Integrations Needed:**

- ✅ `POST /api/pings` - Submit new ping
- ✅ `GET /api/categories` - Fetch categories for dropdown

**Implementation Status:** ⏳ Pending

---

### **13. WaveFormModal Component**

**File:** `src/components/WaveFormModal.tsx`

**API Integrations Needed:**

- ✅ `POST /api/pings/:pingId/waves` - Submit new wave (if tied to ping)
- ✅ `GET /api/categories` - Fetch categories for dropdown

**Implementation Status:** ⏳ Pending

---

### **14. ProposeWaveModal Component**

**File:** `src/components/ProposeWaveModal.tsx`

**API Integrations Needed:**

- ✅ `POST /api/pings/:pingId/waves` - Propose a wave for a specific ping
- ✅ `GET /api/categories` - Fetch categories

**Implementation Status:** ⏳ Pending

---

### **15. StreamCard Component**

**File:** `src/components/Stream/StreamCard.tsx`

**API Integrations Needed:**

- ✅ `GET /api/waves/:id` - Fetch wave details (fetched by parent Stream page)
- ✅ `POST /api/waves/:waveId/surge` - Surge wave (delegated to StreamCardFooter)
- ✅ `POST /api/waves/:waveId/comments` - Comment on wave (future feature)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Accepts wave data including author information and rank from parent component
- Passes wave ID, surge count, and comment count to footer for interactions
- Displays author name and timestamp via StreamCardHeader
- Shows rank badge (Top 1, Top 2, Top 3) conditionally based on wave ranking
- Handles refresh callback to update parent component after actions

---

### **16. StreamCardHeader Component**

**File:** `src/components/Stream/StreamCardHeader.tsx`

**API Integrations Needed:**

- ✅ `GET /api/users/me` - Display author info (uses AuthContext)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Displays wave author name from API data
- Falls back to current user from AuthContext if author not provided
- Shows formatted timestamp for wave creation
- Conditionally displays rank badge (Top 1-3) with color-coded indicators
- Gold badge for rank 1, silver for rank 2, bronze/yellow for rank 3

---

### **17. StreamCardFooter Component**

**File:** `src/components/Stream/StreamCardFooter.tsx`

**API Integrations Needed:**

- ✅ `POST /api/waves/:waveId/surge` - Toggle surge
- ✅ `GET /api/waves/:waveId/comments` - Fetch comment count (passed from parent)
- ⏳ `POST /api/waves/:waveId/comments` - Add comment (future feature)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Surge toggle functionality with API integration
- Optimistic UI updates for better user experience
- Real-time surge count display and updates
- Smooth animations and transitions on surge action
- Loading states to prevent multiple simultaneous requests
- Error handling with automatic rollback on failure
- Displays comment count (commenting UI pending)

---

### **18. SoundBoardCard Component**

**File:** `src/components/SoundBoard/SoundBoardCard.tsx`

**API Integrations Needed:**

- ✅ `GET /api/pings/:id` - Fetch ping details (passed from parent SoundBoard page)
- ✅ `POST /api/pings/:pingId/surge` - Surge ping (delegated to SoundBoardCardFooter)
- ✅ `POST /api/pings/:pingId/comments` - Comment on ping (API ready, UI pending)
- ✅ `POST /api/pings/:pingId/waves` - Propose wave (delegated to ProposeWaveModal)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Accepts ping data including author information from parent component
- Passes ping ID, surge count, and comment count to footer for interactions
- Displays author name and timestamp via SoundBoardCardHeader with AuthContext fallback
- Handles refresh callback to update parent component after actions
- Wave proposal integrated with API through ProposeWaveModal

---

### **19. SoundBoardCardFooter Component**

**File:** `src/components/SoundBoard/SoundBoardCardFooter.tsx`

**API Integrations Needed:**

- ✅ `POST /api/pings/:pingId/surge` - Toggle surge
- ✅ `GET /api/pings/:pingId/comments` - Fetch comment count (passed from parent)
- ✅ `POST /api/pings/:pingId/waves` - Propose wave button (triggers ProposeWaveModal)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Surge toggle functionality with API integration
- Optimistic UI updates for better user experience
- Real-time surge count display and updates from server response
- Smooth animations and transitions on surge action
- Loading states to prevent multiple simultaneous requests
- Error handling with automatic rollback on failure
- Displays comment count (commenting UI pending)
- Refresh callback to update parent state after surge
- Propose wave button triggers modal for wave creation

---

### **20. WaveCard Component**

**File:** `src/components/WaveHistory/WaveCard.tsx`

**API Integrations Needed:**

- ✅ `GET /api/waves/:id` - Fetch wave details

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Receives wave data from parent WaveHistory page (via `/api/public/stream`)
- Wave data includes: id, title, solution, author, category, viewCount, surgeCount, rank, createdAt
- Properly delegates to sub-components (WaveCardHeader, WaveCardBody, WaveCardFooter)
- WaveCardHeader displays author name, timestamp, and rank badge (Top 1-3)
- WaveCardBody displays category, title, and solution content
- WaveCardFooter displays view count and surge count
- All data properly typed with Wave interface from API

---

### **21. WaveCardFooter Component**

**File:** `src/components/WaveHistory/WaveCardFooter.tsx`

**API Integrations Needed:**

- ✅ Display view count (from API)
- ✅ Display surge count (from API)

**Implementation Status:** ✅ Completed

**Implemented Features:**

- Displays view count from `wave.viewCount` property
- Displays surge count from `wave._count?.surges || wave.surgeCount` property
- Proper formatting with icons and labels
- Both metrics received from API via parent component

---

### **22. AnnouncementCard Component**

**File:** `src/components/Stream/AnnouncementCard.tsx`

**API Integrations Needed:**

- ✅ `GET /api/announcements` - Fetch and display announcements

**Implementation Status:** ⏳ Pending

---

### **23. ProposedPingCard Component**

**File:** `src/components/ProposedPingCard.tsx`

**API Integrations Needed:**

- ✅ `GET /api/pings/:id` - Fetch ping details for proposed wave

**Implementation Status:** ⏳ Pending

---

### **24. PageTitleBar Component**

**File:** `src/components/PageTitleBar.tsx`

**API Integrations Needed:**

- ❌ No API integration needed (UI only)

**Implementation Status:** ✅ Complete

---

### **25. PostSuccessModal Component**

**File:** `src/components/PostSuccessModal.tsx`

**API Integrations Needed:**

- ❌ No API integration needed (UI only)

**Implementation Status:** ✅ Complete

---

## 📊 **SUMMARY**

**Total Components/Pages:** 25
**Requiring API Integration:** 23
**UI Only:** 2

---

## 🔧 **API Services Required**

### **Existing Services:**

1. ✅ `authService` - Authentication (login, register, Google OAuth)
2. ✅ `userService` - User profile management
3. ✅ `pingService` - Ping operations
4. ✅ `waveService` - Wave operations
5. ✅ `surgeService` - Surge (like) operations
6. ✅ `commentService` - Comment operations
7. ✅ `publicService` - Public feed (soundboard/stream)
8. ✅ `searchService` - Search functionality

### **Services to Add:**

9. ⏳ `categoryService` - Category operations
10. ⏳ `announcementService` - Announcement operations

---

## 📝 **Implementation Priority Order**

### **Phase 1: Authentication & Core User Features**

1. Login Page - `authService`
2. SignUp Page - `authService`
3. UserInfo Component - `userService`
4. NavBar Component - `userService`

### **Phase 2: Category System**

5. Categories Component - `categoryService`
6. CategorySelector Component - `categoryService`
7. SideBar Component - `categoryService`

### **Phase 3: Ping Features (SoundBoard)**

8. SoundBoard Page - `pingService`, `publicService`
9. PingFormModal Component - `pingService`
10. SoundBoardCard Component - `pingService`, `surgeService`
11. SoundBoardCardFooter Component - `surgeService`, `commentService`

### **Phase 4: Wave Features (Stream)**

12. Stream Page - `waveService`, `publicService`
13. WaveFormModal Component - `waveService`
14. ProposeWaveModal Component - `waveService`
15. StreamCard Component - `waveService`, `surgeService`
16. StreamCardFooter Component - `surgeService`, `commentService`

### **Phase 5: History & Additional Features**

17. WaveHistory Page - `waveService`
18. WaveCard Component - `waveService`
19. WaveCardFooter Component - Display only
20. AnnouncementCard Component - `announcementService`
21. SearchInput Component - `searchService`

### **Phase 6: Testing & Refinement**

22. Integration testing
23. Error handling
24. Loading states
25. Edge cases

---

## 📌 **Notes**

- All authenticated endpoints require JWT token in Authorization header
- Implement proper error handling for all API calls
- Add loading states for async operations
- Implement retry logic for failed requests
- Cache frequently accessed data (categories, user profile)
- Implement optimistic UI updates for better UX
- Add proper TypeScript types for all API responses
- Implement proper form validation before API calls

---

## 🔄 **Status Legend**

- ✅ Complete
- ⏳ Pending
- 🚧 In Progress
- ❌ Not Required

---

**Last Updated:** January 3, 2026
