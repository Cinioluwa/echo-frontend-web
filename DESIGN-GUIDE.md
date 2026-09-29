# Echo — Design Philosophy & Brand System

> **One-liner:** Echo is a student feedback platform that helps communities raise issues, build support, and turn feedback into institutional action. Every design decision should make the user feel *seen, taken seriously, and pointed at a clear next step* — never shouted at.

This guide is for anyone designing or building an Echo page or automated email. It contains the canonical brand tokens, the email template shell, the writing voice, and the rules that keep everything consistent. The values and code below are copied from the live codebase (`styles.css`, `funnel.css`, `legal.css`, `founding-partner.css`, and the Supabase Edge Functions) so they match production.

---

## 1. The core idea: "calm, credible, human"

Echo's job is to give students a real, verifiable channel to be heard. That mission shapes every visual choice:

- **Trustworthy, not transactional-cold.** Confirmations read like a helpful note from a person, not a robot or a billboard.
- **Confident, not hypey.** We state what happened, why, and what's next — no "Don't miss out!", "Join the movement!", no fake urgency.
- **Useful, not decorative.** Every sentence, CTA, and image has a job. If removing it costs the recipient nothing, leave it out.
- **Direct, not buried.** The recipient should instantly know *why they're being contacted* and *what to do next*.

This philosophy is strictest in email: transactional and notification emails should look like legitimately useful communications — **not** promotional campaigns.

---

## 2. Color system

There are two palettes: **web** tokens (CSS variables in `styles.css`) and **email** tokens (hardcoded inline hex in the Supabase Edge Functions, because email clients ignore CSS variables and external stylesheets).

### 2a. Web tokens — canonical (`styles.css` `:root`)

```css
:root {
  --echo-orange: #F49B31;        /* primary brand accent */
  --echo-orange-light: #FFC37B;  /* hover / focus / soft orange */
  --echo-cream: #FEF5EA;         /* page canvas / soft background */
  --echo-white: #FFFFFF;         /* card surfaces on cream */
  --echo-black: #000000;         /* near-black text / fields */

  --font-display: 'Poppins', sans-serif;
  --font-ui: 'Inter', sans-serif;
  --font-hand: 'Caveat', cursive;
}
```

### 2b. Email tokens (canonical — `supabase/functions/send-confirmation/index.ts`)

```ts
const BRAND = {
  orange: '#E8911A',       // primary accent (slightly deeper for email contrast)
  orangeLight: '#FFC37B',
  cream: '#FAEEDA',        // outer email canvas
  outline: '#D1C0A9',      // card border / divider
  bodyText: '#060B13',     // body copy
  font: "'Poppins', Arial, Helvetica, sans-serif",
  siteUrl: 'https://echo-ng.com',
  assetsUrl: 'https://echo-ng.com/assets/Email',
};
```

> The same `BRAND` object is duplicated in `accept-founding-partner/index.ts`. If you change a color, update both files so they stay in sync.
### 2c. Role of each color

| Token | Hex (web / email) | Job |
|---|---|---|
| orange | `#F49B31` / `#E8911A` | The single accent. CTAs, focus, kickers, key emphasis, footer band. Use sparingly. |
| orange-light | `#FFC37B` | Soft / hover states, focus outlines, secondary fills. |
| cream | `#FEF5EA` / `#FAEEDA` | The warm canvas for pages and the email outer field. |
| white | `#FFFFFF` | Card surfaces sitting on cream. |
| near-black | `#060B13` / `#101010` / `#000000` | Body text and text fields. High contrast. |
| outline | `#D1C0A9` (email only) | Email card borders / dividers. |

**Rule of thumb:** one orange, lots of cream/white, black text. If a layout depends on two competing accent colors, you've over-designed.

---

## 3. Typography

### 3a. Fonts

