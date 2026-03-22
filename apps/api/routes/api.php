<?php

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\AuthController;
use App\Http\Controllers\Api\V1\Admin\WasteCollectionLocationController;
use App\Http\Controllers\Api\V1\PublicWasteCollectionLocationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function (): JsonResponse {
        return response()->json([
            'status' => 'ok',
            'service' => config('app.name'),
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    Route::get('/locations', [PublicWasteCollectionLocationController::class, 'index']);
    Route::get('/locations/{location}', [PublicWasteCollectionLocationController::class, 'show']);
    
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);

            Route::apiResource('locations', WasteCollectionLocationController::class);

            Route::middleware('role:super_admin')->group(function () {
                Route::apiResource('users', AdminUserController::class);
            });
        });
    });
});