# Tailwind Breakpoints Migration Guide

This document captures the process for migrating from Bootstrap-style ranged breakpoints to Tailwind's default mobile-first breakpoints.

## The Problem

The current `tailwind.config.js` uses Bootstrap-style breakpoints with min-max ranges:

```js
// Legacy (problematic)
'sm': { 'min': '576px', 'max': '767.98px' },
'md': { 'min': '768px', 'max': '991.98px' },
'lg': { 'min': '992px', 'max': '1199.98px' },
// etc.
```

This creates several issues:

1. **Overlapping rules** — `2xl: 1200-1399px` conflicts with `xl: min 1200px`
2. **Redundant declarations** — Need to repeat styles at every breakpoint (`sm:flex-row md:flex-row lg:flex-row xl:flex-row`)
3. **Fighting CSS cascade** — Styles don't inherit upward, breaking the natural flow
4. **Desktop-first logic** — Base styles are for large screens, requiring overrides for smaller screens

## Target: Tailwind Defaults

Tailwind's default breakpoints are mobile-first (min-width only):

| Breakpoint | Min-width | Use case |
|------------|-----------|----------|
| `xs` | 480px | Small mobile (custom) |
| `sm` | 640px | Large mobile / small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

**Mobile-first means**: Base styles = mobile, each breakpoint adds/overrides for larger screens.

## Migration Strategy

### Phase 1: Add New Breakpoints (Done)

Added `xs: '480px'` to config. Legacy breakpoints remain for non-migrated sections.

### Phase 2: Use Arbitrary Breakpoints

To avoid conflicts with legacy breakpoints, use Tailwind's arbitrary value syntax:

```html
<!-- Instead of sm: (which is 576-767px range) -->
min-[640px]:flex-row

<!-- Instead of lg: (which is 992-1199px range) -->
min-[1024px]:text-[58px]
```

### Phase 3: Final Cleanup (After All Sections Migrated)

1. Remove legacy breakpoints from `tailwind.config.js`
2. Find/replace arbitrary values with standard names:
   - `min-[640px]:` → `sm:`
   - `min-[768px]:` → `md:`
   - `min-[1024px]:` → `lg:`
   - `min-[1280px]:` → `xl:`
   - `min-[1536px]:` → `2xl:`

## Breakpoint Value Mapping

| Legacy | Value | Tailwind Default | Value | Shift |
|--------|-------|------------------|-------|-------|
| xsm | max 576px | (base styles) | — | — |
| sm | 576px | sm | 640px | +64px |
| md | 768px | md | 768px | same |
| lg | 992px | lg | 1024px | +32px |
| xl | 1200px | xl | 1280px | +80px |
| xxl | 1536px | 2xl | 1536px | same |

The visual shifts are minimal and generally imperceptible.

## Common Conversion Patterns

### Pattern 1: Desktop-First Base → Mobile-First Base

**Before** (base = desktop, override down):
```html
class='text-[82px] xsm:text-4xl sm:text-[40px] md:text-[40px] lg:text-[58px] 2xl:text-[70px]'
```

**After** (base = mobile, scale up):
```html
class='text-4xl min-[640px]:text-[40px] min-[1024px]:text-[58px] min-[1280px]:text-[70px] min-[1536px]:text-[82px]'
```

### Pattern 2: Redundant Breakpoint Declarations

**Before** (same value repeated):
```html
class='flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row'
```

**After** (cascade handles it):
```html
class='flex-col min-[640px]:flex-row'
```

### Pattern 3: Hidden Until Breakpoint

**Before** (multiple hidden overrides):
```html
class='xsm:hidden! sm:hidden! md:hidden! lg:block'
```

**After** (simple base + show):
```html
class='hidden min-[1024px]:block'
```

### Pattern 4: Show Until Breakpoint (Inverse)

**Before**:
```html
class='block lg:hidden'
```

**After** (use max-width):
```html
class='block max-lg:block lg:hidden'
<!-- Or simply -->
class='lg:hidden'
```

### Pattern 5: Confusing Override Chains

**Before** (pt-5 base overridden everywhere):
```html
class='pt-5 xsm:pt-[10px] sm:pt-[10px] md:pt-[10px] lg:pt-[10px]'
```

