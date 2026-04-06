<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaterialType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class MaterialTypeController extends Controller
{
    #[OA\Get(
        path: '/api/v1/admin/material-types',
        summary: 'List material types',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'search',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string'),
                description: 'Search by name or description'
            ),
            new OA\Parameter(
                name: 'is_active',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'boolean'),
                description: 'Filter by active status'
            ),
            new OA\Parameter(
                name: 'sort',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['name', 'created_at', 'updated_at']),
                description: 'Sort field'
            ),
            new OA\Parameter(
                name: 'direction',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['asc', 'desc']),
                description: 'Sort direction'
            ),
            new OA\Parameter(
                name: 'per_page',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', example: 10),
                description: 'Items per page'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Material types fetched successfully'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'sort' => ['nullable', Rule::in(['name', 'created_at', 'updated_at'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = MaterialType::query();

        if (!empty($validated['search'])) {
            $search = trim($validated['search']);

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (array_key_exists('is_active', $validated)) {
            $query->where('is_active', $validated['is_active']);
        }

        $sort = $validated['sort'] ?? 'name';
        $direction = $validated['direction'] ?? 'asc';
        $perPage = $validated['per_page'] ?? 10;

        $materialTypes = $query
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'success' => true,
            'message' => 'Material types fetched successfully.',
            'data' => [
                'data' => $materialTypes->items(),
                'links' => [
                    'first' => $materialTypes->url(1),
                    'last' => $materialTypes->url($materialTypes->lastPage()),
                    'prev' => $materialTypes->previousPageUrl(),
                    'next' => $materialTypes->nextPageUrl(),
                ],
                'meta' => [
                    'current_page' => $materialTypes->currentPage(),
                    'from' => $materialTypes->firstItem(),
                    'last_page' => $materialTypes->lastPage(),
                    'path' => $materialTypes->path(),
                    'per_page' => $materialTypes->perPage(),
                    'to' => $materialTypes->lastItem(),
                    'total' => $materialTypes->total(),
                ],
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/v1/admin/material-types/all',
        summary: 'Get all active material types (id, name, slug only)',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Material types fetched successfully'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function all(): JsonResponse
    {
        $materialTypes = MaterialType::query()
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get([
                'id',
                'name',
                'slug',
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Active material types fetched successfully.',
            'data' => $materialTypes,
        ]);
    }

    #[OA\Get(
        path: '/api/v1/admin/material-types/{materialType}',
        summary: 'Get a material type',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'materialType',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Material type fetched successfully'),
            new OA\Response(response: 404, description: 'Material type not found'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function show(MaterialType $materialType): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Material type fetched successfully.',
            'data' => $materialType,
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/material-types',
        summary: 'Create a material type',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Plastic'),
                    new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Plastic bottles and containers'),
                    new OA\Property(property: 'is_active', type: 'boolean', example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Material type created successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:material_types,name'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $materialType = MaterialType::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Material type created successfully.',
            'data' => $materialType,
        ], 201);
    }

    #[OA\Put(
        path: '/api/v1/admin/material-types/{materialType}',
        summary: 'Update a material type',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'materialType',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Plastic'),
                    new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Updated description'),
                    new OA\Property(property: 'is_active', type: 'boolean', example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Material type updated successfully'),
            new OA\Response(response: 404, description: 'Material type not found'),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function update(Request $request, MaterialType $materialType): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('material_types', 'name')->ignore($materialType->id),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $materialType->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? $materialType->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Material type updated successfully.',
            'data' => $materialType->fresh(),
        ]);
    }

    #[OA\Patch(
        path: '/api/v1/admin/material-types/{materialType}/status',
        summary: 'Update material type status',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'materialType',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['is_active'],
                properties: [
                    new OA\Property(property: 'is_active', type: 'boolean', example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Material type status updated successfully'),
            new OA\Response(response: 404, description: 'Material type not found'),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function updateStatus(Request $request, MaterialType $materialType): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $materialType->update([
            'is_active' => $validated['is_active'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Material type status updated successfully.',
            'data' => $materialType->fresh(),
        ]);
    }
}