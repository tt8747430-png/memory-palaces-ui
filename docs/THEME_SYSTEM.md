# Theme System Documentation

## Overview

The Memory Palace application features a comprehensive, professional-grade theme system adapted from modern design system principles. The system provides 150+ design tokens, full light/dark mode support, and theme-aware components.

## Architecture

### 1. Token Layers

The theme system is organized in three layers:

#### Layer 1: Primitives (`src/app/theme/`)
Core design values defined in TypeScript:
- **Colors** (`colors.ts`) - Brand, neutral, and semantic colors
- **Typography** (`typography.ts`) - Font families, sizes, weights, line heights
- **Spacing** (`spacing.ts`) - Base spacing scale and component spacing
- **Radius** (`radius.ts`) - Border radius values
- **Elevation** (`elevation.ts`) - Shadow system
- **Breakpoints** (`breakpoints.ts`) - Responsive breakpoints
- **Motion** (`motion.ts`) - Animation durations and easings

#### Layer 2: CSS Variables (`src/styles/theme-system.css`)
Design tokens exposed as CSS custom properties:
- Automatic light/dark mode switching
- Tailwind CSS integration
- Browser-native performance

#### Layer 3: React Components (`src/app/components/theme-system/`)
Pre-built, theme-aware components:
- `ThemedButton` - Button variants with full theme support
- `ThemedCard` - Card layouts with glass/elevated variants
- `ThemedInput` - Form inputs with validation states
- `ThemedBadge` - Status badges with semantic colors

### 2. Theme Context

The `ThemeProvider` manages theme state and provides hooks:

```typescript
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}

function Component() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {isDark ? 'Dark' : 'Light'}
    </button>
  );
}
```

## Using the Theme System

### Method 1: CSS Variables (Recommended)

```css
.my-component {
  background: var(--theme-primary);
  color: var(--theme-text-on-primary);
  padding: var(--theme-button-px) var(--theme-button-py);
  border-radius: var(--theme-radius-md);
  box-shadow: var(--theme-shadow-md);
  transition: var(--theme-transition-base);
}

.my-component:hover {
  background: var(--theme-primary-hover);
}
```

### Method 2: Tailwind Classes

```tsx
<div className="bg-[var(--theme-card)] text-[var(--theme-text-primary)] rounded-[var(--theme-radius-lg)] shadow-[var(--theme-shadow-md)]">
  Content
</div>
```

### Method 3: React Hook

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.component.cardPadding,
      borderRadius: theme.radius.lg,
      boxShadow: theme.elevation.md,
    }}>
      Content
    </div>
  );
}
```

### Method 4: Pre-built Components

```tsx
import {
  ThemedButton,
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedInput,
  ThemedBadge,
} from '@/components/theme-system';

function MyPage() {
  return (
    <ThemedCard hoverable elevated>
      <ThemedCardHeader>
        <ThemedCardTitle>Welcome</ThemedCardTitle>
      </ThemedCardHeader>
      
      <ThemedInput
        label="Email"
        type="email"
        placeholder="you@example.com"
      />
      
      <ThemedButton variant="primary" fullWidth>
        Submit
      </ThemedButton>
      
      <ThemedBadge variant="success" dot>
        Active
      </ThemedBadge>
    </ThemedCard>
  );
}
```

## Token Reference

### Color Tokens

#### Brand Colors
```css
--theme-primary              /* Primary brand color */
--theme-primary-hover        /* Primary hover state */
--theme-primary-active       /* Primary active state */
--theme-primary-light        /* Light variant */
--theme-primary-dark         /* Dark variant */

--theme-secondary            /* Secondary color */
--theme-secondary-hover
--theme-secondary-active
--theme-secondary-light
--theme-secondary-dark

--theme-accent               /* Accent color */
--theme-accent-hover
--theme-accent-active
--theme-accent-light
--theme-accent-dark
```

#### Semantic Colors
```css
--theme-success              /* Success state */
--theme-success-light        /* Success background */
--theme-success-dark         /* Success text */

--theme-warning              /* Warning state */
--theme-warning-light
--theme-warning-dark