**Analysis**: Base pt-5 (20px) only applies at xl+ since all others override. Actual intent is pt-[10px] for most sizes.

**After**:
```html
class='pt-2.5 min-[1280px]:pt-5'
```

### Pattern 6: Flex Order Switching

Common pattern where mobile stacks vertically, desktop reorders columns.

**Before** (order repeated at every breakpoint):
```html
class='md:order-last lg:order-last xl:order-last'
class='md:order-first lg:order-first xl:order-first'
```

**After** (set once, cascade handles the rest):
```html
class='min-[768px]:order-last'
class='min-[768px]:order-first'
```

### Pattern 7: Column Width Scaling

**Before** (redundant width at larger breakpoints):
```html
class='w-full md:w-6/12 lg:w-6/12 xl:w-6/12'
```

**After** (set once at the breakpoint where it changes):
```html
class='w-full min-[768px]:w-6/12'
```

**With additional scaling:**
```html
<!-- Before -->
class='w-full md:w-6/12 lg:w-[45%] xl:w-[45%]'

<!-- After -->
class='w-full min-[768px]:w-6/12 min-[1024px]:w-[45%]'
```

### Pattern 8: All Breakpoints Override to Same Value

When xsm/sm/md/lg all have the same value, that value should be the base.

**Before** (4 declarations for the same value):
```html
class='text-[24px] xsm:text-[19px] sm:text-[19px] md:text-[19px] lg:text-[19px] xl:text-[22px]'
```

**Analysis**: 19px applies from mobile to lg, 22px at xl, 24px only at 2xl+.

**After** (base = most common value):
```html
class='text-[19px] min-[1280px]:text-[22px] min-[1536px]:text-[24px]'
```

### Pattern 9: Margin Bottom for Mobile Spacing

Elements that need spacing on mobile but not on desktop (due to layout change).

**Before**:
```html
class='xsm:mb-[50px] sm:mb-[50px]'
```

**After** (base = mobile, remove at breakpoint):
```html
class='mb-[50px] min-[768px]:mb-0'
```

### Pattern 10: Redundant xl Repeating lg Values

Common anti-pattern where `xl:` just repeats what `lg:` already set.

**Before** (xl is redundant):
```html
class='lg:mt-32 lg:mb-20 xl:mt-32 xl:mb-20'
class='lg:grid-cols-3 xl:grid-cols-3'
class='lg:text-left xl:text-left'
```

**After** (cascade handles xl automatically):
```html
class='min-[1024px]:mt-32 min-[1024px]:mb-20'
class='min-[1024px]:grid-cols-3'
class='min-[1024px]:text-left'
```

### Pattern 11: Centered on Mobile, Left-Aligned on Desktop

Icons/elements that center on mobile (stacked layout) but left-align on desktop (side-by-side).

**Before** (centering repeated at every small breakpoint):
```html
class='xsm:m-[0_auto] sm:m-[0_auto] md:m-[0_auto]'
```

**After** (base = centered, remove at breakpoint):
```html
class='mx-auto min-[1024px]:mx-0'
```

### Pattern 12: Progressive Size Scaling

Elements that grow through 3+ size steps across breakpoints.

**Before** (scattered sizing with base as largest):
```html
class='h-[65px] w-[65px] xsm:h-[50px] xsm:w-[50px] sm:h-[50px] sm:w-[50px] md:h-[50px] md:w-[50px] lg:h-[60px] lg:w-[60px]'
```

**After** (clean progression from small to large):
```html
class='h-[50px] w-[50px] min-[1024px]:h-[60px] min-[1024px]:w-[60px] min-[1280px]:h-[65px] min-[1280px]:w-[65px]'
```

## Utility Cleanup Opportunities

While migrating, also clean up these common patterns:

### Spacing Shorthand

Convert CSS shorthand to individual Tailwind utilities:

| Legacy Syntax | Clean Syntax |
|--------------|--------------|
| `m-[5px_0]` | `my-1.25` |
| `m-[0_10px]` | `mx-2.5` |
| `m-[0_auto]` | `mx-auto` |
| `p-[0_10px]` | `px-2.5` |
| `px-[12px]` | `px-3` |
| `mb-[10px]` | `mb-2.5` |

