import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  ThemedButton,
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  ThemedCardFooter,
  ThemedInput,
  ThemedBadge,
} from './theme-system';
import { Sun, Moon, Palette } from 'lucide-react';

export function ThemeSystemShowcase() {
  const { isDark, toggleTheme, theme } = useTheme();
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] transition-[var(--theme-transition-moderate)]">
      <div className="max-w-7xl mx-auto p-[var(--theme-container-padding)] space-y-[var(--theme-space-12)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--theme-text-primary)] mb-2">
              Theme System Showcase
            </h1>
            <p className="text-[var(--theme-text-secondary)] flex items-center gap-2">
              <Palette size={18} />
              Professional design system with comprehensive tokens
            </p>
          </div>
          <ThemedButton
            variant="outline"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light' : 'Dark'} Mode
          </ThemedButton>
        </div>

        {/* Colors */}
        <ThemedCard>
          <ThemedCardHeader>
            <ThemedCardTitle>Color System</ThemedCardTitle>
            <ThemedCardDescription>
              Brand, semantic, and neutral colors with full light/dark mode support
            </ThemedCardDescription>
          </ThemedCardHeader>
          <ThemedCardContent>
            <div className="space-y-6">
              {/* Brand Colors */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--theme-text-secondary)] mb-3">
                  Brand Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-primary)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Primary</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-secondary)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Secondary</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-accent)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Accent</p>
                  </div>
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--theme-text-secondary)] mb-3">
                  Semantic Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-success)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Success</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-warning)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Warning</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-error)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Error</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-[var(--theme-radius-lg)] bg-[var(--theme-info)] shadow-[var(--theme-shadow-md)]" />
                    <p className="text-xs text-[var(--theme-text-tertiary)]">Info</p>
                  </div>
                </div>
              </div>
            </div>
          </ThemedCardContent>
        </ThemedCard>

        {/* Buttons */}
        <ThemedCard>
          <ThemedCardHeader>
            <ThemedCardTitle>Button Variants</ThemedCardTitle>
            <ThemedCardDescription>
              Multiple variants and sizes with proper hover/active states
            </ThemedCardDescription>
          </ThemedCardHeader>
          <ThemedCardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <ThemedButton variant="primary">Primary</ThemedButton>
                <ThemedButton variant="secondary">Secondary</ThemedButton>
                <ThemedButton variant="accent">Accent</ThemedButton>
                <ThemedButton variant="outline">Outline</ThemedButton>
                <ThemedButton variant="ghost">Ghost</ThemedButton>
                <ThemedButton disabled>Disabled</ThemedButton>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <ThemedButton variant="primary" size="sm">Small</ThemedButton>
                <ThemedButton variant="primary" size="md">Medium</ThemedButton>
                <ThemedButton variant="primary" size="lg">Large</ThemedButton>
              </div>

              <ThemedButton variant="primary" fullWidth>
                Full Width Button
              </ThemedButton>
            </div>
          </ThemedCardContent>
        </ThemedCard>

        {/* Badges */}
        <ThemedCard>
          <ThemedCardHeader>
            <ThemedCardTitle>Badges</ThemedCardTitle>
            <ThemedCardDescription>
              Status indicators with semantic variants
            </ThemedCardDescription>
          </ThemedCardHeader>
          <ThemedCardContent>
            <div className="flex flex-wrap gap-3">
              <ThemedBadge variant="primary" dot>Primary</ThemedBadge>
              <ThemedBadge variant="secondary">Secondary</ThemedBadge>
              <ThemedBadge variant="success" dot>Success</ThemedBadge>
              <ThemedBadge variant="warning" dot>Warning</ThemedBadge>
              <ThemedBadge variant="error" dot>Error</ThemedBadge>
              <ThemedBadge variant="info">Info</ThemedBadge>
            </div>
          </ThemedCardContent>
        </ThemedCard>

        {/* Form Elements */}
        <ThemedCard>
          <ThemedCardHeader>
            <ThemedCardTitle>Form Elements</ThemedCardTitle>
            <ThemedCardDescription>
              Input fields with validation states
            </ThemedCardDescription>
          </ThemedCardHeader>
          <ThemedCardContent>
            <div className="space-y-4 max-w-md">
              <ThemedInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasError(false);
                }}
                error={hasError}
                helperText={hasError ? 'Please enter a valid email' : 'We will never share your email'}
              />

              <ThemedInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                variant="filled"
              />

              <ThemedInput
                label="Disabled Field"
                disabled
                value="Cannot edit this"
              />
            </div>
          </ThemedCardContent>
          <ThemedCardFooter>
            <div className="flex gap-3">
              <ThemedButton
                variant="primary"
                onClick={() => setHasError(!email.includes('@'))}
              >
                Validate
              </ThemedButton>
              <ThemedButton
                variant="outline"
                onClick={() => {
                  setEmail('');
                  setHasError(false);
                }}
              >
                Clear
              </ThemedButton>
            </div>
          </ThemedCardFooter>
        </ThemedCard>

        {/* Card Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ThemedCard hoverable>
            <ThemedCardContent>
              <div className="text-center py-6">
                <h4 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-2">
                  Hoverable Card
                </h4>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  Hover to see smooth transitions
                </p>
              </div>
            </ThemedCardContent>
          </ThemedCard>

          <ThemedCard elevated>
            <ThemedCardContent>
              <div className="text-center py-6">
                <h4 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-2">
                  Elevated Card
                </h4>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  Enhanced shadow for emphasis
                </p>
              </div>
            </ThemedCardContent>
          </ThemedCard>

          <ThemedCard glass>
            <ThemedCardContent>
              <div className="text-center py-6">
                <h4 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-2">
                  Glass Card
                </h4>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  Frosted glass effect
                </p>
              </div>
            </ThemedCardContent>
          </ThemedCard>
        </div>

        {/* Token Reference */}
        <ThemedCard>
          <ThemedCardHeader>
            <ThemedCardTitle>Design Tokens</ThemedCardTitle>
            <ThemedCardDescription>
              Complete token system available as CSS custom properties
            </ThemedCardDescription>
          </ThemedCardHeader>
          <ThemedCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-[var(--theme-text-primary)] mb-3">Colors</h4>
                <ul className="space-y-1 text-[var(--theme-text-tertiary)]">
                  <li>--theme-primary</li>
                  <li>--theme-secondary</li>
                  <li>--theme-accent</li>
                  <li>--theme-success</li>
                  <li>--theme-warning</li>
                  <li>--theme-error</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--theme-text-primary)] mb-3">Spacing</h4>
                <ul className="space-y-1 text-[var(--theme-text-tertiary)]">
                  <li>--theme-space-{'{1-24}'}</li>
                  <li>--theme-button-px</li>
                  <li>--theme-card-padding</li>
                  <li>--theme-container-max</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--theme-text-primary)] mb-3">Effects</h4>
                <ul className="space-y-1 text-[var(--theme-text-tertiary)]">
                  <li>--theme-radius-{'{sm-3xl}'}</li>
                  <li>--theme-shadow-{'{sm-2xl}'}</li>
                  <li>--theme-transition-{'{fast-slow}'}</li>
                </ul>
              </div>
            </div>
          </ThemedCardContent>
        </ThemedCard>
      </div>
    </div>
  );
}
