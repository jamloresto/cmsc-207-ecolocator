import { PublicLayout } from "@/components/layout/public-layout";
import { LocationSuggestionForm } from "@/modules/location-suggestions";

export default function SuggestLocationPage() {
  return (
    <PublicLayout>
      <main className="bg-background min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-8 text-center md:mb-10">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Suggest a Location
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Know a recycling or waste collection site that should be listed?
              Send us the details for review.
            </p>
          </div>

          <LocationSuggestionForm />
        </div>
      </main>
    </PublicLayout>
  );
}
