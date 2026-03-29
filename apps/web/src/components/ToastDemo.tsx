'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast({
            title: 'Location approved',
            description: 'The recycling center has been successfully approved.',
            variant: 'success',
          })
        }
      >
        Success Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Something went wrong',
            description: 'Unable to save your changes. Please try again.',
            variant: 'error',
          })
        }
      >
        Error Toast
      </Button>

      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Heads up',
            description: 'This action will update the public listing.',
            variant: 'warning',
          })
        }
      >
        Warning Toast
      </Button>
    </div>
  );
}
