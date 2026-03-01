<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Stripe
use Stripe\Stripe;
use Stripe\StripeClient;
use Stripe\Checkout\Session;
use Stripe\Exception\InvalidRequestException;

use Illuminate\Support\Facades\Storage;

use App\Http\Requests\StripeStoreRequest;

use App\Models\Service;
use Illuminate\Support\Str;

class StripeController extends Controller
{
    public function createCheckout(StripeStoreRequest $request)
    {
        $data = $request->validated();

        $checkout_session = $this->createInvoice(
            $data['email'],
            $data['service_ids']
        );

        return response()->json([ 'url' => $checkout_session->url ], 200);
    }

    public function validatePurchase(Request $request) {
        $validated = $request->validate([
            'session_id' => 'required|string'
        ]);

        $session_id = $validated['session_id'];
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = Session::retrieve($session_id);
        } catch (InvalidRequestException $e) {
            return response()->json(['valid' => false, 'error' => $e->getMessage()], 400);
        }

        if ($session->payment_status !== 'paid') {
            return response()->json(['valid' => false], 400);
        }

        return response()->json(['valid' => true]);
    }

    private function getServiceInvoiceItems (
        array $service_ids
    ) {
        $services = Service::query()
            ->whereIn('id', $service_ids)
            ->get();
        $lineItems = [];

        foreach ($services as $service) {
            $price = (float) $service->price;

            $lineItems[] = [
                'quantity' => 1,
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => (int) round($price * 100),
                    'product_data' => [
                        'name' => $service->name,
                        // 'images' => $service->image_url ? [$service->image_url] : [],
                    ],
                ],
            ];
        }

        return $lineItems;
    }

    private function createInvoice(
        string $email,
        array $service_ids
    ){
        $lineItems = $this->getServiceInvoiceItems($service_ids);
        $stripe = new StripeClient(config('services.stripe.secret'));

        $checkout_session = $stripe->checkout->sessions->create(
            [
                'customer_email'   => $email,
                'line_items'       => $lineItems,
                'mode'             => 'payment',
                'invoice_creation' => ['enabled' => true],

                'success_url' => env('APP_FRONT_URL') . "/success?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url'  => env('APP_FRONT_URL') . '/cancel',

                'metadata' => [
                    'service_ids' => implode(',', $service_ids),
                ],
            ],
            [
                'idempotency_key' => (string) Str::uuid(),
            ]
        );

        return $checkout_session;
    }
}