| Role | Font | Notes |
|---|---|---|
| Display / headlines | **Poppins** | `--font-display`. Bold (700-800). Slightly tight letter-spacing on big headings. |
| UI / body | **Inter** (web) or Poppins (email) | `--font-ui`. Email keeps Poppins with an `Arial, Helvetica` fallback. |
| Handwritten accent | **Caveat** | `--font-hand`. Only small greeting "eyebrows" (e.g. funnel `Hey you.`). Sparingly. |

### 3b. Type scale feel (from live CSS)

```css
/* Page hero headline */
font-family: var(--font-display);
font-weight: 800;
font-size: clamp(2.7rem, 9vw, 7rem);
line-height: 0.96;
letter-spacing: -0.045em;

/* Section titles */
font-family: var(--font-display);
font-weight: 700;
font-size: clamp(1.25rem, 2.6vw, 1.55rem);
letter-spacing: -0.01em;

/* Body copy */
font-family: var(--font-ui);
font-size: clamp(0.93rem, 1.7vw, 1rem);
line-height: 1.7;
color: var(--echo-black);
```

**Email body (from the templates):**

```css
font-family: 'Poppins', Arial, Helvetica, sans-serif;
font-size: 15px;
line-height: 1.7;
color: #060B13;
```

---

## 4. Layout, shape & rhythm

### 4a. Shape language

- **Generous rounded corners** — buttons `border-radius: 999px` (pill), cards 18-20px, inputs 10-14px. Rounded = friendly.
- **Pill CTA buttons**, always:
```css
border-radius: 999px;
background: var(--echo-orange);
color: #fff;
font-family: var(--font-ui);
font-weight: 600-700;
padding: 14px 34px;   /* roomy */
```
- **Breathing room** — `clamp(...)` margins, `max-width: 46ch` on paragraphs, generous vertical whitespace.
- **Borders light** — `1px solid rgba(16,16,16,0.12-0.18)`, never heavy black boxes.

### 4b. The email shell (Outlook-safe, table-based, inline-styled)

```html
<!-- Outer canvas (cream) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#FAEEDA; margin:0; padding:0;">
  <tr><td align="center" style="background-color:#FAEEDA; padding:48px 16px;">
    <!-- Card (white, rounded, outlined) -->
    <table width="600" cellpadding="0" cellspacing="0" border="0"
           style="width:600px; max-width:100%; background-color:#FFFFFF; border:1px solid #D1C0A9; border-radius:20px; overflow:hidden;">
      <tr><td align="center" style="padding:36px 40px 28px;">
        <img src="https://echo-ng.com/assets/Email/Echo%20Logo%20(Coloured).png" width="..." alt="Echo">
      </td></tr>
      <tr><td style="padding:0 40px;">
        <!-- Heading: Poppins, 700-800 -->
        <!-- Body: Poppins, 15px, #060B13 -->
        <!-- Optional mascot (student confirmation only), right-aligned -->
      </td></tr>
      <!-- Footer band: solid orange, white text -->
      <tr><td align="center" bgcolor="#E8911A" style="background-color:#E8911A; padding:20px 24px; color:#fff;">
        ...
      </td></tr>
    </table>
  </td></tr>
</table>
```

**Footer — two modes:**

- **Transactional / confirmation emails** — plain contact + copyright, **no social icons**:
```html
<p style="color:#FFFFFF; font-size:12px;">Questions? Reply to this email or write to hello@mail.echo-ng.com</p>
<p style="color:#FFFFFF; font-size:12px;">Copyright &copy;2026 echo-ng.com</p>
```
- **Promotional / notification / referral emails** — may include LinkedIn & Instagram icons in the footer band.

In code this is the `showSocials` flag:
```ts
interface EmailContent {
  subject: string;
  heading: string;
  bodyHtml: string;
  withMascot?: boolean;
  showSocials?: boolean;   // false => plain contact footer (transactional)
}
```

---

## 5. Voice & writing style

**Preferred:** specific > generic, factual > hype, action-specific > promotional, one clear purpose > multiple, one relevant CTA > several, useful info > decorative filler.