**3-value shorthand** `p-[top_x_bottom]`:
```html
<!-- Before -->
p-[25px_15px_30px]

<!-- After (top: 25/4=6.25, x: 15/4=3.75, bottom: 30/4=7.5) -->
pt-6.25 px-3.75 pb-7.5
```

**4-value shorthand** `p-[top_right_bottom_left]`:
```html
<!-- Before -->
p-[30px_10px_25px_15px]

<!-- After (30/4=7.5, 10/4=2.5, 25/4=6.25, 15/4=3.75) -->
pt-7.5 pr-2.5 pb-6.25 pl-3.75
```

### Tailwind Spacing Scale (Prefer Over Arbitrary Values)

**Any pixel value divisible by 4** can use Tailwind's spacing scale instead of arbitrary `[Xpx]` values. The scale supports decimals: `0.25`, `0.5`, `0.75`, and whole/half numbers.

**Formula:** `value = scale × 4` → `scale = pixels / 4`

| Pixels | Scale | Example Utilities |
|--------|-------|-------------------|
| 4px | 1 | `p-1`, `m-1`, `gap-1` |
| 8px | 2 | `p-2`, `mt-2`, `w-2` |
| 10px | 2.5 | `mb-2.5`, `gap-2.5` |
| 12px | 3 | `px-3`, `py-3` |
| 16px | 4 | `p-4`, `size-4` |
| 20px | 5 | `p-5`, `mt-5` |
| 24px | 6 | `gap-6`, `w-6` |
| 28px | 7 | `p-7`, `h-7` |
| 30px | 7.5 | `mt-7.5`, `gap-7.5` |
| 32px | 8 | `p-8`, `size-8` |
| 40px | 10 | `p-10`, `w-10` |
| 48px | 12 | `p-12`, `size-12` |
| 50px | 12.5 | `size-12.5`, `h-12.5` |
| 60px | 15 | `size-15`, `w-15` |
| 64px | 16 | `p-16`, `size-16` |
| 80px | 20 | `p-20`, `h-20` |
| 300px | 75 | `size-75`, `w-75` |

**The rule is simple:** ANY integer pixel value can use the scale. Just divide by 4.

Since any integer ÷ 4 always ends in `.00`, `.25`, `.50`, or `.75`, **every pixel value works!**

| Pixels | ÷ 4 | Tailwind |
|--------|-----|----------|
| 3px | 0.75 | `px-0.75` |
| 5px | 1.25 | `my-1.25` |
| 10px | 2.5 | `px-2.5` |
| 13px | 3.25 | `p-3.25` |
| 17px | 4.25 | `mt-4.25` |
| 19px | 4.75 | `gap-4.75` |
| 22px | 5.5 | `py-5.5` |
| 23px | 5.75 | `p-5.75` |
| 25px | 6.25 | `pb-6.25` |
| 29px | 7.25 | `h-7.25` |
| 30px | 7.5 | `px-7.5` |
| 34px | 8.5 | `h-8.5` |
| 35px | 8.75 | `px-8.75` |
| 50px | 12.5 | `-left-12.5` |
| 65px | 16.25 | `h-16.25` |
| 126px | 31.5 | `size-31.5` |

**When to keep arbitrary values:**
- Complex values: `calc()`, percentages, viewport units
- Border-radius (uses its own scale: `rounded-sm`, `rounded-lg`, etc.)
- When readability matters more than consistency (e.g., `w-[248px]` vs `w-62`)

**Examples across utilities:**

```html
<!-- Padding/Margin -->
p-[20px] → p-5
mt-[30px] → mt-7.5
mb-[10px] → mb-2.5
px-[12px] → px-3

<!-- Width/Height -->
w-[48px] → w-12
h-[60px] → h-15
h-[50px] w-[50px] → size-12.5

<!-- Gap -->
gap-[24px] → gap-6
gap-x-[12px] → gap-x-3

<!-- Inset/Position -->
top-[20px] → top-5
left-[16px] → left-4

<!-- Line Height (also uses spacing scale) -->
leading-[25px] → leading-6.25
leading-[48px] → leading-12

<!-- Negative Values (same scale, prefixed with -) -->
left-[-5px] → -left-1.25
top-[-3px] → -top-0.75
mt-[-10px] → -mt-2.5
ml-[-20px] → -ml-5

<!-- Z-index (supports integers directly) -->
z-[-1] → -z-1
z-[1] → z-1
z-[10] → z-10
```

