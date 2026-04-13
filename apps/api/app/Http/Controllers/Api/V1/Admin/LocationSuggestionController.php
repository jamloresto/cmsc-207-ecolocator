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
use Illuminate\Validation\Rule;
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
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'status',
                in: 'query',
                required: false,
                schema: new OA\Schema(
                    type: 'string',
                    enum: ['pending', 'under_review', 'approved', 'rejected', 'archived']
                ),
                description: 'Filter by suggestion status'
            ),
            new OA\Parameter(
                name: 'search',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string'),
                description: 'Search by location name, address, submitter name, or submitter email'
            ),
            new OA\Parameter(
                name: 'province',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string'),
                description: 'Filter by province'
            ),
            new OA\Parameter(
                name: 'city_municipality',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string'),
                description: 'Filter by city or municipality'
            ),
            new OA\Parameter(
                name: 'sort_by',
                in: 'query',
                required: false,
                schema: new OA\Schema(
                    type: 'string',
                    enum: ['created_at', 'updated_at', 'status', 'location_name', 'city_municipality', 'province']
                ),
                description: 'Sort field'
            ),
            new OA\Parameter(
                name: 'sort_order',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['asc', 'desc']),
                description: 'Sort order'
            ),
            new OA\Parameter(
                name: 'per_page',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', minimum: 1, maximum: 100, example: 10),
                description: 'Items per page'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestions fetched successfully'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'under_review', 'approved', 'rejected', 'archived'])],
            'search' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:100'],
            'city_municipality' => ['nullable', 'string', 'max:100'],
            'sort_by' => ['nullable', Rule::in([
                'created_at',
                'updated_at',
                'status',
                'location_name',
                'city_municipality',
                'province',
            ])],
            'sort_order' => ['nullable', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = LocationSuggestion::query();

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['province'])) {
            $query->where('province', $validated['province']);
        }

        if (!empty($validated['city_municipality'])) {
            $query->where('city_municipality', $validated['city_municipality']);
        }

        if (!empty($validated['search'])) {
            $search = trim($validated['search']);

            $query->where(function ($q) use ($search) {
                $q->where('location_name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('street_address', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 5;

        $suggestions = $query
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'success' => true,
            'message' => 'Location suggestions fetched successfully.',
            'data' => [
                'data' => AdminLocationSuggestionResource::collection($suggestions->getCollection()),
                'links' => [
                    'first' => $suggestions->url(1),
                    'last' => $suggestions->url($suggestions->lastPage()),
                    'prev' => $suggestions->previousPageUrl(),
                    'next' => $suggestions->nextPageUrl(),
                ],
                'meta' => [
                    'current_page' => $suggestions->currentPage(),
                    'from' => $suggestions->firstItem(),
                    'last_page' => $suggestions->lastPage(),
                    'path' => $suggestions->path(),
                    'per_page' => $suggestions->perPage(),
                    'to' => $suggestions->lastItem(),
                    'total' => $suggestions->total(),
                ],
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/v1/admin/location-suggestions/{locationSuggestion}',
        summary: 'Get a location suggestion',
        tags: ['Admin Location Suggestions'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'locationSuggestion',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion fetched successfully'),
            new OA\Response(response: 404, description: 'Location suggestion not found'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function show(LocationSuggestion $locationSuggestion): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Location suggestion fetched successfully.',
            'data' => new AdminLocationSuggestionResource($locationSuggestion),
        ]);
    }

    #[OA\Patch(
        path: '/api/v1/admin/location-suggestions/{locationSuggestion}',
        summary: 'Save draft changes to a location suggestion',
        tags: ['Admin Location Suggestions'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'locationSuggestion',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', nullable: true, example: 'Juan Dela Cruz'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', nullable: true, example: 'juan@example.com'),
                    new OA\Property(property: 'contact_info', type: 'string', nullable: true, example: '09171234567'),
                    new OA\Property(property: 'location_name', type: 'string', nullable: true, example: 'Barangay Green Recycling Center'),
                    new OA\Property(property: 'country_code', type: 'string', nullable: true, example: 'PH'),
                    new OA\Property(property: 'country_name', type: 'string', nullable: true, example: 'Philippines'),
                    new OA\Property(property: 'state_province', type: 'string', nullable: true, example: 'Metro Manila'),
                    new OA\Property(property: 'state_code', type: 'string', nullable: true, example: 'NCR'),
                    new OA\Property(property: 'city_municipality', type: 'string', nullable: true, example: 'Pasay City'),
                    new OA\Property(property: 'region', type: 'string', nullable: true, example: 'National Capital Region'),
                    new OA\Property(property: 'address', type: 'string', nullable: true, example: '123 Mabini Street'),
                    new OA\Property(property: 'street_address', type: 'string', nullable: true, example: '123 Mabini Street'),
                    new OA\Property(property: 'postal_code', type: 'string', nullable: true, example: '1300'),
                    new OA\Property(property: 'latitude', type: 'number', format: 'float', nullable: true, example: 14.5378),
                    new OA\Property(property: 'longitude', type: 'number', format: 'float', nullable: true, example: 121.0014),
                    new OA\Property(
                        property: 'materials_accepted',
                        oneOf: [
                            new OA\Schema(type: 'string', example: 'Plastic, Paper, Glass'),
                            new OA\Schema(
                                type: 'array',
                                items: new OA\Items(type: 'string'),
                                example: ['Plastic', 'Paper', 'Glass']
                            ),
                        ]
                    ),
                    new OA\Property(property: 'contact_number', type: 'string', nullable: true, example: '09171234567'),
                    new OA\Property(property: 'location_email', type: 'string', format: 'email', nullable: true, example: 'center@example.com'),
                    new OA\Property(property: 'operating_hours', type: 'string', nullable: true, example: 'Mon-Sat, 8:00 AM - 5:00 PM'),
                    new OA\Property(property: 'notes', type: 'string', nullable: true, example: 'Open every Saturday morning'),
                    new OA\Property(property: 'review_notes', type: 'string', nullable: true, example: 'Verified address and corrected location name'),
                    new OA\Property(property: 'is_active', type: 'boolean', nullable: true, example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion draft saved successfully'),
            new OA\Response(response: 422, description: 'Validation error or suggestion can no longer be edited'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function update(
        UpdateLocationSuggestionRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
        if ($this->isLockedSuggestion($locationSuggestion)) {
            return response()->json([
                'success' => false,
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
            'success' => true,
            'message' => 'Location suggestion draft saved successfully.',
            'data' => new AdminLocationSuggestionResource($locationSuggestion->fresh()),
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/location-suggestions/{locationSuggestion}/approve',
        summary: 'Approve a location suggestion and create a waste collection location',
        tags: ['Admin Location Suggestions'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'locationSuggestion',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion approved successfully'),
            new OA\Response(response: 422, description: 'Suggestion cannot be approved'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function approve(
        ApproveLocationSuggestionRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
        $statusError = $this->validateApprovableStatus($locationSuggestion);

        if ($statusError !== null) {
            return $statusError;
        }

        $payload = $this->extractApprovalPayload($locationSuggestion);

        $validator = Validator::make(
            $payload,
            $this->approvalRules(),
            $this->approvalMessages()
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $materials = $this->parseMaterialsAccepted($locationSuggestion->materials_accepted);
        $materialTypeIds = $this->resolveMaterialTypeIds($materials);

        if (!$this->allMaterialsResolved($materials, $materialTypeIds)) {
            return response()->json([
                'success' => false,
                'message' => 'Some suggested materials do not match official material types. Please review before approval.',
            ], 422);
        }

        $user = $request->user();

        DB::transaction(function () use ($locationSuggestion, $user, $materialTypeIds) {
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
            'success' => true,
            'message' => 'Location suggestion approved successfully.',
            'data' => [
                'id' => $locationSuggestion->id,
                'status' => $locationSuggestion->status,
                'waste_collection_location_id' => $locationSuggestion->waste_collection_location_id,
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/location-suggestions/{locationSuggestion}/reject',
        summary: 'Reject a location suggestion',
        tags: ['Admin Location Suggestions'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'locationSuggestion',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(
                        property: 'review_notes',
                        type: 'string',
                        nullable: true,
                        example: 'Insufficient location details'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion rejected successfully'),
            new OA\Response(response: 422, description: 'Suggestion cannot be rejected'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function reject(
        RejectLocationSuggestionRequest $request,
        LocationSuggestion $locationSuggestion
    ): JsonResponse {
        if ($locationSuggestion->status === 'approved') {
            return response()->json([
                'success' => false,
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
            'success' => true,
            'message' => 'Location suggestion rejected successfully.',
            'data' => new AdminLocationSuggestionResource($locationSuggestion->fresh()),
        ]);
    }

    #[OA\Delete(
        path: '/api/v1/admin/location-suggestions/{locationSuggestion}',
        summary: 'Delete a location suggestion',
        tags: ['Admin Location Suggestions'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'locationSuggestion',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Location suggestion deleted successfully'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function destroy(LocationSuggestion $locationSuggestion): JsonResponse
    {
        $locationSuggestion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Location suggestion deleted successfully.',
        ]);
    }

    private function isLockedSuggestion(LocationSuggestion $locationSuggestion): bool
    {
        return in_array($locationSuggestion->status, ['approved', 'rejected'], true);
    }

    private function validateApprovableStatus(LocationSuggestion $locationSuggestion): ?JsonResponse
    {
        if ($locationSuggestion->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Location suggestion is already approved.',
            ], 422);
        }

        if ($locationSuggestion->status === 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'Rejected suggestions cannot be approved.',
            ], 422);
        }

        if (!in_array($locationSuggestion->status, ['pending', 'under_review'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending or under review suggestions can be approved.',
            ], 422);
        }

        return null;
    }

    private function extractApprovalPayload(LocationSuggestion $locationSuggestion): array
    {
        return $locationSuggestion->only([
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
    }

    private function approvalRules(): array
    {
        return [
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
        ];
    }

    private function approvalMessages(): array
    {
        return [
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
        ];
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
            ->unique()
            ->values()
            ->all();

        return MaterialType::query()
            ->whereIn('slug', $slugs)
            ->pluck('id')
            ->all();
    }

    private function allMaterialsResolved(array $materials, array $materialTypeIds): bool
    {
        $uniqueMaterialSlugs = collect($materials)
            ->map(fn ($item) => Str::slug($item))
            ->filter()
            ->unique()
            ->values()
            ->all();

        return count($uniqueMaterialSlugs) === count($materialTypeIds);
    }
}