--theme-error                /* Error state */
--theme-error-light
--theme-error-dark

--theme-info                 /* Info state */
--theme-info-light
--theme-info-dark
```

#### Neutral Colors
```css
--theme-gray-50 to --theme-gray-900
```

#### Surface Colors
```css
--theme-bg                   /* Main background */
--theme-bg-subtle            /* Subtle background */
--theme-card                 /* Card background */
--theme-card-glass           /* Glass card with transparency */
--theme-modal                /* Modal background */
--theme-elevated             /* Elevated surface */
--theme-overlay              /* Overlay/backdrop */
```

#### Text Colors
```css
--theme-text-primary         /* Primary text */
--theme-text-secondary       /* Secondary text */
--theme-text-tertiary        /* Tertiary text */
--theme-text-disabled        /* Disabled text */
--theme-text-on-primary      /* Text on primary color */
--theme-text-on-secondary    /* Text on secondary color */
--theme-text-on-accent       /* Text on accent color */
```

#### Border Colors
```css
--theme-border               /* Default border */
--theme-border-muted         /* Subtle border */
--theme-border-strong        /* Strong border */
--theme-border-focus         /* Focus ring */
```

### Spacing Tokens

#### Base Spacing
```css
--theme-space-0              /* 0rem */
--theme-space-1              /* 0.25rem (4px) */
--theme-space-2              /* 0.5rem (8px) */
--theme-space-3              /* 0.75rem (12px) */
--theme-space-4              /* 1rem (16px) */
--theme-space-5              /* 1.25rem (20px) */
--theme-space-6              /* 1.5rem (24px) */
--theme-space-8              /* 2rem (32px) */
--theme-space-10             /* 2.5rem (40px) */
--theme-space-12             /* 3rem (48px) */
--theme-space-16             /* 4rem (64px) */
--theme-space-20             /* 5rem (80px) */
--theme-space-24             /* 6rem (96px) */
```

#### Component Spacing
```css
--theme-button-px            /* Button horizontal padding */
--theme-button-py            /* Button vertical padding */
--theme-input-px             /* Input horizontal padding */
--theme-input-py             /* Input vertical padding */
--theme-card-padding         /* Card padding */
--theme-modal-padding        /* Modal padding */
```

#### Layout Spacing
```css
--theme-container-max        /* Max container width */
--theme-container-padding    /* Container padding */
--theme-grid-gap             /* Grid gap */
--theme-section-spacing      /* Section spacing */
```

### Radius Tokens

```css
--theme-radius-sm            /* 0.25rem (4px) */
--theme-radius-base          /* 0.5rem (8px) */
--theme-radius-md            /* 0.75rem (12px) */
--theme-radius-lg            /* 1rem (16px) */
--theme-radius-xl            /* 1.25rem (20px) */
--theme-radius-2xl           /* 1.5rem (24px) */
--theme-radius-3xl           /* 2rem (32px) */
--theme-radius-full          /* 9999px (pill) */
```

### Shadow Tokens

```css
--theme-shadow-sm            /* Subtle shadow */
--theme-shadow-base          /* Base shadow */
--theme-shadow-md            /* Medium shadow */
--theme-shadow-lg            /* Large shadow */
--theme-shadow-xl            /* Extra large shadow */
--theme-shadow-2xl           /* 2x extra large shadow */
--theme-shadow-inner         /* Inner shadow */
```

### Motion Tokens

#### Durations
```css
--theme-duration-fast        /* 150ms */
--theme-duration-base        /* 200ms */
--theme-duration-moderate    /* 300ms */
--theme-duration-slow        /* 500ms */
```

#### Easings
```css
--theme-ease-linear
--theme-ease-in
--theme-ease-out
--theme-ease-in-out
--theme-ease-spring          /* Bouncy spring effect */
```

#### Transitions
```css
--theme-transition-fast      /* all 150ms ease-out */
--theme-transition-base      /* all 200ms ease-in-out */
--theme-transition-moderate  /* all 300ms ease-in-out */
--theme-transition-slow      /* all 500ms ease-in-out */
```

## Components

### ThemedButton

```tsx
<ThemedButton
  variant="primary" | "secondary" | "accent" | "outline" | "ghost"
  size="sm" | "md" | "lg"
  fullWidth={boolean}
