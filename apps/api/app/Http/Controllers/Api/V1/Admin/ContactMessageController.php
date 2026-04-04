<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
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
            new OA\Response(response: 200, description: 'Contact messages retrieved successfully'),
            new OA\Response(response: 401, description: 'Unauthorized'),
            new OA\Response(response: 403, description: 'Forbidden'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $allowedSortFields = [
            'created_at',
            'updated_at',
            'status',
            'name',
            'email',
            'subject',
        ];

        $sortBy = in_array($request->get('sort_by'), $allowedSortFields, true)
            ? $request->get('sort_by')
            : 'created_at';

        $sortOrder = in_array(strtolower($request->get('sort_order')), ['asc', 'desc'], true)
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
            new OA\Response(response: 200, description: 'Contact message retrieved successfully'),
            new OA\Response(response: 404, description: 'Contact message not found'),
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
            'data' => $contactMessage,
        ]);
    }

    #[OA\Patch(
        path: '/api/v1/admin/contact-messages/{id}/archive',
        summary: 'Archive contact message',
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
            new OA\Response(response: 200, description: 'Contact message archived successfully'),
            new OA\Response(response: 404, description: 'Contact message not found'),
        ]
    )]
    public function archive(ContactMessage $contactMessage): JsonResponse
    {
        $data = [
            'status' => 'archived',
        ];

        if ($contactMessage->read_at === null) {
            $data['read_at'] = now();
        }

        $contactMessage->update($data);

        return response()->json([
            'message' => 'Contact message archived successfully.',
            'data' => $contactMessage->fresh(),
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/contact-messages/{id}/reply',
        summary: 'Reply to contact message',
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
                required: ['reply_message'],
                properties: [
                    new OA\Property(
                        property: 'reply_message',
                        type: 'string',
                        example: 'Thank you for your inquiry. We will get back to you shortly.'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Reply sent successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 404, description: 'Contact message not found'),
        ]
    )]
    public function reply(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        $validated = $request->validate([
            'reply_message' => ['required', 'string'],
        ]);

        // TODO:
        // Send email / notification here using $validated['reply_message']

        $data = [
            'status' => 'replied',
        ];

        if ($contactMessage->read_at === null) {
            $data['read_at'] = now();
        }

        if ($contactMessage->replied_at === null) {
            $data['replied_at'] = now();
        }

        $contactMessage->update($data);

        return response()->json([
            'message' => 'Reply sent successfully.',
            'data' => $contactMessage->fresh(),
        ]);
    }
}