import { MapPinned } from 'lucide-react';

type FindCentersMapPlaceholderProps = {
  activeLocationName?: string;
};

export function FindCentersMapPlaceholder({
  activeLocationName,
}: FindCentersMapPlaceholderProps) {
  return (
    <div className="bg-muted/40 border-border relative h-full min-h-80 overflow-hidden rounded-2xl border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-background mb-4 rounded-full p-4 shadow-sm">
          <MapPinned className="text-primary h-8 w-8" />
        </div>

        <h3 className="text-foreground text-lg font-semibold">
          Map placeholder
        </h3>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          This area will later display the interactive map with location pins
          and syncing from the search toolbar.
        </p>

        {activeLocationName ? (
          <div className="bg-background border-border mt-4 rounded-full border px-4 py-2 text-xs font-medium shadow-sm">
            Focused center: {activeLocationName}
          </div>
        ) : null}
      </div>
    </div>
  );
}
