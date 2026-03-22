<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_active) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden.'
            ], 403);
        }

        return $next($request);
    }
}