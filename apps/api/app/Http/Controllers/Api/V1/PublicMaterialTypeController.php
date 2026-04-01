<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MaterialType;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class PublicMaterialTypeController extends Controller
{
    #[OA\Get(
        path: '/api/v1/material-types',
        summary: 'List all active material types',
        tags: ['Public Material Types'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material types retrieved successfully'
            )
        ]
    )]
    public function index(): JsonResponse
    {
        $materialTypes = MaterialType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['name', 'slug', 'description']);

        return response()->json([
            'success' => true,
            'message' => 'Material types retrieved successfully.',
            'data' => $materialTypes,
        ]);
    }

    #[OA\Get(
        path: '/api/v1/material-types/{id}',
        summary: 'Get a single active material type',
        tags: ['Public Material Types'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material type retrieved successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'Material type not found'
            )
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $materialType = MaterialType::query()
            ->where('is_active', true)
            ->find($id);

        if (!$materialType) {
            return response()->json([
                'success' => false,
                'message' => 'Material type not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Material type retrieved successfully.',
            'data' => $materialType,
        ]);
    }
}