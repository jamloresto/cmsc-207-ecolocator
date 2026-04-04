<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\AuthController;
use App\Http\Controllers\Api\V1\Admin\ContactMessageController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\LocationSuggestionController;
use App\Http\Controllers\Api\V1\Admin\MaterialTypeController;
use App\Http\Controllers\Api\V1\Admin\WasteCollectionLocationController;

use App\Http\Controllers\Api\V1\PublicContactMessageController;
use App\Http\Controllers\Api\V1\PublicLocationSuggestionController;
use App\Http\Controllers\Api\V1\PublicMaterialTypeController;
use App\Http\Controllers\Api\V1\PublicWasteCollectionLocationController;
use Illuminate\Http\Request;

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
    Route::post('/contact-messages', [PublicContactMessageController::class, 'store'])
        ->middleware('throttle:public-contact');
    Route::post('/location-suggestions', [PublicLocationSuggestionController::class, 'store'])
        ->middleware('throttle:public-suggestions');
    
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);

            Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

            Route::apiResource('locations', WasteCollectionLocationController::class);

            Route::prefix('material-types')->group(function () {
                Route::get('/', [MaterialTypeController::class, 'index']);
                Route::get('/{materialType}', [MaterialTypeController::class, 'show']);
                Route::post('/', [MaterialTypeController::class, 'store']);
                Route::put('/{materialType}', [MaterialTypeController::class, 'update']);
                Route::patch('/{materialType}/status', [MaterialTypeController::class, 'updateStatus']);
            });

            Route::prefix('contact-messages')->group(function () {
                Route::get('/', [ContactMessageController::class, 'index']);
                Route::get('/{contactMessage}', [ContactMessageController::class, 'show']);
                Route::patch('/{contactMessage}/archive', [ContactMessageController::class, 'archive']);
                Route::post('/{contactMessage}/reply', [ContactMessageController::class, 'reply']);
            });

            Route::prefix('location-suggestions')->group(function () {
                Route::get('/', [LocationSuggestionController::class, 'index']);
                Route::get('/{locationSuggestion}', [LocationSuggestionController::class, 'show']);
                Route::patch('/{locationSuggestion}', [LocationSuggestionController::class, 'update']);
                Route::post('/{locationSuggestion}/approve', [LocationSuggestionController::class, 'approve']);
                Route::post('/{locationSuggestion}/reject', [LocationSuggestionController::class, 'reject']);
                Route::delete('/{locationSuggestion}', [LocationSuggestionController::class, 'destroy']);
            });

            Route::middleware('role:super_admin')->group(function () {
                Route::apiResource('users', AdminUserController::class);
            });
        });
    });
});