### Typography Scale (Prefer Over Arbitrary Font Sizes)

Tailwind has a built-in font-size scale. Use these instead of arbitrary `text-[Xpx]` values:

| Pixels | Scale | Class |
|--------|-------|-------|
| 12px | xs | `text-xs` |
| 14px | sm | `text-sm` |
| 16px | base | `text-base` |
| 18px | lg | `text-lg` |
| 20px | xl | `text-xl` |
| 24px | 2xl | `text-2xl` |
| 30px | 3xl | `text-3xl` |
| 36px | 4xl | `text-4xl` |
| 48px | 5xl | `text-5xl` |
| 60px | 6xl | `text-6xl` |
| 72px | 7xl | `text-7xl` |
| 96px | 8xl | `text-8xl` |
| 128px | 9xl | `text-9xl` |

**Examples:**
```html
text-[20px] → text-xl
text-[24px] → text-2xl
text-[18px] → text-lg
text-[16px] → text-base
text-[14px] → text-sm
text-[12px] → text-xs
```

**When to keep arbitrary values:**
- Non-standard sizes: `text-[19px]`, `text-[22px]`, `text-[15px]`

### Font Size + Line Height Shorthand

Combine `text-*` and `leading-*` into a single utility using the `/` syntax:

```html
<!-- Before (separate utilities) -->
text-[19px] leading-[1.67em]
text-lg leading-[29px]
text-xl leading-tight

<!-- After (shorthand) -->
text-[19px]/[1.67em]
text-lg/[29px]
text-xl/tight
```

Works with both arbitrary values and scale values:
- `text-xl/6` — xl size with leading-6 (24px line-height)
- `text-[19px]/[1.67em]` — arbitrary size with arbitrary line-height
- `text-base/relaxed` — base size with relaxed line-height

### Size Utility (Tailwind v3.4+)

When width and height are the same, use `size-*` instead of separate `h-*` and `w-*`:

```html
<!-- Before -->
class='h-[50px] w-[50px] min-[1024px]:h-[60px] min-[1024px]:w-[60px]'

<!-- After -->
class='size-12.5 min-[1024px]:size-15'
```

### Border Radius

| Legacy | Clean |
|--------|-------|
| `rounded-[50%]` | `rounded-full` |
| `rounded-[25px]` | Keep as-is (no standard equivalent) |

### Fractional Values

| Legacy | Clean |
|--------|-------|
| `top-2/4` | `top-1/2` |
| `-translate-y-2/4` | `-translate-y-1/2` |

### Transition Duration

| Legacy | Clean |
|--------|-------|
| `duration-[0.3s]` | `duration-300` |
| `duration-[0.4s]` | `duration-400` |
| `ease-[ease-in-out]` | `ease-in-out` |

### Important Modifier

The `!` suffix (important) is often unnecessary after migration:

| Legacy | Consider |
|--------|----------|
| `ml-auto!` | `ml-auto` (test if `!` is needed) |
| `m-0!` | `m-0` |
| `pr-12!` | `pr-12` |

## Step-by-Step Migration Process

### 1. Analyze Current Behavior

For each element, map out what styles apply at each breakpoint:

```
Element: h1 heading
< 576px:  36px (xsm override)
576-767:  40px (sm override)
768-991:  40px (md override)
992-1199: 58px (lg override)
1200-1399: 70px (2xl override)
1400+:    82px (base)
```

### 2. Identify the Visual Progression

Reorder from smallest to largest:
```
Mobile:     36px
Tablet:     40px
Desktop:    58px → 70px → 82px
```

### 3. Write Mobile-First Classes

