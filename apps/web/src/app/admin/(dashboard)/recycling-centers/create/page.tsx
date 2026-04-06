'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useToast } from '@/hooks/use-toast';
import { useMaterialTypes } from '@/modules/material-types/hooks/use-material-types';
import {
  useCreateWasteCollectionLocation,
  WasteCollectionLocationForm,
  type WasteCollectionLocationPayload,
} from '@/modules/admin-recycling-centers';

export default function CreateWasteCollectionLocationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createMutation = useCreateWasteCollectionLocation();
  const materialTypesQuery = useMaterialTypes();

  function handleSubmit(values: WasteCollectionLocationPayload) {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Recycling center created',
          description: 'The recycling center has been created successfully.',
          variant: 'success',
        });

        router.push('/admin/recycling-centers');
      },
      onError: () => {
        toast({
          title: 'Create failed',
          description: 'Please review the form and try again.',
          variant: 'danger',
        });
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Recycling Center</CardTitle>
      </CardHeader>

      <CardContent>
        <WasteCollectionLocationForm
          materialOptions={materialTypesQuery.materialTypes ?? []}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Recycling Center"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
