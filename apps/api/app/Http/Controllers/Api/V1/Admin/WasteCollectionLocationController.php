<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWasteCollectionLocationRequest;
use App\Http\Requests\UpdateWasteCollectionLocationRequest;
use App\Http\Resources\WasteCollectionLocationResource;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class WasteCollectionLocationController extends Controller
{
    #[OA\Get(
        path: '/api/v1/admin/locations',
        summary: 'List waste collection locations for admin',
        security: [['bearerAuth' => []]],
        tags: ['Admin Locations'],
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
            new OA\Response(response: 200, description: 'Paginated list of locations'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
        ]
    )]
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

    #[OA\Post(
        path: '/api/v1/admin/locations',
        summary: 'Create waste collection location',
        security: [['bearerAuth' => []]],
        tags: ['Admin Locations'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: [
                    'name',
                    'country_code',
                    'country_name',
                    'state_province',
                    'city_municipality',
                    'street_address',
                    'latitude',
                    'longitude'
                ],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Barangay Recycling Center'),
                    new OA\Property(property: 'country_code', type: 'string', example: 'PH'),
                    new OA\Property(property: 'country_name', type: 'string', example: 'Philippines'),
                    new OA\Property(property: 'state_province', type: 'string', example: 'Davao del Sur'),
                    new OA\Property(property: 'state_code', type: 'string', example: 'DVO'),
                    new OA\Property(property: 'city_municipality', type: 'string', example: 'Davao City'),
                    new OA\Property(property: 'region', type: 'string', example: 'Region XI'),
                    new OA\Property(property: 'street_address', type: 'string', example: '123 Recycling St.'),
                    new OA\Property(property: 'postal_code', type: 'string', example: '8000'),
                    new OA\Property(property: 'latitude', type: 'number', format: 'float', example: 7.0707),
                    new OA\Property(property: 'longitude', type: 'number', format: 'float', example: 125.6087),
                    new OA\Property(property: 'contact_number', type: 'string', example: '09171234567'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'center@example.com'),
                    new OA\Property(property: 'operating_hours', type: 'string', example: 'Mon-Fri 8AM-5PM'),
                    new OA\Property(property: 'notes', type: 'string', example: 'Walk-in accepted'),
                    new OA\Property(property: 'is_active', type: 'boolean', example: true),
                    new OA\Property(
                        property: 'material_type_ids',
                        type: 'array',
                        items: new OA\Items(type: 'integer'),
                        example: [1, 2, 5]
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Location created'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 422, description: 'Validation failed'),
        ]
    )]
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

    #[OA\Get(
        path: '/api/v1/admin/locations/{location}',
        summary: 'Get one waste collection location',
        security: [['bearerAuth' => []]],
        tags: ['Admin Locations'],
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
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Location not found'),
        ]
    )]
    public function show(WasteCollectionLocation $location)
    {
        $location->load('materialTypes');

        return new WasteCollectionLocationResource($location);
    }

    #[OA\Put(
        path: '/api/v1/admin/locations/{location}',
        summary: 'Update waste collection location',
        security: [['bearerAuth' => []]],
        tags: ['Admin Locations'],
        parameters: [
            new OA\Parameter(
                name: 'location',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Updated Recycling Center'),
                    new OA\Property(property: 'country_code', type: 'string', example: 'PH'),
                    new OA\Property(property: 'country_name', type: 'string', example: 'Philippines'),
                    new OA\Property(property: 'state_province', type: 'string', example: 'Davao del Sur'),
                    new OA\Property(property: 'state_code', type: 'string', example: 'DVO'),
                    new OA\Property(property: 'city_municipality', type: 'string', example: 'Davao City'),
                    new OA\Property(property: 'region', type: 'string', example: 'Region XI'),
                    new OA\Property(property: 'street_address', type: 'string', example: '456 Updated St.'),
                    new OA\Property(property: 'postal_code', type: 'string', example: '8000'),
                    new OA\Property(property: 'latitude', type: 'number', format: 'float', example: 7.0811),
                    new OA\Property(property: 'longitude', type: 'number', format: 'float', example: 125.6011),
                    new OA\Property(property: 'contact_number', type: 'string', example: '09179999999'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'updated@example.com'),
                    new OA\Property(property: 'operating_hours', type: 'string', example: 'Mon-Sat 8AM-6PM'),
                    new OA\Property(property: 'notes', type: 'string', example: 'Updated notes'),
                    new OA\Property(property: 'is_active', type: 'boolean', example: true),
                    new OA\Property(
                        property: 'material_type_ids',
                        type: 'array',
                        items: new OA\Items(type: 'integer'),
                        example: [1, 3]
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Location updated'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Location not found'),
            new OA\Response(response: 422, description: 'Validation failed'),
        ]
    )]
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

    #[OA\Delete(
        path: '/api/v1/admin/locations/{location}',
        summary: 'Delete waste collection location',
        security: [['bearerAuth' => []]],
        tags: ['Admin Locations'],
        parameters: [
            new OA\Parameter(
                name: 'location',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Location deleted',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Location deleted successfully.'),
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Location not found'),
        ]
    )]
    public function destroy(WasteCollectionLocation $location)
    {
        $location->delete();

        return response()->json([
            'message' => 'Location deleted successfully.',
        ]);
    }
}