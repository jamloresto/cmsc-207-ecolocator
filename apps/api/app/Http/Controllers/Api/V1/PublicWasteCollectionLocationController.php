<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteCollectionLocationResource;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PublicWasteCollectionLocationController extends Controller
{
    #[OA\Get(
        path: '/api/v1/locations',
        summary: 'List active waste collection locations',
        tags: ['Public Locations'],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'country_code', in: 'query', required: false, schema: new OA\Schema(type: 'string', example: 'PH')),
            new OA\Parameter(name: 'state_province', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'state_code', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'city_municipality', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'city_slug', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'region', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'material_type_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'material_slug', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'List of active locations')
        ]
    )]
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

        return WasteCollectionLocationResource::collection($query->latest()->paginate(10));
    }

    #[OA\Get(
        path: '/api/v1/locations/{location}',
        summary: 'Get one active waste collection location',
        tags: ['Public Locations'],
        parameters: [
            new OA\Parameter(
                name: 'location',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location details'),
            new OA\Response(response: 404, description: 'Location not found')
        ]
    )]
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