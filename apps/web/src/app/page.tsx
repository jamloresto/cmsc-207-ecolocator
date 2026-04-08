import { PublicLayout } from "@/components/layout/public-layout";
import Hero from "@/modules/home/components/hero";


export default function HomePage() {
  
  return (
    <PublicLayout>
      <main className="bg-background text-foreground">
        <Hero />
      </main>
    </PublicLayout>
  );
}
