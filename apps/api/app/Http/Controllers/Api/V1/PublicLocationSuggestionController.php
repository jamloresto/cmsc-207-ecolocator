<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocationSuggestionRequest;
use App\Models\LocationSuggestion;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Public Location Suggestions',
    description: 'Public endpoints for suggesting new waste collection locations'
)]
class PublicLocationSuggestionController extends Controller
{
    #[OA\Post(
        path: '/api/v1/location-suggestions',
        summary: 'Submit a new location suggestion',
        tags: ['Public Location Suggestions'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'location_name', 'address', 'city_municipality', 'province'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Juan Dela Cruz'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'juan@example.com'),
                    new OA\Property(property: 'contact_info', type: 'string', example: '09123456789'),
                    new OA\Property(property: 'location_name', type: 'string', example: 'Barangay Green Recycling Center'),
                    new OA\Property(property: 'address', type: 'string', example: '123 Mabini Street, Barangay San Isidro'),
                    new OA\Property(property: 'city_municipality', type: 'string', example: 'Pasay City'),
                    new OA\Property(property: 'province', type: 'string', example: 'Metro Manila'),
                    new OA\Property(property: 'postal_code', type: 'string', example: '1300'),
                    new OA\Property(property: 'latitude', type: 'number', format: 'float', example: 14.5378),
                    new OA\Property(property: 'longitude', type: 'number', format: 'float', example: 121.0014),
                    new OA\Property(property: 'materials_accepted', type: 'string', example: 'Plastic, paper, e-waste'),
                    new OA\Property(property: 'notes', type: 'string', example: 'Open every Saturday morning.')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Location suggestion submitted successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function store(StoreLocationSuggestionRequest $request): JsonResponse
    {
        $suggestion = LocationSuggestion::create([
            'name' => $request->name,
            'email' => $request->email,
            'contact_info' => $request->contact_info,
            'location_name' => $request->location_name,
            'address' => $request->address,
            'city_municipality' => $request->city_municipality,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'materials_accepted' => $request->materials_accepted,
            'notes' => $request->notes,
            'status' => 'pending',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Location suggestion submitted successfully.',
            'data' => $suggestion,
        ], 201);
    }
}