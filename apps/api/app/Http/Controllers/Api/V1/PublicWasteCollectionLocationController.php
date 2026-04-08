<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MapWasteCollectionLocationResource;
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
            new OA\Parameter(
                name: 'material_slugs[]',
                in: 'query',
                required: false,
                schema: new OA\Schema(
                    type: 'array',
                    items: new OA\Items(type: 'string')
                )
            ),
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

        $materialSlugs = collect($request->input('material_slugs', []))
            ->filter(fn ($slug) => filled($slug))
            ->map(fn ($slug) => (string) $slug)
            ->values()
            ->all();

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
                !empty($materialSlugs),
                fn ($q) => $q->whereHas(
                    'materialTypes',
                    fn ($subQ) => $subQ->whereIn('material_types.slug', $materialSlugs)
                )
            )
            ->when(
                empty($materialSlugs) && $request->material_slug,
                fn ($q, $value) => $q->whereHas('materialTypes', fn ($subQ) => $subQ->where('material_types.slug', $value))
            );

        return WasteCollectionLocationResource::collection($query->latest()->paginate(10));
    }

    #[OA\Get(
        path: '/api/v1/locations/map',
        summary: 'List active waste collection locations within map bounds',
        tags: ['Public Locations'],
        parameters: [
            new OA\Parameter(name: 'north', in: 'query', required: true, schema: new OA\Schema(type: 'number', format: 'float', example: 14.75)),
            new OA\Parameter(name: 'south', in: 'query', required: true, schema: new OA\Schema(type: 'number', format: 'float', example: 14.52)),
            new OA\Parameter(name: 'east', in: 'query', required: true, schema: new OA\Schema(type: 'number', format: 'float', example: 121.12)),
            new OA\Parameter(name: 'west', in: 'query', required: true, schema: new OA\Schema(type: 'number', format: 'float', example: 120.96)),
            new OA\Parameter(name: 'material_slug', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'List of active locations within map bounds'),
            new OA\Response(response: 422, description: 'Validation error')
        ]
    )]
    public function map(Request $request)
    {
        $validated = $request->validate([
            'north' => ['required', 'numeric', 'between:-90,90'],
            'south' => ['required', 'numeric', 'between:-90,90'],
            'east' => ['required', 'numeric', 'between:-180,180'],
            'west' => ['required', 'numeric', 'between:-180,180'],
            'material_slug' => ['nullable', 'string'],
        ]);

        $north = max((float) $validated['north'], (float) $validated['south']);
        $south = min((float) $validated['north'], (float) $validated['south']);
        $east = max((float) $validated['east'], (float) $validated['west']);
        $west = min((float) $validated['east'], (float) $validated['west']);

        $query = WasteCollectionLocation::query()
            ->where('is_active', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereBetween('latitude', [$south, $north])
            ->whereBetween('longitude', [$west, $east])
            ->with([
                'materialTypes:id,name,slug',
            ]);

        $query->when(
            $request->filled('material_slug'),
            fn ($q) => $q->whereHas(
                'materialTypes',
                fn ($subQ) => $subQ->where('slug', $request->string('material_slug')->toString())
            )
        );

        $locations = $query
            ->select([
                'id',
                'name',
                'latitude',
                'longitude',
            ])
            ->orderBy('name')
            ->get();

        return MapWasteCollectionLocationResource::collection($locations);
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