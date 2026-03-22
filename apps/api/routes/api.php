<?php

use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Admin Auth
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);

            Route::middleware('role:super_admin')->group(function () {
                Route::apiResource('users', AdminUserController::class);
            });
        });
    });
});