<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use App\Http\Resources\AdminUserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $credentials = $request->validated();

        if (! Auth::guard('web')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $request->session()->regenerate();

        /** @var \App\Models\User|null $user */
$user = Auth::guard('web')->user();

        if (! $user || ! $user->hasAdminAccess() || ! $user->is_active) {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Your account is not allowed to access the admin panel.',
            ], 403);
        }

        return response()->json([
            'message' => 'Login successful.',
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
        security: [['sanctum' => []]],
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
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}