# Wave Components

Specialized React components for the Wave creation flow in the Echo application.

## Components

### WaveWarningBanner

Warning banner that informs users they must link a Wave to an existing Ping.

**Props:**

- `className?: string` - Optional additional CSS classes

**Usage:**

```tsx
<WaveWarningBanner />
```

---

### PingSearchInput

Search input field with icon and divider for finding existing Pings.

**Props:**

- `value: string` - Current search value
- `onChange: (value: string) => void` - Handler for value changes
- `onFocus?: () => void` - Optional focus handler
- `onBlur?: () => void` - Optional blur handler
- `placeholder?: string` - Input placeholder text
- `disabled?: boolean` - Disable the input

**Usage:**

```tsx
<PingSearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search for the ping..."
/>
```

---

### PingResultCard

Individual ping card in search results with highlighted search terms.

**Props:**

- `ping: Ping` - Ping data to display
- `searchQuery: string` - Current search query for highlighting
- `onClick: (ping: Ping) => void` - Click handler
- `isSelected?: boolean` - Whether this ping is selected

**Usage:**

```tsx
<PingResultCard
  ping={ping}
  searchQuery={query}
  onClick={handleSelectPing}
  isSelected={selectedPing?.id === ping.id}
/>
```

---

### NoPingFoundCard

Empty state card displayed when no search results are found.

**Props:**

- `onCreatePing: () => void` - Handler for creating a new ping

**Usage:**

```tsx
<NoPingFoundCard onCreatePing={handleCreatePing} />
```

---

### PingSearchDropdown

Dropdown container that displays search results or empty state with animations.

**Props:**

- `searchQuery: string` - Current search query
- `searchResults: Ping[]` - Array of search results
- `isSearching: boolean` - Loading state
- `onSelectPing: (ping: Ping) => void` - Ping selection handler
- `onCreatePing: () => void` - Create ping handler
- `isVisible: boolean` - Whether dropdown should be visible

**Usage:**

```tsx
<PingSearchDropdown
  searchQuery={query}
  searchResults={results}
  isSearching={loading}
  onSelectPing={handleSelect}
  onCreatePing={handleCreate}
  isVisible={showDropdown}
/>
```

---

### SelectedPingCard

Card displaying the selected ping with close button and animations.

**Props:**

- `ping: Ping` - Selected ping data
- `onDeselect: () => void` - Handler to deselect ping

**Usage:**

```tsx
<SelectedPingCard ping={selectedPing} onDeselect={handleDeselect} />
```

---

## Design Tokens

### Colors

- Main Orange: `#F49B31`
- Light Orange: `#FEF5EA`
- Mid Orange: `#FFC37B`
- Dark Gray: `#454545`
- Mid Gray: `#7D7D7D`

### Border Radius

- Input: `10px` (rounded-[10px])
- Button: `25px` (rounded-[25px])
- Tag: `12px` (rounded-xl)

---

## Dependencies

- `react` - Core React library
- `react-icons/fi` - Feather icons
- `framer-motion` - Animation library
- `../../api/types` - TypeScript types

---

## Animation Specifications

### Search Dropdown

- **Slide Down**: Height 0 → auto, 300ms
- **Stagger**: 50ms delay between result cards
- **Fade In**: Opacity 0 → 1

### Selected Ping Card

- **Spring**: Stiffness 200, Damping 20
- **Slide In**: Y -20 → 0
- **Scale**: 0.95 → 1

### Transitions

- All transitions use cubic-bezier easing
- Duration: 200-300ms for most interactions
