# Mindscape - Branding Guidelines

## App Name

**Mindscape**

## Tagline

_Your Memory Palace_

## About

Mindscape is a memory training application based on the ancient method of loci (memory palace technique). The app helps users build mental landscapes to enhance memory retention and recall.

## Logo & Icon

### App Icon

The Mindscape icon represents a memory palace structure with:

- **Central hub**: The core of your memory palace
- **Nodes**: Individual memory locations (loci)
- **Connections**: Neural pathways linking memories together
- **Architecture**: Palace-like structure radiating from the center

### Colors

The icon uses a gradient of iOS blues:

- **Primary Blue**: `#007AFF` (iOS System Blue)
- **Dark Blue**: `#0051D5`
- **Bright Blue**: `#1f74ec`
- **Accent Blues**: `#5AC8FA`, `#64D2FF`, `#0A84FF`, `#32ADE6`

### Icon Sizes

- Small: 40px
- Medium: 60px (default)
- Large: 80px

## Typography

### Primary Font

**SF Pro Display** - Used for headings and titles

- Font Family: `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif`
- Weights: 600 (Semibold), 700 (Bold)

### Secondary Font

**SF Pro Text** - Used for body text and UI elements

- Font Family: `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold)

## Color Palette

### Primary Colors

```
iOS Blue:     #007AFF  (Primary actions, links)
Deep Blue:    #0051D5  (Hover states)
Bright Blue:  #1f74ec  (Gradients)
```

### Accent Colors

```
Cyan:         #5AC8FA  (Secondary elements)
Light Cyan:   #64D2FF  (Highlights)
```

### Neutral Colors

```
Black:        #000000  (Primary text)
Gray:         #86868B  (Secondary text)
Light Gray:   #D1D1D6  (Borders, dividers)
Background:   #E5E5EA  (Subtle backgrounds)
White:        #FFFFFF  (Backgrounds, contrast)
```

### Semantic Colors

```
Success:      #34C759  (iOS Green - toggles, success states)
Error:        #FF3B30  (iOS Red - errors, warnings)
```

## Logo Usage

### Standard Logo

```tsx
import { AppLogo } from "./components/ui/AppLogo";

<AppLogo size="medium" />;
```

### With Tagline

```tsx
<AppLogo size="large" showTagline />
```

### Icon Only

```tsx
import { AppIcon } from "./components/ui/AppIcon";

<AppIcon size={60} />;
```

### Dark Theme

```tsx
<AppLogo theme="dark" showTagline />
```

### Light Theme

```tsx
<AppLogo theme="light" />
```

## Spacing

### Logo Spacing

- Minimum clear space around logo: 20px
- Logo-to-content gap: 16px - 40px depending on context

### Component Spacing

- Small gap: 8px
- Medium gap: 16px
- Large gap: 24px
- XLarge gap: 40px

## Use Cases

### Welcome Screen

- Large logo with tagline
- Dark theme on blue gradient background
- Centered alignment

### Login/Signup Modals

- Small logo without tagline
- Light theme on white background
- Centered at top of modal

### App Header

- Medium logo or icon only
- Theme matching overall interface
- Left-aligned

## Don'ts

❌ Don't rotate the logo
❌ Don't change the icon colors or gradients
❌ Don't stretch or distort the logo
❌ Don't use old "Cleverwise" branding
❌ Don't add effects like drop shadows to the logo
❌ Don't place logo on backgrounds with insufficient contrast

## Dos

✅ Use the provided AppLogo component
✅ Match theme to background (dark on colored, light on white)
✅ Maintain proper spacing and sizing
✅ Use consistent color scheme throughout app
✅ Follow iOS Human Interface Guidelines

## Brand Voice

**Mindscape** is:

- **Intelligent**: Leveraging proven memory techniques
- **Accessible**: Easy to understand and use
- **Empowering**: Helping users achieve more
- **Modern**: Clean, contemporary iOS design
- **Trustworthy**: Based on scientific memory methods

## Messaging

### Key Messages

- "Build your mental palace"
- "Unlock limitless memory"
- "Your mind, organized"
- "Remember everything that matters"
- "The ancient art of memory, modernized"

### Tone

- Professional yet approachable
- Encouraging and supportive
- Clear and concise
- Focused on benefits, not features