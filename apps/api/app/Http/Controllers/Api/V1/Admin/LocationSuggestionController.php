<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApproveLocationSuggestionRequest;
use App\Http\Requests\RejectLocationSuggestionRequest;
use App\Http\Requests\UpdateLocationSuggestionRequest;
use App\Http\Resources\AdminLocationSuggestionResource;
use App\Models\LocationSuggestion;
use App\Models\MaterialType;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
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
            ),
            new OA\Parameter(
                name: 'sort_by',
                in: 'query',
                required: false,
                schema: new OA\Schema(
                    type: 'string',
                    enum: ['created_at', 'updated_at', 'status', 'location_name', 'city_municipality', 'province']
                ),
                example: 'created_at'
            ),
            new OA\Parameter(
                name: 'sort_order',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['asc', 'desc']),
                example: 'desc'
            ),
            new OA\Parameter(
                name: 'per_page',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', minimum: 1, maximum: 100),
                example: 10
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestions retrieved successfully'),
            new OA\Response(response: 401, description: 'Unauthorized'),
            new OA\Response(response: 403, description: 'Forbidden'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = LocationSuggestion::query();

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

        $allowedSortFields = [
            'created_at',
            'updated_at',
            'status',
            'location_name',
            'city_municipality',
            'province',
        ];

        $sortBy = in_array($request->get('sort_by'), $allowedSortFields, true)
            ? $request->get('sort_by')
            : 'created_at';

        $sortOrder = in_array(strtolower($request->get('sort_order', 'desc')), ['asc', 'desc'], true)
            ? strtolower($request->get('sort_order', 'desc'))
            : 'desc';

        $query->orderBy($sortBy, $sortOrder);

        $suggestions = $query->paginate($request->integer('per_page', 10));

        return AdminLocationSuggestionResource::collection($suggestions)->response();
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
    public function approve(
        ApproveLocationSuggestionRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
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

        if ($locationSuggestion->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending suggestions can be approved.',
            ], 422);
        }

        $data = $locationSuggestion->only([
            'location_name',
            'country_code',
            'country_name',
            'state_province',
            'state_code',
            'city_municipality',
            'region',
            'street_address',
            'postal_code',
            'latitude',
            'longitude',
            'contact_number',
            'location_email',
            'operating_hours',
            'notes',
            'is_active',
        ]);

        $validator = Validator::make($data, [
            'location_name' => ['required', 'string', 'max:255'],
            'country_code' => ['required', 'string', 'size:2'],
            'country_name' => ['required', 'string', 'max:100'],
            'state_province' => ['required', 'string', 'max:100'],
            'state_code' => ['nullable', 'string', 'max:20'],
            'city_municipality' => ['required', 'string', 'max:100'],
            'region' => ['nullable', 'string', 'max:100'],
            'street_address' => ['required', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'location_email' => ['nullable', 'email', 'max:255'],
            'operating_hours' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'location_name.required' => 'Location name is required before approval.',
            'country_code.required' => 'Country code is required before approval.',
            'country_code.size' => 'Country code must be exactly 2 characters.',
            'country_name.required' => 'Country name is required before approval.',
            'state_province.required' => 'State/Province is required before approval.',
            'city_municipality.required' => 'City/Municipality is required before approval.',
            'street_address.required' => 'Street address is required before approval.',
            'latitude.required' => 'Latitude is required before approval.',
            'longitude.required' => 'Longitude is required before approval.',
            'latitude.between' => 'Latitude must be between -90 and 90.',
            'longitude.between' => 'Longitude must be between -180 and 180.',
            'location_email.email' => 'Location email must be a valid email address.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        DB::transaction(function () use ($locationSuggestion, $user) {
            $materials = $this->parseMaterialsAccepted($locationSuggestion->materials_accepted);
            $materialTypeIds = $this->resolveMaterialTypeIds($materials);

            $uniqueMaterialSlugs = collect($materials)
                ->map(fn ($item) => Str::slug($item))
                ->unique()
                ->values()
                ->all();

            if (count($uniqueMaterialSlugs) !== count($materialTypeIds)) {
                abort(response()->json([
                    'message' => 'Some suggested materials do not match official material types. Please review before approval.',
                ], 422));
            }

            $location = WasteCollectionLocation::create([
                'name' => $locationSuggestion->location_name,
                'country_code' => $locationSuggestion->country_code,
                'country_name' => $locationSuggestion->country_name,
                'state_province' => $locationSuggestion->state_province,
                'state_code' => $locationSuggestion->state_code,
                'city_municipality' => $locationSuggestion->city_municipality,
                'region' => $locationSuggestion->region,
                'street_address' => $locationSuggestion->street_address,
                'postal_code' => $locationSuggestion->postal_code,
                'latitude' => $locationSuggestion->latitude,
                'longitude' => $locationSuggestion->longitude,
                'contact_number' => $locationSuggestion->contact_number,
                'email' => $locationSuggestion->location_email,
                'operating_hours' => $locationSuggestion->operating_hours,
                'notes' => $locationSuggestion->notes,
                'is_active' => $locationSuggestion->is_active ?? true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);

            $location->materialTypes()->sync($materialTypeIds);

            $locationSuggestion->update([
                'status' => 'approved',
                'approved_by' => $user->id,
                'approved_at' => now(),
                'reviewed_at' => now(),
                'waste_collection_location_id' => $location->id,
            ]);
        });

        $locationSuggestion->refresh();

        return response()->json([
            'message' => 'Location suggestion approved successfully.',
            'data' => [
                'id' => $locationSuggestion->id,
                'status' => $locationSuggestion->status,
            ],
        ]);
    }

    private function parseMaterialsAccepted(mixed $materialsAccepted): array
    {
        if (is_array($materialsAccepted)) {
            return collect($materialsAccepted)
                ->map(fn ($item) => trim((string) $item))
                ->filter()
                ->values()
                ->all();
        }

        if (is_string($materialsAccepted)) {
            $decoded = json_decode($materialsAccepted, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return collect($decoded)
                    ->map(fn ($item) => trim((string) $item))
                    ->filter()
                    ->values()
                    ->all();
            }

            return collect(explode(',', $materialsAccepted))
                ->map(fn ($item) => trim((string) $item))
                ->filter()
                ->values()
                ->all();
        }

        return [];
    }

    private function resolveMaterialTypeIds(array $materials): array
    {
        if (empty($materials)) {
            return [];
        }

        $slugs = collect($materials)
            ->map(fn ($item) => Str::slug($item))
            ->filter()
            ->values()
            ->all();

        return MaterialType::query()
            ->whereIn('slug', $slugs)
            ->pluck('id')
            ->all();
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