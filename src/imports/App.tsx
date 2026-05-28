import React, { useState } from 'react';
import { AppThemeProvider } from '../src/theme/AppThemeProvider';
import { Button } from '../src/components/Button';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <AppThemeProvider isDark={isDark} onToggleTheme={() => setIsDark(!isDark)}>
      <div style={{ 
        minHeight: '100vh', 
        padding: '2rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>Design System Demo</h1>
          <p>Your design system is ready to use!</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button onClick={() => setIsDark(!isDark)}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </div>
      </div>
    </AppThemeProvider>
  );
}

export default App;
