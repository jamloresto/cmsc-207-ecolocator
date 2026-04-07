import { LoaderCircle } from 'lucide-react';

type LoaderProps = {
  text?: string;
};

export function Loader({ text = 'Loading...' }: LoaderProps) {
  return (
    <div className="bg-background/90 border-border flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm backdrop-blur-sm">
      <LoaderCircle className="text-primary h-4 w-4 animate-spin" />
      <span className="text-foreground text-sm font-medium">{text}</span>
    </div>
  );
}
