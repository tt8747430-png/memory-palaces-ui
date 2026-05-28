# Design System Integration Guide

## Overview

The Memory Palace application now uses a comprehensive design system adapted from Figma design tokens. This system provides a consistent, theme-aware foundation for building UI components.

## Architecture

### 1. Design Tokens (`src/styles/design-tokens.css`)

CSS custom properties organized by component type:
- **Button Tokens**: Primary, secondary, outline, and disabled states
- **Form Tokens**: Input fields, labels, error states
- **Card Tokens**: Background, borders, shadows, hover states
- **Navigation Tokens**: Links, active states, backgrounds
- **Modal Tokens**: Overlays, backgrounds, shadows
- **Alert Tokens**: 6 semantic variants (primary, secondary, success, warning, error, info)

All tokens support **light and dark modes** automatically.

### 2. TypeScript Utilities (`src/app/utils/designTokens.ts`)

Runtime access to design tokens with type safety:

```typescript
import { buttonTokens, getToken } from '@/utils/designTokens';

const bgColor = getToken(buttonTokens.primary.background, 'light');
// Returns: "#4B91E2"
```

### 3. React Hook (`src/app/hooks/useDesignTokens.ts`)

Theme-aware hook for accessing tokens in components:

```typescript
import { useDesignTokens } from '@/hooks/useDesignTokens';

function MyComponent() {
  const tokens = useDesignTokens();

  return (
    <button style={{ background: tokens.button.primary.background }}>
      Click me
    </button>
  );
}
```

### 4. Design System Components (`src/app/components/design-system/`)

Pre-built, token-based components:

#### Alert Component

```typescript
import { Alert } from '@/components/design-system';

<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert variant="error">
  An error occurred.
</Alert>
```

**Variants**: `primary`, `secondary`, `success`, `warning`, `error`, `info`

#### Button Component

```typescript
import { Button } from '@/components/design-system';

<Button variant="primary" size="md">
  Submit
</Button>

<Button variant="outline" fullWidth>
  Cancel
</Button>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`  
**Sizes**: `sm`, `md`, `lg`

#### Card Component

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/design-system';

<Card hoverable>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

#### Input Component

```typescript
import { Input } from '@/components/design-system';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={hasError}
  helperText={hasError ? "Invalid email" : "We'll never share your email"}
/>
```

## Using Design Tokens

### Method 1: CSS Variables (Recommended)

```css
.my-component {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: 1px solid var(--form-input-border);
}

.my-component:hover {
  background: var(--btn-primary-hover);
}
```

### Method 2: Tailwind Classes

```typescript
<div className="bg-[var(--card-bg)] border-[var(--card-border)] rounded-[var(--modal-radius)]">
  Content
</div>
```

### Method 3: React Hook

```typescript
function MyComponent() {
  const tokens = useDesignTokens();

  return (
    <div style={{
      backgroundColor: tokens.card.background,
      border: `1px solid ${tokens.card.border}`,
      boxShadow: tokens.card.shadow,
    }}>
      Content
    </div>
  );
}
```

## Token Categories

### Button Tokens
- `--btn-primary-bg`, `--btn-primary-text`, `--btn-primary-hover`
- `--btn-secondary-bg`, `--btn-secondary-text`
- `--btn-outline-border`
- `--btn-disabled-bg`, `--btn-disabled-text`

### Form Tokens
- `--form-input-bg`, `--form-input-border`, `--form-input-border-focus`
- `--form-input-text`, `--form-input-placeholder`
- `--form-label-text`
- `--form-error-text`, `--form-error-border`

### Card Tokens
- `--card-bg`, `--card-border`, `--card-hover-bg`
- `--card-shadow`, `--card-shadow-hover`

### Navigation Tokens
- `--nav-bg`, `--nav-border`
- `--nav-link-text`, `--nav-link-active`, `--nav-link-hover`

### Modal Tokens
- `--modal-bg`, `--modal-overlay`, `--modal-shadow`
- `--modal-radius`

### Alert Tokens (6 Variants)

Each variant has: `bg`, `border`, `text`, `icon`

- `--alert-primary-*`
- `--alert-secondary-*`
- `--alert-success-*`
- `--alert-warning-*`
- `--alert-error-*`
- `--alert-info-*`

## Dark Mode

Dark mode is automatically applied when:
1. User's system preference is dark mode, OR
2. The `.dark` class is applied to `<html>` or any parent element

All design tokens automatically switch to their dark mode values.

## Best Practices

### ✅ DO

- Use design tokens for all colors, spacing, and shadows
- Use the pre-built design system components when possible
- Create new components that leverage the token system
- Test components in both light and dark modes

### ❌ DON'T

- Hard-code colors or shadows
- Mix token system with custom values inconsistently
- Override token-based styles without good reason
- Ignore theme modes in custom components

## Migration Guide

### Migrating Existing Components

**Before:**
```typescript
<button
  style={{
    background: '#4B91E2',
    color: '#000',
  }}
>
  Submit
</button>
```

**After:**
```typescript
<Button variant="primary">
  Submit
</Button>
```

Or:

```typescript
<button
  className="bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
>
  Submit
</button>
```

## Adding New Tokens

1. **Add to CSS** (`src/styles/design-tokens.css`):
```css
:root {
  --my-new-token: #value;
}

.dark {
  --my-new-token: #dark-value;
}
```

2. **Add to TypeScript** (`src/app/utils/designTokens.ts`):
```typescript
export const myTokens = {
  newToken: {
    light: '#value',
    dark: '#dark-value',
  },
} as const;
```

3. **Integrate in hook** (`src/app/hooks/useDesignTokens.ts`):
```typescript
return useMemo(
  () => ({
    // ... existing tokens
    myNew: {
      token: getToken(myTokens.newToken, theme),
    },
  }),
  [theme]
);
```

## Source Files

Original Figma design system tokens are available in:
- `/src/imports/react-design-system-tokens.json` (54 semantic tokens)
- `/src/imports/react-design-system-primitives.json` (163 primitive tokens)
- `/src/imports/README-1.md` (import guide)

## TypeScript Support

All design system components and hooks are fully typed:

```typescript
import type { AlertVariant, ButtonSize } from '@/components/design-system';

const variant: AlertVariant = 'success'; // ✅ Type-safe
const size: ButtonSize = 'md'; // ✅ Type-safe
```

## Examples

See live examples:
- Alert: `/src/app/components/design-system/Alert.tsx`
- Button: `/src/app/components/design-system/Button.tsx`
- Card: `/src/app/components/design-system/Card.tsx`
- Input: `/src/app/components/design-system/Input.tsx`

---

**Design System Version**: 1.0.0  
**Platform**: React + Tailwind CSS v4  
**Modes**: Light & Dark  
**Total Tokens**: 60+ component tokens + Memory Palace custom tokens
