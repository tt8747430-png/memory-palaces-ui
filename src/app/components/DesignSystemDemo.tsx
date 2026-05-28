import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
} from './design-system';
import { AlertVariant } from './design-system/Alert';

export function DesignSystemDemo() {
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [activeAlert, setActiveAlert] = useState<AlertVariant>('info');

  const alertVariants: AlertVariant[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
  ];

  const handleSubmit = () => {
    if (!email.includes('@')) {
      setHasError(true);
      setActiveAlert('error');
    } else {
      setHasError(false);
      setActiveAlert('success');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Design System Demo</h1>
          <p className="text-[var(--form-label-text)]">
            Memory Palace Design Token System
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Various button styles with different variants and sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>

              <Button variant="primary" fullWidth>
                Full Width Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>
              6 semantic alert variants with light/dark mode support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertVariants.map((variant) => (
                <Alert
                  key={variant}
                  variant={variant}
                  title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Alert`}
                >
                  This is a {variant} alert message with proper semantic colors.
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Input fields with validation and error states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasError(false);
                }}
                error={hasError}
                helperText={
                  hasError ? 'Please enter a valid email' : 'We will never share your email'
                }
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
              />

              <Input label="Disabled Field" disabled value="Cannot edit" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-3 w-full">
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmail('');
                  setHasError(false);
                }}
              >
                Clear
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverable>
            <CardContent>
              <div className="text-center py-4">
                <h3 className="font-semibold mb-2">Hoverable Card</h3>
                <p className="text-sm text-[var(--form-label-text)]">
                  Hover to see the effect
                </p>
              </div>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-center py-4">
                <h3 className="font-semibold mb-2">Smooth Transitions</h3>
                <p className="text-sm text-[var(--form-label-text)]">
                  With proper shadows
                </p>
              </div>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-center py-4">
                <h3 className="font-semibold mb-2">Theme Aware</h3>
                <p className="text-sm text-[var(--form-label-text)]">
                  Works in dark mode
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alert Demo */}
        {email && (
          <Alert variant={activeAlert}>
            {activeAlert === 'success'
              ? `Great! "${email}" is a valid email address.`
              : `Please check your email format.`}
          </Alert>
        )}

        {/* Token Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Design Tokens</CardTitle>
            <CardDescription>
              All components use CSS custom properties for theme consistency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Button Tokens</h4>
                <ul className="space-y-1 text-[var(--form-label-text)]">
                  <li>--btn-primary-bg</li>
                  <li>--btn-primary-text</li>
                  <li>--btn-primary-hover</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Form Tokens</h4>
                <ul className="space-y-1 text-[var(--form-label-text)]">
                  <li>--form-input-bg</li>
                  <li>--form-input-border</li>
                  <li>--form-input-border-focus</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Card Tokens</h4>
                <ul className="space-y-1 text-[var(--form-label-text)]">
                  <li>--card-bg</li>
                  <li>--card-border</li>
                  <li>--card-shadow</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Alert Tokens</h4>
                <ul className="space-y-1 text-[var(--form-label-text)]">
                  <li>--alert-success-bg</li>
                  <li>--alert-error-border</li>
                  <li>--alert-info-text</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-[var(--form-label-text)]">
              See DESIGN_SYSTEM.md for complete token reference
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