>
  Click Me
</ThemedButton>
```

**Variants:**
- `primary` - Primary brand button
- `secondary` - Secondary button
- `accent` - Accent button
- `outline` - Outlined button
- `ghost` - Transparent button

**Sizes:**
- `sm` - Small (px-3 py-1.5)
- `md` - Medium (uses theme tokens)
- `lg` - Large (px-6 py-3)

### ThemedCard

```tsx
<ThemedCard hoverable elevated glass>
  <ThemedCardHeader>
    <ThemedCardTitle>Title</ThemedCardTitle>
    <ThemedCardDescription>Description</ThemedCardDescription>
  </ThemedCardHeader>
  
  <ThemedCardContent>
    Content
  </ThemedCardContent>
  
  <ThemedCardFooter>
    Footer actions
  </ThemedCardFooter>
</ThemedCard>
```

**Props:**
- `hoverable` - Adds hover effects with scale and shadow
- `elevated` - Enhanced shadow for emphasis
- `glass` - Frosted glass effect with backdrop blur

### ThemedInput

```tsx
<ThemedInput
  label="Email"
  variant="default" | "filled"
  error={boolean}
  helperText="Helper or error message"
  type="text"
  placeholder="Enter text..."
/>
```

**Variants:**
- `default` - Transparent background with border
- `filled` - Filled background

### ThemedBadge

```tsx
<ThemedBadge
  variant="primary" | "secondary" | "success" | "warning" | "error" | "info"
  size="sm" | "md" | "lg"
  dot={boolean}
>
  Status
</ThemedBadge>
```

## Dark Mode

Dark mode is automatically applied when:
1. User's system preference is dark mode, OR
2. User toggles theme via `toggleTheme()`
3. The `.dark` class is on `<html>`

All tokens automatically switch to dark mode values.

### Manual Control

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function ThemeToggle() {
  const { isDark, toggleTheme, setTheme } = useTheme();

  return (
    <>
      <button onClick={toggleTheme}>
        Toggle ({isDark ? 'Dark' : 'Light'})
      </button>
      
      <button onClick={() => setTheme(true)}>
        Force Dark
      </button>
      
      <button onClick={() => setTheme(false)}>
        Force Light
      </button>
    </>
  );
}
```

## TypeScript Support

Full type safety for all theme values:

```typescript
import type {
  Colors,
  Typography,
  Spacing,
  Radius,
  Elevation,
  Breakpoints,
  Motion,
  DesignTheme,
} from '@/theme';

import type {
  ThemedButtonVariant,
  ThemedButtonSize,
  BadgeVariant,
  BadgeSize,
} from '@/components/theme-system';
```

## Best Practices

### ✅ DO

- Use CSS variables for all colors, spacing, and shadows
- Use pre-built theme components when possible
- Test components in both light and dark modes
- Use semantic color tokens (success, error, etc.)
- Leverage transition tokens for consistent animations

### ❌ DON'T

- Hard-code colors or shadow values
- Mix different token systems inconsistently
- Override theme tokens without good reason
- Forget to test dark mode
- Use non-theme colors for new components

## Migration from Design Tokens

If migrating from the previous design token system:

**Before:**
```css
background: var(--btn-primary-bg);
color: var(--btn-primary-text);
```

**After:**
```css
background: var(--theme-primary);
color: var(--theme-text-on-primary);
```

Or use components:
```tsx
<ThemedButton variant="primary">Click</ThemedButton>
```

## Examples

See live examples in:
- `/src/app/components/ThemeSystemShowcase.tsx` - Complete showcase
- `/src/app/components/theme-system/` - Component implementations

## Performance

- CSS variables are browser-native (no JS overhead)
- Theme switching is instant (CSS class change)
- All tokens are pre-computed
- Minimal re-renders with React Context

---

**Theme System Version**: 2.0.0  
**Total Tokens**: 150+  
**Modes**: Light & Dark  
**Components**: 4 base components + variants  
**Platform**: React + Tailwind CSS v4 + TypeScript
