'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-muted h-9 w-18 rounded-full" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="bg-card flex items-center rounded-full border p-1">
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Switch to light mode"
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
          !isDark
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark mode"
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
          isDark
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
