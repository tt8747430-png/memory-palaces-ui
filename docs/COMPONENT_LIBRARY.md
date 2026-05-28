# Component Library - Complete Guide

## 🎨 Form Controls

### TextField

**Import**: `import { TextField } from './components/ui';`

**Props**:

- `variant`: "filled" | "outlined" (default: "filled")
- `label`: string
- `error`: string
- `helperText`: string
- `leadingIcon`: ReactNode
- `trailingIcon`: ReactNode
- All standard HTML input props

**Examples**:

```tsx
// Basic email field
<TextField
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With icon and label
<TextField
  label="Email Address"
  placeholder="you@example.com"
  leadingIcon={<Mail size={20} />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Password with auto-toggle
<TextField
  type="password"
  placeholder="Password"
  leadingIcon={<Lock size={20} />}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// With error
<TextField
  error="Invalid email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Outlined variant
<TextField
  variant="outlined"
  placeholder="Search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

---

### Toggle

**Import**: `import { Toggle } from './components/ui';`

**Props**:

- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `label`: string
- `disabled`: boolean

**Examples**:

```tsx
// Basic toggle
<Toggle
  checked={enabled}
  onChange={setEnabled}
/>

// With label
<Toggle
  checked={rememberMe}
  onChange={setRememberMe}
  label="Remember me"
/>

// Disabled
<Toggle
  checked={enabled}
  onChange={setEnabled}
  disabled
/>
```

---

### Checkbox

**Import**: `import { Checkbox } from './components/ui';`

**Props**:

- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `label`: ReactNode
- `disabled`: boolean

**Examples**:

```tsx
// Basic checkbox
<Checkbox
  checked={selected}
  onChange={setSelected}
/>

// With text label
<Checkbox
  checked={agreeToTerms}
  onChange={setAgreeToTerms}
  label="I agree to the Terms of Service"
/>

// With custom label
<Checkbox
  checked={agreeToTerms}
  onChange={setAgreeToTerms}
  label={
    <span>
      I agree to the{' '}
      <a href="#" className="text-[#007AFF]">Terms</a>
      {' '}and{' '}
      <a href="#" className="text-[#007AFF]">Privacy Policy</a>
    </span>
  }
/>
```

---

### Button

**Import**: `import { Button } from './components/ui';`

**Variants**:

- `liquid-glass`: Frosted glass effect (default)
- `liquid-glass-text`: Glass effect for text buttons
- `primary`: Solid iOS blue
- `secondary`: Light gray with blue text

**Sizes**:

- `small`: 36px
- `medium`: 48px (default)
- `large`: 56px

**Props**:

- `variant`: "liquid-glass" | "liquid-glass-text" | "primary" | "secondary"
- `size`: "small" | "medium" | "large"
- `icon`: ReactNode
- `disabled`: boolean
- All standard HTML button props

**Examples**:

```tsx
// Primary action
<Button variant="primary" size="large">
  Sign In
</Button>

// Secondary action
<Button variant="secondary">
  Cancel
</Button>

// Liquid glass (for colored backgrounds)
<Button variant="liquid-glass">
  Get Started
</Button>

// With icon
<Button
  variant="primary"
  icon={<ArrowRight size={20} />}
>
  Continue
</Button>

// Disabled
<Button
  variant="primary"
  disabled={!formValid}
>
  Submit
</Button>

// Full width
<Button
  variant="primary"
  className="w-full"
>
  Sign In
</Button>
```

---

### Divider

**Import**: `import { Divider } from './components/ui';`

**Props**:

- `text`: string
- `className`: string

**Examples**:

```tsx
// Simple line
<Divider />

// With text
<Divider text="or" />

// Custom spacing
<Divider className="my-8" />
```

---

### StatusBar

**Import**: `import { StatusBar } from './components/ui';`

**Props**:

- `theme`: "light" | "dark" (default: "light")

**Examples**:

```tsx
// Light theme (black icons)
<StatusBar />
<StatusBar theme="light" />

// Dark theme (white icons)
<StatusBar theme="dark" />
```

---

## 🎯 Complete Form Examples

### Login Form

```tsx
import {
  TextField,
  Toggle,
  Button,
  Divider,
} from "./components/ui";
import { Mail, Lock } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <form>
      <TextField
        type="email"
        placeholder="Email"
        leadingIcon={<Mail size={20} />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        type="password"
        placeholder="Password"
        leadingIcon={<Lock size={20} />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <Toggle
          checked={rememberMe}
          onChange={setRememberMe}
          label="Remember me"
        />

        <a href="#">Forgot password?</a>
      </div>

      <Button variant="primary" size="large" className="w-full">
        Sign In
      </Button>

      <Divider text="or" />

      <Button
        variant="secondary"
        size="large"
        className="w-full"
      >
        Continue with Google
      </Button>
    </form>
  );
}
```

### Signup Form

```tsx
import { TextField, Checkbox, Button } from "./components/ui";
import { User, Mail, Lock } from "lucide-react";

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <form>
      <TextField
        placeholder="Full Name"
        leadingIcon={<User size={20} />}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <TextField
        type="email"
        placeholder="Email"
        leadingIcon={<Mail size={20} />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        type="password"
        placeholder="Password"
        leadingIcon={<Lock size={20} />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Checkbox
        checked={agreeToTerms}
        onChange={setAgreeToTerms}
        label={
          <span>
            I agree to the{" "}
            <a href="#" className="text-[#007AFF]">
              Terms
            </a>
          </span>
        }
      />

      <Button
        variant="primary"
        size="large"
        className="w-full"
        disabled={!agreeToTerms}
      >
        Create Account
      </Button>
    </form>
  );
}
```

---

## 🎨 Design Tokens

### Colors

```tsx
// Primary
#007AFF - iOS Blue

// Success
#34C759 - iOS Green

// Danger
#FF3B30 - iOS Red

// Gray Scale
#000000 - Primary Text
#86868B - Secondary Text
#D1D1D6 - Borders
#E5E5EA - Light Backgrounds
rgba(120,120,128,0.12) - Filled Input Background
```

### Typography

All components use iOS system fonts by default:

```css
font-family:
  -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui,
  sans-serif;
```

### Spacing

```tsx
8px   - Small
12px  - Medium-Small
16px  - Medium
20px  - Medium-Large
24px  - Large
32px  - XLarge
```

### Border Radius

```tsx
5px    - Checkbox
10px   - TextField
24px   - Modal
1000px - Button (pill shape)
```

---

## 🚀 Best Practices

1. **Always use TextField** instead of raw `<input>` for consistency
2. **Use filled variant** for modern iOS feel
3. **Match icon sizes** to 20px for text fields
4. **Keep buttons consistent** - primary for main actions, secondary for supporting
5. **Use Toggle for binary choices**, Checkbox for agreements
6. **Disable buttons** when forms are invalid
7. **Add proper labels** for accessibility
8. **Use StatusBar theme** matching your background

---

## 📱 Modal Pattern

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
    <div className="w-[36px] h-[5px] bg-[#D1D1D6] rounded-full" />
  </div>

  {/* Content */}
</motion.div>
```