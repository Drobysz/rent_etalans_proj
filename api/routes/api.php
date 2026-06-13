<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\api\{
    ApartmentController,
    AuthController,
    PaymentController,
    ServiceController,
    StripeController,
    ImageController,
    UserController
};

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/users/me', [AuthController::class, 'me'])
    ->middleware('auth:sanctum');
Route::get('/services/visible', [ServiceController::class, 'showAllVisible']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users/{user}', [UserController::class, 'update']);

    Route::apiResource('services', ServiceController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('apartments', ApartmentController::class);
Route::get('/payments/dashboard', [PaymentController::class, 'dashboard']);
Route::apiResource('payments', PaymentController::class)
    ->except(['update']);
Route::apiResource('image-uploader', ImageController::class)
    ->except(['index', 'show']);

// Stripe
Route::post(
    '/create-checkout-session',
    [StripeController::class, 'createCheckout']
);
Route::post(
    '/validate-purchase',
    [StripeController::class, 'validatePurchase']
);
Route::post(
    '/stripe/invoice-pdf',
    [StripeController::class, 'getStripeInvoicePdf']
);

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json(["message" => "Not found"], 404);
});
