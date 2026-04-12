'use client';

import { useParams, useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useToast } from '@/hooks/use-toast';
import { useActiveMaterialTypes } from '@/modules/admin-material-types';
import {
  useUpdateWasteCollectionLocation,
  useWasteCollectionLocation,
  WasteCollectionLocationForm,
  type WasteCollectionLocationPayload,
} from '@/modules/admin-recycling-centers';
import { Loader } from '@/components/common/loading/loader';

export default function EditWasteCollectionLocationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const locationQuery = useWasteCollectionLocation(params.id);
  const updateMutation = useUpdateWasteCollectionLocation(Number(params.id));
  const materialTypesQuery = useActiveMaterialTypes();

  function handleSubmit(
    values: WasteCollectionLocationPayload,
    action: 'draft' | 'approve' | 'save',
  ) {
    if (action !== 'save') return;

    updateMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Recycling center updated',
          description: 'The recycling center has been updated successfully.',
          variant: 'success',
        });

        router.push('/admin/recycling-centers');
      },
      onError: () => {
        toast({
          title: 'Update failed',
          description: 'Please review the form and try again.',
          variant: 'danger',
        });
      },
    });
  }

  const location = locationQuery.data;

  return (
    <>
      {location ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Recycling Center</CardTitle>
          </CardHeader>

          <CardContent>
            <WasteCollectionLocationForm
              materialOptions={materialTypesQuery.materialTypes ?? []}
              isSubmitting={updateMutation.isPending}
              submitLabel="Save Changes"
              initialValues={{
                name: location.name,
                country_code: location.country_code,
                country_name: location.country_name,
                state_province: location.state_province,
                state_code: location.state_code ?? '',
                city_municipality: location.city_municipality,
                region: location.region ?? '',
                street_address: location.street_address,
                postal_code: location.postal_code ?? '',
                latitude: String(location.latitude ?? ''),
                longitude: String(location.longitude ?? ''),
                contact_number: location.contact_number ?? '',
                email: location.email ?? '',
                operating_hours: location.operating_hours ?? '',
                notes: location.notes ?? '',
                is_active: location.is_active,
                material_type_ids:
                  location.material_types?.map((item) => item.id) ?? [],
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="mt-24 items-center justify-items-center">
          <Loader text="Loading location details..." />
        </div>
      )}
    </>
  );
}
