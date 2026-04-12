'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/common/states/error-state';
import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { useToast } from '@/hooks/use-toast';
import { useActiveMaterialTypes } from '@/modules/admin-material-types';
import {
  WasteCollectionLocationForm,
  type WasteCollectionLocationPayload,
} from '@/modules/admin-recycling-centers';
import {
  getAdminLocationSuggestion,
  updateAdminLocationSuggestion,
  approveLocationSuggestion,
} from '@/modules/admin-location-suggestions/api/location-suggestions';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function AdminLocationSuggestionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const suggestionId = Number(params.id);
  const materialTypesQuery = useActiveMaterialTypes();

  const suggestionQuery = useQuery({
    queryKey: ['admin-location-suggestion', suggestionId],
    queryFn: () => getAdminLocationSuggestion(suggestionId),
    enabled: Number.isFinite(suggestionId),
  });

  const saveDraftMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Record<string, unknown>;
    }) => updateAdminLocationSuggestion(id, payload),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveLocationSuggestion(id),
  });

  const materialSlugToId = useMemo(() => {
    const map = new Map<string, number>();
    (materialTypesQuery.materialTypes ?? []).forEach((material) => {
      map.set(material.slug, material.id);
    });
    return map;
  }, [materialTypesQuery.materialTypes]);

  const initialValues = useMemo<Partial<WasteCollectionLocationPayload>>(() => {
    const suggestion = suggestionQuery.data;
    if (!suggestion) return {};

    const materialIds = Array.isArray(suggestion.materials_accepted)
      ? (suggestion.materials_accepted
          .map((item: string) => materialSlugToId.get(item))
          .filter(Boolean) as number[])
      : [];

    return {
      name: suggestion.location_name ?? '',
      country_code: suggestion.country_code ?? 'PH',
      country_name: suggestion.country_name ?? 'Philippines',
      state_province: suggestion.state_province ?? '',
      state_code: suggestion.state_code ?? '',
      city_municipality: suggestion.city_municipality ?? '',
      region: suggestion.region ?? '',
      street_address: suggestion.street_address ?? '',
      postal_code: suggestion.postal_code ?? '',
      latitude: suggestion.latitude?.toString() ?? '',
      longitude: suggestion.longitude?.toString() ?? '',
      contact_number: suggestion.contact_number ?? '',
      email: suggestion.location_email ?? '',
      operating_hours: suggestion.operating_hours ?? '',
      notes: suggestion.notes ?? '',
      is_active: suggestion.is_active ?? true,
      material_type_ids: materialIds,
    };
  }, [suggestionQuery.data, materialSlugToId]);

  function mapFormToSuggestionPayload(values: WasteCollectionLocationPayload) {
    const selectedMaterialNames = (materialTypesQuery.materialTypes ?? [])
      .filter((material) => values.material_type_ids.includes(material.id))
      .map((material) => material.name);

    return {
      location_name: values.name,
      country_code: values.country_code,
      country_name: values.country_name,
      state_province: values.state_province,
      state_code: values.state_code,
      city_municipality: values.city_municipality,
      region: values.region,
      street_address: values.street_address,
      postal_code: values.postal_code,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      contact_number: values.contact_number,
      location_email: values.email,
      operating_hours: values.operating_hours,
      notes: values.notes,
      is_active: values.is_active,
      materials_accepted: selectedMaterialNames,
    };
  }

  async function handleSubmit(
    values: WasteCollectionLocationPayload,
    action: 'draft' | 'approve' | 'save',
  ) {
    const payload = mapFormToSuggestionPayload(values);

    try {
      if (action === 'draft') {
        await saveDraftMutation.mutateAsync({
          id: suggestionId,
          payload,
        });

        toast({
          title: 'Draft saved',
          description: 'The location suggestion draft has been saved.',
          variant: 'success',
        });

        return;
      }

      if (action === 'approve') {
        await saveDraftMutation.mutateAsync({
          id: suggestionId,
          payload,
        });

        await approveMutation.mutateAsync(suggestionId);

        toast({
          title: 'Suggestion approved',
          description:
            'The location suggestion has been approved successfully.',
          variant: 'success',
        });

        router.push('/admin/location-suggestions');
      }
    } catch (error: any) {
      toast({
        title: action === 'approve' ? 'Approval failed' : 'Save failed',
        description:
          error?.response?.data?.message ||
          'Please review the form and try again.',
        variant: 'danger',
      });
    }
  }

  if (suggestionQuery.isLoading || materialTypesQuery.isLoading) {
    return <TableSkeleton />;
  }

  if (suggestionQuery.isError || !suggestionQuery.data) {
    return <ErrorState title="Failed to load location suggestion." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Location Suggestion</CardTitle>
      </CardHeader>

      <CardContent>
        <WasteCollectionLocationForm
          initialValues={initialValues}
          materialOptions={materialTypesQuery.materialTypes ?? []}
          isSubmitting={
            saveDraftMutation.isPending || approveMutation.isPending
          }
          showDraftActions
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