**Write every email as if answering three questions, in order:**
1. *Why am I receiving this?* (state this first)
2. *What happened?* (the fact — signup, request received, agreement accepted)
3. *What's the next step (if any)?* (one CTA, or "no action needed")

### 5a. Good vs. promotional (from the live refactor)

**Transactional voice — do this:**

```text
Subject: You're on the Echo waitlist for Covenant University
Body:   Hi Ada,
        This confirms that you've joined the Echo waitlist for Covenant University.
        We'll email you at this address as soon as Echo is live for your campus.
        If you have questions, reply to this email.

        — The Echo Team
```

**Promotional voice — don't do this:**

```text
Subject: You're in! Let's start something small.
Body:   You just did something most people talk about but never actually do —
        you raised your hand. It doesn't need to be huge...
```

- **Open with "Why"** — e.g. "You're receiving this because..." / "This confirms that...".
- **Footers:** remove social icons from action-confirmation emails.
- **One CTA per email** unless two are genuinely necessary (e.g. a Founding Partner step that must be completed).
- **Classify each email honestly.** An action-confirmation is transactional. A message triggered by *someone else's* action (recommendation, invitation, milestone) is a notification/referral. Do not relabel notifications as transactional just for delivery — keep the category truthful and apply the matching footer mode

---

## 6. Buttons & CTAs

- Use the **single imperative** in the button label ("See how Echo works", "Join the Echo waitlist", "Review the Founding Partner Pilot").
- Only include a CTA if the recipient takes a real action. If there is no action, say "No action needed" instead.
- Style:

```css
display:inline-block;
background-color:#E8911A;
color:#FFFFFF;
text-decoration:none;
font-weight:700;
padding:14px 34px;
border-radius:999px;
```

- If the button may not render, provide a plain "copy this link" fallback below with the real URL.
- Do not hide content with CSS; nothing important should be `display:none`.
- **CTA rule:** every CTA must justify its existence. Ask: "If I remove this, does the recipient lose something they actually need to do or access?" If no, remove it.

---

## 7. Imagery & mascot

- **Logo:** coloured logo in the navbar + email header; monochrome logo in footers.
- **Mascot:** `assets/Testimonials/HiMascot.svg` is the editable design source; `assets/Email/HiMascot.png` is the production email asset. The mascot is black with a subtle warm-white/off-white outline (`#F9F3E7`) so it stays readable on dark backgrounds, plus an orange sound-wave/Wi-Fi arc (`#F49B31`). Use it right-aligned in the student confirmation; it's the friendly gesture.
- **Dark-mode-safe mascot & email assets:** never embed the SVG directly in email — SVG support is inconsistent (Gmail/Outlook). Always export the source SVG to a transparent, retina-friendly PNG (`assets/Email/HiMascot.png`: transparent background, black mascot with the warm-white outline, orange wave intact, no white rectangle) and reference that PNG in templates. When re-exporting from the source, preserve the outline on the black strokes and keep the orange wave untouched.

---

## 8. Building a new page or email — recipe

1. **Decide the category** honestly — transactional confirmation, direct notification, referral invitation, subscription/marketing. This decides whether it carries social links and how strict the copy must be.
2. **Pull the shell** — use the table-based email shell (above) or the page tokens from `styles.css`.
3. **Wire the tokens** — orange `#E8911A`, cream `#FAEEDA`, white card, black text, Poppins.
4. **Write the copy** — "Why you're getting this / what happened / next step", in that order.

5. **Add ONE CTA** if truly needed; set `showSocials: false` for confirmations.
6. **Check the rules** — subject explains the reason, no social links in transactional messages, no hype, no invented headers (`List-Unsubscribe`/`List-ID` only if you genuinely become a subscription/marketing sender).

 

---

*Reference files: `styles.css`, `funnel.css`, `legal.css`, `founding-partner.css`, `supabase/functions/send-confirmation/index.ts`, `supabase/functions/accept-founding-partner/index.ts`.*