Start with mobile (base), add breakpoints for larger:
```html
text-4xl                      <!-- 36px base (mobile) -->
min-[640px]:text-[40px]       <!-- 40px at sm+ -->
min-[1024px]:text-[58px]      <!-- 58px at lg+ -->
min-[1280px]:text-[70px]      <!-- 70px at xl+ -->
min-[1536px]:text-[82px]      <!-- 82px at 2xl+ -->
```

### 4. Simplify Redundant Values

If consecutive breakpoints have the same value, keep only the first:
```html
<!-- Before: sm and md both 40px -->
min-[640px]:text-[40px] min-[768px]:text-[40px]

<!-- After: just sm, it cascades to md -->
min-[640px]:text-[40px]
```

## Checklist Per Section

- [ ] Identify all responsive classes in the section
- [ ] Map current behavior at each breakpoint
- [ ] Convert to mobile-first logic
- [ ] Use `min-[Xpx]:` syntax for standard breakpoints
- [ ] Remove redundant declarations
- [ ] Test at key viewport widths: 375, 640, 768, 1024, 1280, 1536

## Real Examples from This Codebase

### Hero Section: Heading (index.astro)

**Before** (11 responsive classes):
```html
class='hero-heading font-Recoleta xsm:text-4xl xsm:leading-[1.2em] relative text-[82px] leading-[1.09em] font-normal sm:text-[40px] sm:leading-[1.2em] md:text-[40px] md:leading-[1.2em] lg:text-[58px] 2xl:text-[70px]'
```

**After** (7 responsive classes):
```html
class='hero-heading font-Recoleta relative text-4xl leading-[1.2em] font-normal min-[640px]:text-[40px] min-[1024px]:text-[58px] min-[1024px]:leading-[1.09em] min-[1280px]:text-[70px] min-[1536px]:text-[82px]'
```

### Hero Section: Buttons Container (index.astro)

**Before** (11 responsive classes, 5 redundant):
```html
class='xs:flex-row flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6 md:flex-row md:gap-6 lg:flex-row lg:gap-6 xl:flex-row xl:gap-6'
```

**After** (6 responsive classes):
```html
class='flex flex-col items-center justify-center gap-3 min-[640px]:flex-row min-[640px]:gap-6'
```

### Hero Section: CTA Button (index.astro)

**Before**:
```html
class='rounded-[28px] bg-[#BC46E2] px-[35px] text-[15px] leading-[48px] font-medium text-white min-[1280px]:px-10 min-[1280px]:text-[17px] min-[1280px]:leading-[52px]'
```

**After**:
```html
class='rounded-[28px] bg-[#BC46E2] px-8.75 text-[15px]/[48px] font-medium text-white min-[1280px]:px-10 min-[1280px]:text-[17px]/[52px]'
```

**Key improvements:**
- `px-[35px]` → `px-8.75` (spacing scale: 35/4 = 8.75)
- `text-[15px] leading-[48px]` → `text-[15px]/[48px]` (shorthand)
- `text-[17px] leading-[52px]` → `text-[17px]/[52px]` (shorthand)

### WhyUs: Text Paragraphs (WhyUs.astro)

**Before** (6 responsive classes, 4 redundant):
```html
class='font-gordita xsm:text-[19px] mt-8 leading-[1.67em] sm:text-[19px] md:text-[19px] lg:text-[19px] xl:text-[22px]'
```

**After** (4 responsive classes):
```html
class='font-gordita mt-8 text-[19px]/[1.67em] min-[1280px]:text-[22px]'
```

**Key improvements:**
- `text-[19px] leading-[1.67em]` → `text-[19px]/[1.67em]` (shorthand syntax)

### WhyUs: Column Layout (WhyUs.astro)

**Before** (7 responsive classes):
```html
class='ml-auto! w-full max-w-full flex-[0_0_auto] px-[12px] md:order-last md:w-6/12 lg:order-last lg:w-[45%] xl:order-last xl:w-[45%]'
```

**After** (6 responsive classes):
```html
class='ml-auto w-full max-w-full flex-[0_0_auto] px-3 min-[768px]:order-last min-[768px]:w-6/12 min-[1024px]:w-[45%]'
```

### WhyUs: Tag List Items (WhyUs.astro)

