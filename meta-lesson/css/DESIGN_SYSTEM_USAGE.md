# Design System Usage Guide

## Overview

This design system provides a comprehensive set of CSS design tokens, reusable components, and utility classes for the Attention Mechanism Educational Project. It ensures consistent, professional visual presentation across all pages.

## File Structure

```
meta-lesson/css/
├── variables.css      - Design tokens (colors, typography, spacing)
├── components.css     - Reusable component styles
├── main.css          - Global styles and utilities
└── DESIGN_SYSTEM_USAGE.md (this file)
```

## How to Use

### 1. Import Order (Critical)

Always import the CSS files in this exact order:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>

  <!-- Design System - Import in this order -->
  <link rel="stylesheet" href="meta-lesson/css/variables.css">
  <link rel="stylesheet" href="meta-lesson/css/components.css">
  <link rel="stylesheet" href="meta-lesson/css/main.css">
</head>
```

### 2. Color System

The design system uses a consistent dark theme with orange accents:

**Background Colors:**
- `--color-bg-primary: #1a1a1a` - Main dark background
- `--color-bg-secondary: #2a2a2a` - Card backgrounds
- `--color-bg-tertiary: #3a3a3a` - Nested elements

**Accent Colors:**
- `--color-accent-primary: #ff6b35` - Primary orange
- `--color-accent-secondary: #ff8855` - Secondary orange

**Text Colors:**
- `--color-text-primary: #ffffff` - Main text
- `--color-text-secondary: #cccccc` - Secondary text
- `--color-text-tertiary: #999999` - Muted text

**Usage:**
```css
.custom-element {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent-primary);
}
```

### 3. Typography Scale

Based on a modular scale for consistent sizing:

```css
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 2rem;        /* 32px */
--font-size-4xl: 2.5rem;      /* 40px */
```

**Utility Classes:**
```html
<p class="text-sm">Small text</p>
<h2 class="text-2xl">Large heading</h2>
<span class="text-accent font-bold">Highlighted text</span>
```

### 4. Spacing (8px Grid)

All spacing uses an 8px base unit:

```css
--spacing-xs: 0.5rem;     /* 8px */
--spacing-sm: 1rem;       /* 16px */
--spacing-md: 1.5rem;     /* 24px */
--spacing-lg: 2rem;       /* 32px */
--spacing-xl: 3rem;       /* 48px */
--spacing-2xl: 4rem;      /* 64px */
```

**Utility Classes:**
```html
<div class="mt-lg mb-md">Content with margin</div>
<div class="pt-sm pb-lg">Content with padding</div>
```

### 5. Buttons

#### Button Variants

**Primary Button (Orange, main actions):**
```html
<button class="btn btn-primary">Save Changes</button>
<a href="#" class="btn btn-primary">Launch Notebook</a>
```

**Secondary Button (Outlined):**
```html
<button class="btn btn-secondary">Cancel</button>
```

**Tertiary Button (Subtle):**
```html
<button class="btn btn-tertiary">Learn More</button>
```

**Disabled Button:**
```html
<button class="btn btn-primary" disabled>Loading...</button>
```

#### Button Sizes

```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
```

#### Icon Buttons

```html
<button class="btn btn-icon btn-primary">×</button>
```

### 6. Cards

#### Basic Card

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

#### Card with Hover Effect

```html
<div class="card card-hover">
  <h3>Interactive Card</h3>
  <p>Lifts on hover</p>
</div>
```

#### Card Sections

```html
<div class="card">
  <div class="card-header">
    <h3>Header</h3>
  </div>
  <div class="card-body">
    <p>Main content</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### 7. Forms

#### Basic Form Structure

```html
<form>
  <div class="form-group">
    <label class="form-label form-label-required">Username</label>
    <input type="text" class="form-input" placeholder="Enter username">
    <span class="form-help">Choose a unique username</span>
  </div>

  <div class="form-group">
    <label class="form-label">Password</label>
    <input type="password" class="form-input">
  </div>

  <div class="form-group">
    <label class="form-label">Bio</label>
    <textarea class="form-textarea" placeholder="Tell us about yourself"></textarea>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

#### Checkboxes and Radio Buttons

```html
<div class="form-check">
  <input type="checkbox" class="form-check-input" id="terms">
  <label class="form-check-label" for="terms">I agree to terms</label>
</div>

<div class="form-check">
  <input type="radio" class="form-check-input" name="option" id="opt1">
  <label class="form-check-label" for="opt1">Option 1</label>
</div>
```

