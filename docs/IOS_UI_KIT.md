# iOS UI Kit - Design System

This project uses an iOS-inspired design system with liquid glass effects and native iOS components following Apple's
Human Interface Guidelines.

## Components

### TextField

iOS-native text input with support for icons, password toggle, and error states.

#### Variants

1. **filled** (Default)
    - Light gray background (iOS style)
    - No border in default state
    - Perfect for modern iOS apps

   ```tsx
   <TextField placeholder="Email" variant="filled" />
   ```

2. **outlined**
    - White background with border
    - Blue ring on focus
    - Traditional form style
   ```tsx
   <TextField placeholder="Email" variant="outlined" />
   ```

#### Features

- **Password Toggle**: Automatically shows/hides password
- **Icons**: Leading and trailing icon support
- **Labels**: Optional top label
- **Error States**: Built-in error messaging
- **Auto SF Pro Font**: Uses iOS system font

#### Example Usage

```tsx
import { TextField } from './components/ui';
import { Mail, Lock } from 'lucide-react';

// Basic field
<TextField
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With icon
<TextField
  placeholder="Email"
  leadingIcon={<Mail size={20} />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Password field (automatic toggle)
<TextField
  type="password"
  placeholder="Password"
  leadingIcon={<Lock size={20} />}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// With label and error
<TextField
  label="Email Address"
  error="Please enter a valid email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Toggle (iOS Switch)

Native iOS toggle switch with smooth spring animation.

#### Example Usage

```tsx
import { Toggle } from "./components/ui";

<Toggle
  checked={rememberMe}
  onChange={setRememberMe}
  label="Remember me"
/>;
```

#### Features

- **Spring Animation**: Native iOS-feel animation
- **Colors**: Green when on (#34C759), gray when off
- **Disabled State**: Automatic opacity handling
- **Label Support**: Optional text label

### Checkbox

iOS-style checkbox with checkmark animation.

#### Example Usage

```tsx
import { Checkbox } from './components/ui';

<Checkbox
  checked={agreeToTerms}
  onChange={setAgreeToTerms}
  label="I agree to the Terms and Conditions"
/>

// With custom label
<Checkbox
  checked={agreeToTerms}
  onChange={setAgreeToTerms}
  label={
    <span>
      I agree to the <a href="#">Terms</a>
    </span>
  }
/>
```

#### Features

- **iOS Colors**: Blue when checked (#007AFF)
- **Smooth Animation**: Scale and fade animation
- **Custom Labels**: Support for React nodes
- **Disabled State**: Built-in disabled styling

### Divider

Simple divider with optional text.

#### Example Usage

```tsx
import { Divider } from './components/ui';

// Simple line
<Divider />

// With text (e.g., "OR")
<Divider text="or" />
```

## Components

### Button

The Button component comes in multiple variants following iOS design patterns:

#### Variants

1. **liquid-glass** (Default)
    - Frosted glass effect with backdrop blur
    - Multi-layer shadow and blend modes
    - Perfect for overlays on colored backgrounds

   ```tsx
   <Button variant="liquid-glass">Get Started</Button>
   ```

2. **liquid-glass-text**
    - Similar to liquid-glass but optimized for text-only buttons

   ```tsx
   <Button variant="liquid-glass-text">Cancel</Button>
   ```

3. **primary**
    - Solid iOS blue (#007AFF)
    - White text
    - Best for primary actions

   ```tsx
   <Button variant="primary">Sign In</Button>
   ```

4. **secondary**
    - Light gray background with iOS blue text
    - Perfect for secondary actions
   ```tsx
   <Button variant="secondary">Learn More</Button>
   ```

#### Sizes

- `small`: 36px height
- `medium`: 48px height (default)
- `large`: 56px height

#### Example Usage

```tsx
import { Button } from './components/ui/Button';

// With icon
<Button
  variant="primary"
  size="large"
  icon={<Icon />}
>
  Submit
</Button>

// Custom className
<Button
  variant="liquid-glass"
  className="w-full"
  onClick={handleClick}
>
  Continue
</Button>
```

### StatusBar

iOS-style status bar with time, cellular, WiFi, and battery indicators.

#### Themes

- `light`: Black icons/text (default)
- `dark`: White icons/text

#### Example Usage

```tsx
import { StatusBar } from './components/ui/StatusBar';

// Light theme (default)
<StatusBar />

// Dark theme (for dark backgrounds)
<StatusBar theme="dark" />
```

## Default Styles

All buttons in the app automatically use iOS system fonts (`-apple-system, BlinkMacSystemFont, "SF Pro Text"`).

### Typography

The app uses two primary font families:

- **Libre Franklin**: For headings and display text
- **Mulish**: For body text and labels
- **SF Pro**: For system UI elements (buttons, status bar)

### Liquid Glass Utilities

CSS utility classes are available for custom liquid glass effects:

```css
.liquid-glass-bg {
  /* Automatically applies:
   * - Frosted glass background
   * - Multi-layer shadow
   * - Proper blend modes
   */
}
```

## Design Tokens

### Colors

- **Primary**: `#007AFF` (iOS Blue)
- **Secondary**: `rgba(120,120,128,0.16)`
- **Success**: `#34C759`
- **Danger**: `#FF3B30`

### Spacing

Follows iOS HIG spacing guidelines:

- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 40px

### Border Radius

- Small: 8px
- Medium: 12px
- Large: 24px
- Pill: 1000px (rounded-full)

## Modal Patterns

Modals use iOS-style bottom sheets with:

- Drag handle at top (36px × 5px)
- Spring animation (damping: 30, stiffness: 300)
- Backdrop blur overlay
- Close button in header

### Example Modal Structure

```tsx
<motion.div
  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px]"
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", damping: 30, stiffness: 300 }}
>
  {/* Drag handle */}
  <div className="flex justify-center pt-[12px] pb-[8px]">
    <div className="w-[36px] h-[5px] bg-[#d1d1d6] rounded-full" />
  </div>

  {/* Header */}
  <div className="flex items-center justify-between px-[20px] pt-[12px] pb-[16px]">
    {/* Content */}
  </div>
</motion.div>
```

## Best Practices

1. **Always use the Button component** instead of raw `<button>` elements for consistency
2. **Match StatusBar theme** to your background color (dark theme for dark backgrounds)
3. **Use liquid-glass buttons** on colored backgrounds for best visual effect
4. **Use primary buttons** for main actions, secondary for supporting actions
5. **Keep modal content scrollable** when it exceeds viewport height
6. **Use spring animations** for iOS-native feel
7. **Follow iOS spacing guidelines** for consistent layouts