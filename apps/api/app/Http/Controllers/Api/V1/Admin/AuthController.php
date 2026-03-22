<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: '/api/v1/admin/login',
        summary: 'Admin login',
        tags: ['Admin Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@ecolocator.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Login successful',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Login successful.'),
                        new OA\Property(property: 'token', type: 'string', example: '1|abcdef123456'),
                        new OA\Property(property: 'token_type', type: 'string', example: 'Bearer'),
                        new OA\Property(
                            property: 'user',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'name', type: 'string', example: 'EcoLocator Super Admin'),
                                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@ecolocator.com'),
                                new OA\Property(property: 'role', type: 'string', example: 'super_admin'),
                                new OA\Property(property: 'is_active', type: 'boolean', example: true),
                            ],
                            type: 'object'
                        ),
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Invalid credentials'),
            new OA\Response(response: 403, description: 'Account not allowed to access admin panel'),
            new OA\Response(response: 422, description: 'Validation failed'),
        ]
    )]
    public function login(AdminLoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        if (!$user->hasAdminAccess() || !$user->is_active) {
            return response()->json([
                'message' => 'Your account is not allowed to access the admin panel.'
            ], 403);
        }

        $user->tokens()->delete();

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new AdminUserResource($user),
        ]);
    }

    #[OA\Get(
        path: '/api/v1/admin/me',
        summary: 'Get authenticated admin profile',
        security: [['bearerAuth' => []]],
        tags: ['Admin Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Authenticated admin profile',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'user',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'name', type: 'string', example: 'EcoLocator Super Admin'),
                                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@ecolocator.com'),
                                new OA\Property(property: 'role', type: 'string', example: 'super_admin'),
                                new OA\Property(property: 'is_active', type: 'boolean', example: true),
                            ],
                            type: 'object'
                        ),
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function me(Request $request)
    {
        return response()->json([
            'user' => new AdminUserResource($request->user()),
        ]);
    }

    #[OA\Post(
        path: '/api/v1/admin/logout',
        summary: 'Logout admin',
        security: [['bearerAuth' => []]],
        tags: ['Admin Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Logged out successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Logged out successfully.'),
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}