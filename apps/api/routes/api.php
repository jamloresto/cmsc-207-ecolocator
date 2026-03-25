<?php

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\AuthController;
use App\Http\Controllers\Api\V1\Admin\ContactMessageController;
use App\Http\Controllers\Api\V1\Admin\MaterialTypeController;
use App\Http\Controllers\Api\V1\Admin\WasteCollectionLocationController;
use App\Http\Controllers\Api\V1\PublicContactMessageController;
use App\Http\Controllers\Api\V1\PublicMaterialTypeController;
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
    Route::get('/material-types', [PublicMaterialTypeController::class, 'index']);
    Route::get('/material-types/{id}', [PublicMaterialTypeController::class, 'show']);
    Route::post('/contact', [PublicContactMessageController::class, 'store']);
    
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);

            Route::apiResource('locations', WasteCollectionLocationController::class);

            Route::post('/material-types', [MaterialTypeController::class, 'store']);
            Route::put('/material-types/{id}', [MaterialTypeController::class, 'update']);
            Route::delete('/material-types/{id}', [MaterialTypeController::class, 'destroy']);

            Route::get('/contact-messages', [ContactMessageController::class, 'index']);
            Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
            Route::patch('/contact-messages/{contactMessage}/status', [ContactMessageController::class, 'updateStatus']);
            Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);
        

            Route::middleware('role:super_admin')->group(function () {
                Route::apiResource('users', AdminUserController::class);
            });
        });
    });
});