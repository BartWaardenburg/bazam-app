# Bazam - Design Language: "90s Comic Book"

A bold, retro comic book-inspired design system. Think halftone dots, hard black drop shadows, flat saturated colors on cream paper — like a 90s comic panel come to life.

---

## Design Philosophy

- **Flat & Bold**: No gradients, no glows — solid colors with hard black outlines and drop shadows
- **Comic Book Energy**: Halftone dot patterns, starburst shapes, speed lines, and zigzag decorations
- **Light Canvas**: Warm cream paper background (#F5F0E8) with subtle halftone dot texture
- **Arcade Buttons**: Chunky push-down shadows that disappear on press, chunky borders
- **No Purple, No Neon**: The palette is strictly red/cyan/yellow/green/black on cream

---

## Color Palette

### Core Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#FF3B30` | Primary actions, branding, comic red |
| `--color-primary-dark` | `#CC2D25` | Primary hover/pressed state |
| `--color-primary-light` | `#FF6B63` | Lighter primary accents |
| `--color-accent` | `#FFD60A` | Highlights, scores, badges, comic yellow |
| `--color-cyan` | `#00BCD4` | Secondary actions, links, comic cyan |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-correct` | `#34C759` | Correct answers, success states |
| `--color-incorrect` | `#FF3B30` | Wrong answers, errors |

### Answer Colors
| Answer | Hex | Character |
|--------|-----|-----------|
| A | `#00BCD4` | Cyan |
| B | `#FFD60A` | Yellow |
| C | `#FF3B30` | Red |
| D | `#34C759` | Green |

### Surface & Background
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#F5F0E8` | Page background (warm cream paper) |
| `--color-bg-light` | `#F0EBE3` | Slightly darker cream |
| `--color-surface` | `#FFFFFF` | Card/component backgrounds (white) |
| `--color-surface-light` | `#F0EBE3` | Elevated surfaces, inputs |
| `--color-text` | `#1A1A1A` | Primary text (near-black) |
| `--color-text-muted` | `#666666` | Secondary/helper text |
| `--color-border` | `#1A1A1A` | Default borders (dark, comic-style) |
| `--color-outline` | `#000000` | Hard outlines for sticker effect |

### Background Treatment
The body uses a cream background with a halftone dot pattern:
```css
background-color: #F5F0E8;
background-image: radial-gradient(circle, #D5D0C8 1px, transparent 1px);
background-size: 20px 20px;
```
No animated blob shapes. Decorative elements in the app shell are static comic-book shapes: halftone clusters, starbursts, speed lines, and zigzags — all at very low opacity (0.05-0.08).

---

## Typography

### Font Stack
| Usage | Font | Fallback |
|-------|------|----------|
| Headings | **Bangers** | Impact, system-ui, sans-serif |
| Body | **Fredoka** | system-ui, sans-serif |
| UI Library | **Nunito** | system-ui, sans-serif |

### Heading Style
- `font-family: var(--font-heading)` (Bangers)
- `font-weight: 400` (Bangers only has one weight)
- `letter-spacing: 0.05em`
- `text-transform: uppercase`
- Hard black text shadows: `3px 3px 0 #000` (typical)

### Body Style
- `font-family: var(--font-body)` (Fredoka)
- `font-weight: 500` (base), `600-700` (emphasis)
- Natural casing (no uppercase transform)

### Hierarchy
| Element | Size | Notes |
|---------|------|-------|
| Page title | `clamp(4rem, 14vw, 7rem)` | Hard black + color offset shadow |
| Section heading (h2) | `2-2.5rem` | With hard text-shadow |
| Sub-heading (h3) | `1.2-1.5rem` | Often uses `--color-cyan` or `--color-accent` |
| Body text | `1rem` | Fredoka |
| Labels | `0.9rem` | Uppercase, letter-spacing: 0.05-0.08em |
| Scores/Numbers | Use Bangers | With letter-spacing for drama |

---

## Shadows & Depth

### Hard Drop Shadows Only
The only shadow style — hard-offset black shadows that create a comic book / sticker feel:

```css
--shadow-hard:    4px 4px 0 #000;     /* Standard */
--shadow-hard-lg: 6px 6px 0 #000;     /* Cards, buttons */
--shadow-hard-xl: 8px 8px 0 #000;     /* Hover states */
```

**No neon glows.** No `box-shadow` with colored rgba values. No `filter: drop-shadow()` with colored glows. All shadows are flat black.

### Pattern: Button Shadow
```css
border: 3px solid #000;
box-shadow: var(--shadow-hard-lg);

&:hover {
  box-shadow: var(--shadow-hard-xl);
}

&:active {
  transform: translateY(4px);
  box-shadow: none;  /* "pressed" effect */
}
```

---

## Borders & Outlines

- **Standard border**: `3px solid var(--color-border)` (#1A1A1A — dark, not gray)
- **Emphasis border**: `3px solid var(--color-outline)` (#000 — for buttons, badges)
- **No colored borders at partial alpha** — borders are solid, not tinted
- **Dashed borders**: `3px dashed var(--color-accent)` for special sections

### Border Radius (Sharp Corners!)
```css
--radius-sm:   2px;
--radius-md:   4px;
--radius-lg:   4px;
--radius-xl:   6px;
--radius-full: 9999px;  /* Only for progress bar tracks */
```
Almost everything uses sharp corners (2-6px). Avatars use `4px` (squared-off, not circular). `radius-full` is reserved for thin progress bar fills only — never for buttons, cards, or UI elements.

---

## Components

### Cards
```css
background: #FFFFFF;
border-radius: var(--radius-xl);
padding: 2rem;
border: 3px solid var(--color-border);
box-shadow: var(--shadow-hard-lg);
```
No gradients. No colored glows. White background, black border, hard shadow.

### Buttons
Three variants, all with:
- `border: 3px solid var(--color-outline)`
- `box-shadow: var(--shadow-hard-lg)` (no neon glow)
- `text-transform: uppercase`
- Hover: `translateY(-3px) rotate(-1deg)` + larger shadow
- Active: `translateY(4px)` + no shadow (pressed-in effect)

| Variant | Background | Text Color | Border |
|---------|-----------|------------|--------|
| Primary | `--color-primary` (#FF3B30) | white | black |
| Secondary | `#FFFFFF` | `--color-cyan` | cyan |
| Accent | `--color-accent` (#FFD60A) | dark (#1A1A1A) | black |

### Inputs
```css
background: #FFFFFF;
border: 3px solid var(--color-border);
color: var(--color-text);
/* Focus: border-color changes to primary, hard shadow ring */
```

### Avatars (quiz-avatar)
- **Squared-off**: `border-radius: 14px` (not circular!)
- **Black outline**: `border: 3px solid #000`
- **Hard shadow**: `box-shadow: 3px 3px 0 #000`
- **Bangers font** for initials
- Rank badge: yellow (#FFD60A) background, dark text, squared corners (8px radius), black outline
- Avatar colors: `#FF3B30, #00BCD4, #34C759, #FFD60A, #FF9500, #007AFF` and tonal variants

### Room Code Digits
- Red background with black outline
- Hard push-down shadow (`4px 4px 0 #000`)
- Alternating slight rotation for hand-drawn feel
- Hover: lift + rotate

### Answer Cards
- Solid colored borders per answer color
- Hard black push-down shadows
- Black-outlined letter badges with answer-color backgrounds
- Hover: lift + slight rotation

---

## Decorative Elements (App Shell)

Comic book-style background decorations at very low opacity (0.05-0.08):

| Element | Technique | Colors |
|---------|-----------|--------|
| Halftone clusters | `radial-gradient` dots clipped to circles | `#FF3B30`, `#00BCD4` |
| Starbursts | `clip-path: polygon(...)` with star/explosion shapes | `#FFD60A` |
| Speed lines | `repeating-linear-gradient` stripe patterns | `#1A1A1A` |
| Zigzag borders | `clip-path: polygon(...)` with zigzag edges | `#FF3B30` |
| Triangle accents | `clip-path: polygon(...)` simple triangles | `#FFD60A` |

All decorations are static (no animation) and purely background texture.

---

## Animation

### Timing Functions
```css
--timing-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Overshoot */
--timing-smooth:  cubic-bezier(0.4, 0, 0.2, 1);             /* Standard */
--timing-playful: cubic-bezier(0.34, 1.56, 0.64, 1);        /* Bouncy */
```

### Entrance Animations
All entrances include a slight rotation for hand-drawn energy:

| Animation | Effect | Duration |
|-----------|--------|----------|
| `fadeInUp` | Translate Y + rotate 2deg → 0deg | 0.5s |
| `scaleIn` | Scale 0.5 + rotate -5deg → 1 + 0deg | 0.4s |
| `slideInLeft` | Translate X + rotate -3deg → 0deg | 0.4s |
| `float` | Y translation + alternating +/-3deg rotation | 3s infinite |
| `wobble` | Multi-step rotation +/-6deg | 0.8s |
| `comicPulse` | Brightness 1 → 1.15 → 1 | 2s infinite |

### Interaction Patterns
- **Hover**: `translateY(-3px) rotate(-1deg)` or `scale(1.08) rotate(+/-3deg)`
- **Active/Click**: `translateY(4px)` + shadow removed (arcade button press)
- **Staggered entries**: `animation-delay: ($index * 0.06) + 's'`

---

## Iconography

Uses inline SVG icons (no emoji). Icons are flat, single-color, with no glow effects.

For decorative emphasis, use `filter: drop-shadow(2px 2px 0 #000)` (hard black, not colored glow).

---

## Design Token Systems

Two CSS variable systems exist:

| System | File | Prefix | Used By |
|--------|------|--------|---------|
| App tokens | `apps/client/src/styles.css` | `--color-*`, `--shadow-*`, `--font-*` | App components |
| UI library tokens | `libs/ui/src/lib/tokens/tokens.css` | `--bzm-*` | UI library components |

Both systems use the same palette values. When adding new colors or tokens, update **both** files.

---

## Responsive Approach

- Container queries for grid layouts (400px, 500px breakpoints)
- `clamp()` for fluid typography
- Flex-wrap for button groups
- Max-width containers: 420px (forms), 500px (lists), 600px (results), 700px (quiz builder), 800px (game view)

---

## Do's and Don'ts

### Do
- Use hard black drop shadows (`4px 4px 0 #000`) on interactive elements
- Use flat, solid colors — no gradients
- Add slight rotations (1-3deg) to hover states for energy
- Use Bangers for headings, scores, and badges
- Use hard black text-shadow on headings for depth
- Use white/cream backgrounds — this is a light theme
- Use thick borders (2-3px minimum) in dark colors
- Use halftone dot patterns and comic clip-path shapes for decoration

### Don't
- Use gradients (linear-gradient, radial-gradient on surfaces)
- Use neon glow shadows (`box-shadow` with colored rgba, `filter: drop-shadow` with color)
- Use purple anywhere — it's not in the palette
- Use soft/blurred shadows (too corporate/bland)
- Use dark page backgrounds
- Use circular avatars (squared-off is our style)
- Use thin or colored-alpha borders
- Use emoji with glow filters
