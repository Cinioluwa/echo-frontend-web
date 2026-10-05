# Echo — In-App Design Guide

> **One-liner:** Echo is a student feedback product. The in-app UI should feel calm, credible, and actionable — a warm workspace for raising issues, proposing waves, and tracking response.

This guide is for Echo's **product UI only**. It is based on the desktop app designs in Figma (`jMtulTqZxrLmWeNEBu4Ydk`), especially the Unified Feed, Ping Detail, and Create Ping surfaces. Use it when building new app pages and components so the same mistakes are not repeated.

---

## 1. Core idea: calm, credible, human

- **Warm, not loud.** The app sits on a soft cream canvas with orange used as a controlled accent.
- **Structured, not floaty.** Most content lives inside clearly bounded cards, sidebars, and pills.
- **Actionable, not decorative.** Surfaces should help the user post, review, filter, or respond.
- **Sentence-case first.** Headings, labels, and buttons are mostly sentence case, not shouty marketing copy.

### Non-negotiable rule: **No eyebrows in-app**

Small uppercase / letter-spaced "eyebrow" labels belong to the **marketing landing page only**.  
They must **not** appear in the app above headings, sections, cards, or forms.

- No Caveat-style greeting labels.
- No tiny uppercase tracked section labels above page titles.
- If a page needs a heading, use **one direct heading only**.

---

## 2. Color system

Observed in the app Figma screens:

| Token | Value | Usage |
|---|---|---|
| Page canvas | `#FAE9D4` | Main app background. |
| Primary orange | `#F49B31` | Primary CTA fills, accent borders, active emphasis. |
| Light orange | `#FFC37B` | Sidebar fills, highlighted rows, response headers, soft borders. |
| Cream surface | `#FEF5EA` | Utility pills, secondary actions, count buttons. |
| White surface | `#FEFEFE` / `#FFFFFF` | Feed cards, wave cards, right-rail cards, inputs. |
| Primary text | `#000000` / `#171717` | Headings and main body copy. |
| Secondary text | `#626665` / `#8B8E8D` / `#63637B` | Metadata, timestamps, counts, supporting copy. |
| Warm small-copy accent | `#926B3D` | Small "Welcome back!" profile text. |
| Placeholder text | `#9E9E9E` | Composer / input placeholders. |

### Border usage

- **Feed / content cards:** `1px solid rgba(244, 155, 49, 0.4)`
- **Status pills / outlined badges:** `1px solid #626665` or black
- **Orange-accent cards:** `1px solid #F49B31`
- **Composer input field:** `2px solid #FFC37B`

**Rule of thumb:** cream page, white cards, orange only where the user needs to notice or act.

---

## 3. Typography

### 3a. Fonts

- **Primary app font:** **Poppins**
- **Inter** appears in a few supporting metrics / browser-chrome fragments, but the app's main UI language is Poppins.
- Do **not** introduce decorative handwritten fonts in-app.

### 3b. Type hierarchy actually seen in Figma

| Role | Style observed |
|---|---|
| Page / modal H1 | `Poppins`, **30px**, bold or semibold, black |
| Section / panel heading | `Poppins`, **18px**, semibold, black |
| Feed card title | `Poppins`, **16-18px**, semibold, black |
| Body copy | `Poppins`, **14px**, medium/regular, black |
| Meta row / timestamp | `Poppins`, **13px**, medium, muted gray |
| Sidebar row label | `Poppins`, **15px**, semibold |
| Small helper / profile line | `Poppins`, **12px**, medium |
| Status pill text | `Poppins`, **11px**, medium |

### 3c. Heading rule

In observed app screens, headings are **direct**:

- `What’s the problem?`
- `Official Response`
- `Top Pings`
- `Waves`

Use a single black heading. **No subtitle. No eyebrow.**

---

## 4. Page structure, spacing, and layout rhythm

### 4a. App shell

Across the desktop screens:

- Page canvas: `#FAE9D4`
- Top app bar under browser chrome: **70px** tall
- Main body gutter: **37px** left/right
- Top spacing below bar: **16px**
- Main desktop columns are separated by about **42px**

The recurring layout is:

1. **Left sidebar** (`244px` wide)
2. **Primary content column**
3. **Right sidebar** (`276-286px` wide)

### 4b. Spacing rhythm

The same spacing values repeat throughout the app:

- **10px**: tight internal gaps, card gaps, small padding
- **13px**: title/body separation inside cards
- **15px**: common card padding and button height padding
- **20px**: standard card horizontal padding
- **23px**: wave-card padding

Build with this scale before inventing new numbers.

### 4c. Radius system

Observed radii:

- **8px**: selected category row
- **10px**: feed cards, wave cards, images, some panels
- **12px**: compact right-rail items / comment cards
- **15px**: CTAs, sidebar buttons, response card shells, larger panels
- **20px**: composer input field
- **23px**: status pills
- **25px**: large composer / rounded form shell

The app is rounded, but still structured — never bubblegum-soft.

