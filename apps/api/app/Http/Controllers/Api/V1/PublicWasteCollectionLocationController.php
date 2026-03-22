<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteCollectionLocationResource;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\Request;

class PublicWasteCollectionLocationController extends Controller
{
    public function index(Request $request)
    {
        $query = WasteCollectionLocation::with('materialTypes')
            ->where('is_active', true);

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

    public function show(WasteCollectionLocation $location)
    {
        if (!$location->is_active) {
            return response()->json([
                'message' => 'Location not found.',
            ], 404);
        }

        $location->load('materialTypes');

        return new WasteCollectionLocationResource($location);
    }
}