<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\{
    ApartmentController,
    PaymentController,
    ServiceController,
    StripeController,
    ImageController
};

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('apartments', ApartmentController::class);
Route::apiResource('services', ServiceController::class);
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

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json(["message" => "Not found"], 404);
});
