import { PublicLayout } from '@/components/layout/public-layout';

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">EcoLocator</h1>
        <p className="text-muted-foreground mt-4">
          Test public layout - Jam Hernandez
        </p>
      </section>
    </PublicLayout>
  );
}
