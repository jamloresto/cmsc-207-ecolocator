<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Public Contact Messages',
    description: 'Public contact form submission endpoints'
)]
class PublicContactMessageController extends Controller
{
    #[OA\Post(
        path: '/api/v1/contact',
        summary: 'Submit contact form',
        tags: ['Public Contact Messages'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'subject', 'message'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Juan Dela Cruz'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'juan@example.com'),
                    new OA\Property(property: 'contact_info', type: 'string', example: '+639171234567'),
                    new OA\Property(property: 'subject', type: 'string', example: 'Inquiry about recycling center'),
                    new OA\Property(property: 'message', type: 'string', example: 'Hello, I would like to ask about the nearest e-waste drop-off center.'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Contact message submitted successfully'
            ),
            new OA\Response(
                response: 422,
                description: 'Validation error'
            )
        ]
    )]
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $contactMessage = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'contact_info' => $request->contact_info,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'new',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Contact message submitted successfully.',
            'data' => $contactMessage,
        ], 201);
    }
}