**Before** (10 responsive classes):
```html
class='xsm:text-[20px] xsm:m-[5px_0] m-[10px_0] p-[0_10px] text-[24px] text-black sm:m-[5px_0] sm:text-[20px] md:m-[5px_0] md:text-[20px] lg:m-[5px_0] lg:text-[20px]'
```

**After** (6 responsive classes):
```html
class='my-1.25 px-2.5 text-xl text-black min-[1280px]:my-2.5 min-[1280px]:text-2xl'
```

**Key improvements:**
- `text-[20px]` → `text-xl` (typography scale)
- `text-[24px]` → `text-2xl` (typography scale)
- `my-[5px]` → `my-1.25` (spacing scale: 5/4 = 1.25)
- `px-[10px]` → `px-2.5` (spacing scale: 10/4 = 2.5)
- `my-[10px]` → `my-2.5` (spacing scale)

### WhyUs: Tag Anchor Links (WhyUs.astro)

**Before** (12 responsive classes):
```html
class='xsm:text-[15px] xsm:p-3 rounded-[10px] bg-white px-[30px] py-[22px] text-[18px] text-black transition-all duration-[0.3s] ease-[ease-in-out] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] sm:p-3 sm:text-[15px] md:p-3 md:text-[15px] lg:p-3 lg:text-[15px]'
```

**After** (9 responsive classes):
```html
class='rounded-[10px] bg-white p-3 text-[15px] text-black transition-all duration-300 ease-in-out hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] min-[1280px]:px-7.5 min-[1280px]:py-5.5 min-[1280px]:text-lg'
```

**Key improvements:**
- `text-[18px]` → `text-lg` (typography scale)
- `text-[15px]` stays as-is (non-standard size)
- `px-[30px]` → `px-7.5` (spacing scale: 30/4 = 7.5)
- `py-[22px]` → `py-5.5` (spacing scale: 22/4 = 5.5)

### Advantages: Icon with Progressive Sizing (Advantages.astro)

**Before** (12 responsive classes, extreme redundancy):
```html
class="icon xsm:w-[50px] xsm:h-[50px] xsm:m-[0_auto] relative flex h-[65px] w-[65px] items-center justify-center rounded-[50%] border-[3px] border-solid border-black before:... sm:m-[0_auto] sm:h-[50px] sm:w-[50px] md:m-[0_auto] md:h-[50px] md:w-[50px] lg:h-[60px] lg:w-[60px]"
```

**After** (6 responsive classes + cleaner utilities):
```html
class="icon relative mx-auto flex size-12.5 items-center justify-center rounded-full border-[3px] border-solid border-black before:... min-[1024px]:mx-0 min-[1024px]:size-15 min-[1280px]:size-[65px]"
```

**Key improvements:**
- `rounded-[50%]` → `rounded-full`
- `m-[0_auto]` × 3 → `mx-auto` (base) + `mx-0` (at lg)
- `h-[50px] w-[50px]` → `size-12.5` (12.5 × 4 = 50px)
- `h-[60px] w-[60px]` → `size-15` (15 × 4 = 60px)
- Size progression: 50px (mobile) → 60px (lg) → 65px (xl)

### Advantages: Grid with Redundant xl (Advantages.astro)

**Before** (xl repeats lg values):
```html
class='grid gap-x-12 gap-y-6 pt-10 md:grid-cols-2 md:pt-14 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-24 xl:pt-20'
```

**After** (cascade handles xl):
```html
class='grid gap-x-12 gap-y-6 pt-10 min-[768px]:grid-cols-2 min-[768px]:pt-14 min-[1024px]:grid-cols-3 min-[1024px]:gap-y-10 min-[1280px]:gap-x-24 min-[1280px]:pt-20'
```

### Advantages: H4 Title (Advantages.astro)

**Before** (8 responsive classes, text-[20px] repeated 4 times):
```html
class='xsm:mb-[10px] xsm:text-[20px] mt-6 mb-5 sm:mb-[10px] sm:text-[20px] md:mb-[10px] md:text-[20px] lg:mt-[30px] lg:mb-[10px] lg:text-[20px]'
```

**After** (4 responsive classes):
```html
class='mt-6 mb-2.5 text-xl min-[1024px]:mt-7.5 min-[1280px]:mb-5'
```

