<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\LocationSuggestion;
use App\Models\MaterialType;
use App\Models\WasteCollectionLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
      path: '/api/v1/admin/dashboard/stats',
      summary: 'Get admin dashboard statistics',
      security: [['sanctum' => []]],
      tags: ['Admin Dashboard'],
      responses: [
          new OA\Response(
              response: 200,
              description: 'Dashboard statistics retrieved successfully',
              content: new OA\JsonContent(
                  properties: [
                      new OA\Property(
                          property: 'data',
                          properties: [
                              new OA\Property(property: 'recycling_centers_count', type: 'integer', example: 128),
                              new OA\Property(property: 'material_types_count', type: 'integer', example: 12),
                              new OA\Property(property: 'pending_location_suggestions_count', type: 'integer', example: 15),
                              new OA\Property(property: 'unread_contact_messages_count', type: 'integer', example: 6),
                              new OA\Property(property: 'contact_messages_this_month_count', type: 'integer', example: 42),
                          ],
                          type: 'object'
                      ),
                  ],
                  type: 'object'
              )
          ),
          new OA\Response(response: 401, description: 'Unauthenticated'),
          new OA\Response(response: 403, description: 'Forbidden'),
      ]
  )]
    public function stats(): JsonResponse
    {
        $startOfMonth = Carbon::now()->startOfMonth();

        return response()->json([
            'data' => [
                'recycling_centers_count' => WasteCollectionLocation::query()->count(),
                'material_types_count' => MaterialType::query()
                    ->where('is_active', true)
                    ->count(),
                'pending_location_suggestions_count' => LocationSuggestion::query()
                    ->where('status', 'pending')
                    ->count(),
                'unread_contact_messages_count' => ContactMessage::query()
                    ->where('status', 'new')
                    ->count(),
                'contact_messages_this_month_count' => ContactMessage::query()
                    ->where('created_at', '>=', $startOfMonth)
                    ->count(),
            ],
        ]);
    }
}