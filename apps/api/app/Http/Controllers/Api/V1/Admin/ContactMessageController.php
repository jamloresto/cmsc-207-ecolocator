<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateContactMessageStatusRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Admin Contact Messages',
    description: 'Admin management for contact messages'
)]
class ContactMessageController extends Controller
{
    #[OA\Get(
        path: '/api/v1/admin/contact-messages',
        summary: 'List contact messages',
        tags: ['Admin Contact Messages'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(
                name: 'status',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['new', 'read', 'replied', 'archived'])
            ),
            new OA\Parameter(
                name: 'search',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string'),
                example: 'juan'
            ),
            new OA\Parameter(
                name: 'date_from',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', format: 'date'),
                example: '2026-03-01'
            ),
            new OA\Parameter(
                name: 'date_to',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', format: 'date'),
                example: '2026-03-31'
            ),
            new OA\Parameter(
                name: 'sort_by',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string'),
                example: 'created_at'
            ),
            new OA\Parameter(
                name: 'sort_order',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['asc', 'desc']),
                example: 'desc'
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Contact messages retrieved successfully'
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthorized'
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden'
            )
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        // SEARCH (name, email, subject)
        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        // FILTER BY STATUS
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // DATE RANGE
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // SORTING
        $allowedSortFields = [
            'created_at',
            'updated_at',
            'status',
            'name',
            'email',
            'subject',
        ];

        $sortBy = in_array($request->get('sort_by'), $allowedSortFields)
            ? $request->get('sort_by')
            : 'created_at';

        $sortOrder = in_array(strtolower($request->get('sort_order')), ['asc', 'desc'])
            ? strtolower($request->get('sort_order'))
            : 'desc';

        $messages = $query
            ->orderBy($sortBy, $sortOrder)
            ->paginate($request->integer('per_page', 10));

        return response()->json($messages);
    }

    #[OA\Get(
        path: '/api/v1/admin/contact-messages/{id}',
        summary: 'Get contact message details',
        tags: ['Admin Contact Messages'],
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
            new OA\Response(
                response: 200,
                description: 'Contact message retrieved successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'Contact message not found'
            )
        ]
    )]
    public function show(ContactMessage $contactMessage): JsonResponse
    {
        if ($contactMessage->read_at === null) {
            $contactMessage->update([
                'read_at' => now(),
                'status' => $contactMessage->status === 'new' ? 'read' : $contactMessage->status,
            ]);
        }

        return response()->json([
            'data' => $contactMessage->fresh(),
        ]);
    }

    #[OA\Patch(
        path: '/api/v1/admin/contact-messages/{id}/status',
        summary: 'Update contact message status',
        tags: ['Admin Contact Messages'],
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
                        enum: ['new', 'read', 'replied', 'archived'],
                        example: 'replied'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Contact message status updated successfully'
            ),
            new OA\Response(
                response: 422,
                description: 'Validation error'
            ),
            new OA\Response(
                response: 404,
                description: 'Contact message not found'
            )
        ]
    )]
    public function updateStatus(
        UpdateContactMessageStatusRequest $request,
        ContactMessage $contactMessage
    ): JsonResponse {
        $status = $request->status;

        $data = [
            'status' => $status,
        ];

        if ($status === 'read' && $contactMessage->read_at === null) {
            $data['read_at'] = now();
        }

        if ($status === 'replied' && $contactMessage->replied_at === null) {
            $data['replied_at'] = now();
        }

        $contactMessage->update($data);

        return response()->json([
            'message' => 'Contact message status updated successfully.',
            'data' => $contactMessage->fresh(),
        ]);
    }

    #[OA\Delete(
        path: '/api/v1/admin/contact-messages/{id}',
        summary: 'Delete contact message',
        tags: ['Admin Contact Messages'],
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
            new OA\Response(
                response: 200,
                description: 'Contact message deleted successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'Contact message not found'
            )
        ]
    )]
    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Contact message deleted successfully.',
        ]);
    }
}