**Key improvements:**
- `text-[20px]` → `text-xl` (Tailwind typography scale)
- `mb-[10px]` → `mb-2.5` (Tailwind spacing scale)
- `mt-[30px]` → `mt-7.5` (Tailwind spacing scale)

### OurProcess: Card Padding (OurProcess.astro)

**Before** (shorthand padding):
```html
class='card-style-three p-[30px_10px_25px_15px] min-[1280px]:p-[42px_45px_30px_45px]'
```

**After** (individual utilities):
```html
class='card-style-three pt-7.5 pr-2.5 pb-6.25 pl-3.75 min-[1280px]:pt-10.5 min-[1280px]:pr-11.25 min-[1280px]:pb-7.5 min-[1280px]:pl-11.25'
```

**Key improvements:**
- CSS shorthand expanded to individual `pt/pr/pb/pl` utilities
- All values converted to spacing scale (÷4)

### OurProcess: Decorative Shapes (OurProcess.astro)

**Before**:
```html
class='shapes shape-one absolute top-[4%] left-[-50px] -z-1 size-[126px] rounded-full'
class='shapes shape-three absolute right-[-150px] bottom-0 -z-1 size-75 rounded-full'
```

**After**:
```html
class='shapes shape-one absolute top-[4%] -left-12.5 -z-1 size-31.5 rounded-full'
class='shapes shape-three absolute -right-37.5 bottom-0 -z-1 size-75 rounded-full'
```

**Key improvements:**
- `left-[-50px]` → `-left-12.5` (50/4 = 12.5)
- `right-[-150px]` → `-right-37.5` (150/4 = 37.5)
- `size-[126px]` → `size-31.5` (126/4 = 31.5)

### WhyUs: Tags Wrapper Padding (WhyUs.astro)

**Before** (3-value shorthand at 3 breakpoints):
```html
class='tags-wrapper p-[25px_15px_30px] min-[1280px]:p-[35px_35px_40px] min-[1536px]:p-[45px_65px_50px]'
```

**After** (individual utilities):
```html
class='tags-wrapper pt-6.25 px-3.75 pb-7.5 min-[1280px]:pt-8.75 min-[1280px]:px-8.75 min-[1280px]:pb-10 min-[1536px]:pt-11.25 min-[1536px]:px-16.25 min-[1536px]:pb-12.5'
```

**Calculation breakdown:**
- Base: 25/4=6.25, 15/4=3.75, 30/4=7.5
- xl: 35/4=8.75, 35/4=8.75, 40/4=10
- 2xl: 45/4=11.25, 65/4=16.25, 50/4=12.5

## Files to Migrate

Track migration progress:

- [x] Hero section (`src/pages/index.astro` lines 18-69)
- [x] WhyUs component (`src/components/WhyUs.astro`)
- [x] Advantages component (`src/components/Advantages.astro`)
- [x] OurProcess component (`src/components/OurProcess.astro`)
- [ ] Testimonials component
- [ ] fancy-feature-thirtySeven section
- [ ] LogoCloud component
- [ ] CTA component
- [ ] FAQ component
- [ ] Header component
- [ ] Footer component

## Config Cleanup (Final Step)

Once all sections are migrated, update `tailwind.config.js`:

```js
// Remove this entire block:
screens: {
  '2xl': { 'min': '1200px', 'max': '1399px' },
  'xxl': { 'min': '1536px' },
  'xl': { 'min': '1200px' },
  'lg': { 'min': '992px', 'max': '1199.98px' },
  'md': { 'min': '768px', 'max': '991.98px' },
  'sm': { 'min': '576px', 'max': '767.98px' },
  'xsm': { 'max': '575.98px' },
}

// Keep only:
screens: {
  'xs': '480px',
  // Tailwind defaults (sm, md, lg, xl, 2xl) are automatic
}
```

Then run find/replace across all `.astro` files:
- `min-[640px]:` → `sm:`
- `min-[768px]:` → `md:`
- `min-[1024px]:` → `lg:`
- `min-[1280px]:` → `xl:`
- `min-[1536px]:` → `2xl:`
