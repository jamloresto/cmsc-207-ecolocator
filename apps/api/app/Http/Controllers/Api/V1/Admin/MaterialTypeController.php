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
        path: '/api/v1/admin/material-types/{id}',
        summary: 'Update a material type',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            )
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
    public function update(Request $request, int $id): JsonResponse
    {
        $materialType = MaterialType::find($id);

        if (!$materialType) {
            return response()->json([
                'success' => false,
                'message' => 'Material type not found.',
            ], 404);
        }

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

    #[OA\Delete(
        path: '/api/v1/admin/material-types/{id}',
        summary: 'Delete a material type',
        tags: ['Admin Material Types'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: 'Material type deleted successfully'),
            new OA\Response(response: 404, description: 'Material type not found'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function destroy(int $id): JsonResponse
    {
        $materialType = MaterialType::find($id);

        if (!$materialType) {
            return response()->json([
                'success' => false,
                'message' => 'Material type not found.',
            ], 404);
        }

        $materialType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Material type deleted successfully.',
        ]);
    }
}