---

## 5. Core patterns

### 5a. H1 / page-intro pattern

When a standalone screen needs a headline, use:

- `Poppins`
- **30px**
- bold / semibold
- black
- centered or left-aligned depending on the surface
- **no eyebrow, no tracked label, no subtitle**

The Create Ping modal is the clearest example.

### 5b. Card pattern

#### Feed / content cards

Observed on feed and ping detail:

- Background: white / `#FEFEFE`
- Border: `1px solid rgba(244, 155, 49, 0.4)`
- Radius: **10px**
- Padding: typically **20px x 15px**
- Internal gaps: **10-15px**

Use this pattern for pings, composer shells, and general content cards.

#### Response card

Observed pattern:

- Top header strip: `#FFC37B`
- Header border: `#F49B31`
- Header radius: top corners **15px**
- Body: white, `1px solid #F49B31`
- Body padding: **20px**

Use this for clearly system-owned or institution-owned content such as **Official Response**.

#### Wave card

Observed in Ping Detail:

- White surface
- Radius: **10px**
- Padding: about **27.5px x 23px**
- Header row with avatar + author + timestamp + status pill
- Body text below
- Reaction count pill aligned to the bottom/right area

### 5c. Image handling

Ping images:

- sit inside the card, below the title
- use **10px radius**
- fill the card width
- keep the image rectangular and clean — no decorative framing

---

## 6. Buttons, pills, and badges

### 6a. Primary button

Observed examples: **Create a Ping**, **Post**, claim/invite buttons

- Fill: `#F49B31`
- Text: white
- Radius: **15px**
- Height: commonly **48px**
- Text: `Poppins`, **15px**, semibold

Use for the primary action only.

### 6b. Secondary button

Observed example: **History**

- Fill: `#FEF5EA`
- Border: `1px solid #F49B31`
- Text: black
- Radius: **15px**
- Height: **48px**
- Usually includes a left icon

### 6c. Utility count pill

Observed example: ping traction / surge count

- Fill: `#FEF5EA`
- Border: `1px solid black`
- Radius: **15px**
- Padding: `10px 5px`
- Icon + **14px** semibold number

Use for compact numeric reactions, not as a primary CTA.

### 6d. Status badge / pill

Observed examples: **Top 3**, **Posted**, **Submitted**, **Under Review**

- Outlined pill
- Border: `1px solid #626665`
- Radius: **23px**
- Padding: `15px 7px`
- Small leading dot
- Text: `Poppins`, **11px**, medium, black

These are state indicators, not decorative tags.

### 6e. Important scope rule for wave tags

Special wave tags such as **Community Pick** and **Alternative** are for **Ping Detail wave rows only**.  
Do **not** reuse them in feed cards, page headers, sidebars, or forms.

---

## 7. Sidebar patterns

### 7a. Left sidebar

Observed pattern:

- Width: **244px**
- Main category block: `#FFC37B`
- Corner radius: **10-15px** depending on screen
- Section title: **18px** Poppins semibold
- Selected row: cream `#FAE9D4`, **221x48**, radius **8px**
- Row labels: **15px** semibold
- Count circles: **26x26**, orange fill, white **13px** number

The left rail is a **navigation tool**, not a billboard. Keep it quiet and functional.

### 7b. Right sidebar

Observed pattern:

- Width: **276-286px**
- Stacked cards with **12-15px** radii
- White cards with orange borders/shadows
- Dense but still readable

Recurring right-rail modules:

- **General Announcement**
- **Top Pings**
- **Comments**
- A single strong resolution CTA at the bottom of Ping Detail

Do not turn the right rail into a second main content column. It is supporting context.

---

## 8. Building new app pages and components

### Start from these rules

1. **Use the cream app canvas first** (`#FAE9D4`), then place white cards on top of it.
2. **Use one clear heading** when needed — black Poppins, no eyebrow, no subtitle.
3. **Pick an existing card archetype** before inventing a new one:
   - feed/content card
   - response card
   - wave card
   - right-rail utility card
4. **Reuse the button system**:
   - orange filled primary
   - cream outlined secondary
   - outlined status pills
5. **Keep spacing on the existing rhythm**: 10 / 13 / 15 / 20 / 23.
6. **Keep most body text at 14px Poppins** and most metadata at 13px muted gray.
7. **Use orange as emphasis, not wallpaper.**

### Things to avoid

- No in-app eyebrows
- No uppercase tracked section labels
- No marketing-style hero copy inside product screens
- No random new badge colors
- No mixing many border styles on one page
- No inventing new sidebar systems when the existing 244px left rail / 276-286px right rail solves the problem

### Quick implementation checklist

- Is the page on the cream canvas?
- Is the main content inside white cards?
- Is the heading direct, with no eyebrow?
- Are buttons using the observed orange / cream variants?
- Are status markers pills instead of decorative labels?
- Are special wave tags kept to Ping Detail only?

If any answer is "no", bring the design back to the patterns above before shipping.
