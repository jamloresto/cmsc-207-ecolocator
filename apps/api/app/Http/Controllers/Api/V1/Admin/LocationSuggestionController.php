<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectLocationSuggestionRequest;
use App\Http\Requests\UpdateLocationSuggestionRequest;
use App\Models\LocationSuggestion;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
                schema: new OA\Schema(type: 'string', enum: ['pending', 'under_review', 'approved', 'rejected', 'archived'])
            ),
            new OA\Parameter(
                name: 'search',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'province',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'city_municipality',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string')
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

        if ($request->filled('province')) {
            $query->where('province', $request->string('province'));
        }

        if ($request->filled('city_municipality')) {
            $query->where('city_municipality', $request->string('city_municipality'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('location_name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
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
        path: '/api/v1/admin/location-suggestions/{id}',
        summary: 'Update location suggestion before approval',
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
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Juan Dela Cruz'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'juan@example.com'),
                    new OA\Property(property: 'contact_info', type: 'string', example: '09171234567'),
                    new OA\Property(property: 'location_name', type: 'string', example: 'Barangay Green Recycling Center'),
                    new OA\Property(property: 'address', type: 'string', example: '123 Mabini Street'),
                    new OA\Property(property: 'city_municipality', type: 'string', example: 'Pasay City'),
                    new OA\Property(property: 'province', type: 'string', example: 'Metro Manila'),
                    new OA\Property(property: 'postal_code', type: 'string', example: '1300'),
                    new OA\Property(property: 'latitude', type: 'number', format: 'float', example: 14.5378),
                    new OA\Property(property: 'longitude', type: 'number', format: 'float', example: 121.0014),
                    new OA\Property(property: 'materials_accepted', type: 'string', example: 'Plastic, paper, e-waste'),
                    new OA\Property(property: 'notes', type: 'string', example: 'Open every Saturday morning'),
                    new OA\Property(property: 'review_notes', type: 'string', example: 'Verified address and corrected location name'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion updated successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function update(
        UpdateLocationSuggestionRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
        if (in_array($locationSuggestion->status, ['approved', 'rejected'])) {
            return response()->json([
                'message' => 'This suggestion can no longer be edited.',
            ], 422);
        }

        $data = $request->validated();

        if ($locationSuggestion->status === 'pending') {
            $data['status'] = 'under_review';
        }

        if ($locationSuggestion->reviewed_at === null) {
            $data['reviewed_at'] = now();
        }

        $locationSuggestion->update($data);

        return response()->json([
            'message' => 'Location suggestion updated successfully.',
            'data' => $locationSuggestion->fresh(),
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/location-suggestions/{id}/approve',
        summary: 'Approve location suggestion',
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
            new OA\Response(response: 200, description: 'Location suggestion approved successfully'),
            new OA\Response(response: 422, description: 'Suggestion cannot be approved'),
        ]
    )]
    public function approve(Request $request, LocationSuggestion $locationSuggestion): JsonResponse
    {
        if ($locationSuggestion->status === 'approved') {
            return response()->json([
                'message' => 'Location suggestion is already approved.',
            ], 422);
        }

        if ($locationSuggestion->status === 'rejected') {
            return response()->json([
                'message' => 'Rejected suggestions cannot be approved.',
            ], 422);
        }

        $missingFields = [];

        if (blank($locationSuggestion->country_code)) {
            $missingFields[] = 'country_code';
        }

        if (blank($locationSuggestion->country_name)) {
            $missingFields[] = 'country_name';
        }

        if (blank($locationSuggestion->state_province)) {
            $missingFields[] = 'state_province';
        }

        if (blank($locationSuggestion->city_municipality)) {
            $missingFields[] = 'city_municipality';
        }

        if (blank($locationSuggestion->street_address) && blank($locationSuggestion->address)) {
            $missingFields[] = 'street_address';
        }

        if (! empty($missingFields)) {
            return response()->json([
                'message' => 'Location suggestion is missing required approval fields.',
                'missing_fields' => $missingFields,
            ], 422);
        }

        $locationSuggestion = DB::transaction(function () use ($request, $locationSuggestion) {
            $location = WasteCollectionLocation::create([
                'name' => $locationSuggestion->location_name,
                'country_code' => $locationSuggestion->country_code,
                'country_name' => $locationSuggestion->country_name,
                'state_province' => $locationSuggestion->state_province,
                'state_code' => $locationSuggestion->state_code,
                'city_municipality' => $locationSuggestion->city_municipality,
                'city_slug' => Str::slug($locationSuggestion->city_municipality),
                'region' => $locationSuggestion->region,
                'street_address' => $locationSuggestion->street_address ?? $locationSuggestion->address,
                'postal_code' => $locationSuggestion->postal_code,
                'latitude' => $locationSuggestion->latitude,
                'longitude' => $locationSuggestion->longitude,
                'contact_number' => $locationSuggestion->contact_number,
                'email' => $locationSuggestion->location_email,
                'operating_hours' => $locationSuggestion->operating_hours,
                'notes' => $locationSuggestion->notes,
                'is_active' => $locationSuggestion->is_active ?? true,
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            $locationSuggestion->update([
                'status' => 'approved',
                'reviewed_at' => $locationSuggestion->reviewed_at ?? now(),
                'approved_at' => now(),
                'approved_by' => $request->user()->id,
                'waste_collection_location_id' => $location->id,
            ]);

            return $locationSuggestion->fresh();
        });

        return response()->json([
            'message' => 'Location suggestion approved successfully.',
            'data' => $locationSuggestion,
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/location-suggestions/{id}/reject',
        summary: 'Reject location suggestion',
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
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'review_notes', type: 'string', example: 'Insufficient location details')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion rejected successfully'),
            new OA\Response(response: 422, description: 'Suggestion cannot be rejected'),
        ]
    )]
    public function reject(
        RejectLocationSuggestionRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
        if ($locationSuggestion->status === 'approved') {
            return response()->json([
                'message' => 'Approved suggestions cannot be rejected.',
            ], 422);
        }

        $locationSuggestion->update([
            'status' => 'rejected',
            'review_notes' => $request->validated('review_notes'),
            'reviewed_at' => $locationSuggestion->reviewed_at ?? now(),
            'rejected_at' => now(),
            'rejected_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Location suggestion rejected successfully.',
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
            new OA\Response(response: 200, description: 'Location suggestion deleted successfully'),
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