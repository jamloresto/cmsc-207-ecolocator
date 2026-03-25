<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateLocationSuggestionStatusRequest;
use App\Models\LocationSuggestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Admin Location Suggestions',
    description: 'Admin management for location suggestions'
)]
class LocationSuggestionController extends Controller
{
    #[OA\Get(
        path: '/api/v1/admin/location-suggestions',
        summary: 'List location suggestions',
        tags: ['Admin Location Suggestions'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(
                name: 'status',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['pending', 'reviewed', 'approved', 'rejected', 'archived'])
            )
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestions retrieved successfully'),
            new OA\Response(response: 401, description: 'Unauthorized'),
            new OA\Response(response: 403, description: 'Forbidden'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = LocationSuggestion::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->paginate(10));
    }

    #[OA\Get(
        path: '/api/v1/admin/location-suggestions/{id}',
        summary: 'Get location suggestion details',
        tags: ['Admin Location Suggestions'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion retrieved successfully'),
            new OA\Response(response: 404, description: 'Not found'),
        ]
    )]
    public function show(LocationSuggestion $locationSuggestion): JsonResponse
    {
        return response()->json([
            'data' => $locationSuggestion,
        ]);
    }

    #[OA\Patch(
        path: '/api/v1/admin/location-suggestions/{id}/status',
        summary: 'Update location suggestion status',
        tags: ['Admin Location Suggestions'],
        security: [['sanctum' => []]],
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
                required: ['status'],
                properties: [
                    new OA\Property(
                        property: 'status',
                        type: 'string',
                        enum: ['pending', 'reviewed', 'approved', 'rejected', 'archived'],
                        example: 'approved'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Status updated successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function updateStatus(
        UpdateLocationSuggestionStatusRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
        $data = [
            'status' => $request->status,
        ];

        if (in_array($request->status, ['reviewed', 'approved', 'rejected']) && $locationSuggestion->reviewed_at === null) {
            $data['reviewed_at'] = now();
        }

        $locationSuggestion->update($data);

        return response()->json([
            'message' => 'Location suggestion status updated successfully.',
            'data' => $locationSuggestion->fresh(),
        ]);
    }

    #[OA\Delete(
        path: '/api/v1/admin/location-suggestions/{id}',
        summary: 'Delete location suggestion',
        tags: ['Admin Location Suggestions'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: 'Deleted successfully'),
            new OA\Response(response: 404, description: 'Not found'),
        ]
    )]
    public function destroy(LocationSuggestion $locationSuggestion): JsonResponse
    {
        $locationSuggestion->delete();

        return response()->json([
            'message' => 'Location suggestion deleted successfully.',
        ]);
    }
}