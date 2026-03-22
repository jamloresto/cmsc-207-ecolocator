<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWasteCollectionLocationRequest;
use App\Http\Requests\UpdateWasteCollectionLocationRequest;
use App\Http\Resources\WasteCollectionLocationResource;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\Request;

class WasteCollectionLocationController extends Controller
{
    public function index(Request $request)
    {
        $query = WasteCollectionLocation::with('materialTypes');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('street_address', 'like', "%{$search}%")
                    ->orWhere('city_municipality', 'like', "%{$search}%")
                    ->orWhere('state_province', 'like', "%{$search}%")
                    ->orWhere('country_name', 'like', "%{$search}%");
            });
        }

        $query->when($request->country_code, fn ($q, $value) => $q->where('country_code', strtoupper($value)))
            ->when($request->state_province, fn ($q, $value) => $q->where('state_province', $value))
            ->when($request->state_code, fn ($q, $value) => $q->where('state_code', strtoupper($value)))
            ->when($request->city_municipality, fn ($q, $value) => $q->where('city_municipality', $value))
            ->when($request->city_slug, fn ($q, $value) => $q->where('city_slug', $value))
            ->when($request->region, fn ($q, $value) => $q->where('region', $value))
            ->when(
                $request->material_type_id,
                fn ($q, $value) => $q->whereHas('materialTypes', fn ($subQ) => $subQ->where('material_types.id', $value))
            )
            ->when(
                $request->material_slug,
                fn ($q, $value) => $q->whereHas('materialTypes', fn ($subQ) => $subQ->where('material_types.slug', $value))
            );

        $locations = $query->latest()->paginate(10);

        return WasteCollectionLocationResource::collection($locations);
    }

    public function store(StoreWasteCollectionLocationRequest $request)
    {
        $data = $request->validated();
        $materialTypeIds = $data['material_type_ids'] ?? [];
        unset($data['material_type_ids']);

        $location = WasteCollectionLocation::create([
            ...$data,
            'is_active' => $request->boolean('is_active', true),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        $location->materialTypes()->sync($materialTypeIds);
        $location->load('materialTypes');

        return (new WasteCollectionLocationResource($location))
            ->response()
            ->setStatusCode(201);
    }

    public function show(WasteCollectionLocation $location)
    {
        $location->load('materialTypes');

        return new WasteCollectionLocationResource($location);
    }

    public function update(UpdateWasteCollectionLocationRequest $request, WasteCollectionLocation $location)
    {
        $data = $request->validated();

        if (array_key_exists('material_type_ids', $data)) {
            $materialTypeIds = $data['material_type_ids'] ?? [];
            unset($data['material_type_ids']);
            $location->materialTypes()->sync($materialTypeIds);
        }

        $location->update([
            ...$data,
            'updated_by' => $request->user()->id,
        ]);

        $location->load('materialTypes');

        return new WasteCollectionLocationResource($location);
    }

    public function destroy(WasteCollectionLocation $location)
    {
        $location->delete();

        return response()->json([
            'message' => 'Location deleted successfully.',
        ]);
    }
}