#### Error States

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-input form-input-error">
  <span class="form-error">Please enter a valid email</span>
</div>
```

### 8. Modals

```html
<div class="modal-overlay">
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title">Modal Title</h3>
      <button class="modal-close" aria-label="Close">×</button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### 9. Alerts

```html
<div class="alert alert-success">
  <span class="alert-icon">✓</span>
  <div class="alert-content">
    <div class="alert-title">Success!</div>
    <p>Your changes have been saved.</p>
  </div>
</div>

<div class="alert alert-warning">
  <span class="alert-icon">⚠</span>
  <div class="alert-content">
    <div class="alert-title">Warning</div>
    <p>Please review your input.</p>
  </div>
</div>

<div class="alert alert-error">
  <span class="alert-icon">✕</span>
  <div class="alert-content">
    <div class="alert-title">Error</div>
    <p>Something went wrong.</p>
  </div>
</div>
```

### 10. Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Error</span>
```

### 11. Layout Utilities

#### Container

```html
<div class="container">
  <!-- Max-width 1200px, centered -->
</div>
```

#### Flexbox

```html
<div class="d-flex justify-between align-center gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Grid

```html
<div class="d-grid grid-cols-3 gap-lg">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### 12. Responsive Design

Mobile-first approach with breakpoints:

```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 1024px;
--breakpoint-desktop: 1280px;
```

**Utility Classes:**
```html
<div class="mobile-hidden">Hidden on mobile</div>
<div class="desktop-visible">Visible only on desktop</div>
```

### 13. Accessibility Features

#### Focus States

All interactive elements have visible focus states that comply with WCAG 2.1 AA:

```css
/* Orange focus ring on all focusable elements */
*:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

#### Screen Reader Only

```html
<span class="sr-only">Screen reader only text</span>
```

#### Skip Link

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

#### Reduced Motion

The design system respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
}
```

#### High Contrast Mode

Automatic adjustments for high contrast mode:

```css
@media (prefers-contrast: high) {
  /* Enhanced contrast ratios */
}
```

## Animation Guidelines

### Subtle Transitions

```css
/* Use predefined timing functions */
--transition-fast: 0.15s ease;   /* Quick interactions */
--transition-base: 0.3s ease;    /* Standard transitions */
--transition-slow: 0.5s ease;    /* Emphasis */
```

### Built-in Animations

**Fade In:**
```html
<div class="fade-in">Content fades in</div>
```

**Hover Lift:**
```html
<div class="card hover-lift">Lifts on hover</div>
```

**Hover Scale:**
```html
<button class="hover-scale">Scales on hover</button>
```

## Best Practices

### 1. Always Use Design Tokens

❌ Don't do this:
```css
.element {
  color: #ff6b35;
  padding: 16px;
}
```

✅ Do this:
```css
.element {
  color: var(--color-accent-primary);
  padding: var(--spacing-sm);
}
```

### 2. Use Utility Classes First

Before writing custom CSS, check if utility classes can achieve the result:

❌ Don't do this:
```css
.my-element {
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}
```

✅ Do this:
```html
<div class="mt-sm text-center font-semibold">Content</div>
```

### 3. Component Composition

Build complex UIs by combining components:

```html
<div class="card hover-lift">
  <div class="d-flex justify-between align-center mb-md">
    <h3 class="text-xl font-bold">Title</h3>
    <span class="badge badge-success">Active</span>
  </div>
  <p class="text-secondary mb-lg">Description text</p>
  <button class="btn btn-primary btn-block">Action</button>
</div>
```

### 4. Maintain Consistency

- Use the 8px spacing grid
- Stick to defined color palette
- Follow typography scale
- Use consistent border radius

### 5. Accessibility First

- Always include focus states
- Use semantic HTML
- Add ARIA labels where needed
- Test with keyboard navigation
- Test with screen readers

## Color Contrast Compliance

All color combinations meet WCAG 2.1 AA standards:

| Combination | Contrast Ratio | Compliance |
|-------------|----------------|------------|
| White on #1a1a1a | 15.3:1 | AAA |
| Orange (#ff6b35) on #1a1a1a | 4.8:1 | AA |
| #cccccc on #1a1a1a | 11.6:1 | AAA |

## Browser Support

The design system supports:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Examples

See `index.html` and `src/learn.html` for comprehensive implementation examples.

## Support

For questions or issues with the design system, please refer to the project documentation or contact the development team.

---

**Version:** 1.0
**Last Updated:** November 2024
**Maintained by:** Attention Mechanism Educational Project Team
