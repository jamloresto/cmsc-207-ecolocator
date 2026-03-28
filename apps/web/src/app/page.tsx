import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <ThemeToggle />
    </main>
  );
}
