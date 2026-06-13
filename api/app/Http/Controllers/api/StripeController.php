<?php

namespace App\Http\Controllers\api;

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
            $data['service_ids'],
            $data['reserve_id'],
            $data['client_number'],
            $data['days_number']
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

    private function getTotalPrice (
        array $service_ids,
        int $daysNumber,
        int $clientNumber,
    ) {
        $services = Service::query()
            ->whereIn('id', $service_ids)
            ->get();
        
        $totalPrice = 0;

        foreach($services as $service) {
            $price = (float) $service->price;
            $isFixedPrice = $service->fixed_price;
            $totalMultiplier = $daysNumber * $clientNumber;

            $finalPrice = $isFixedPrice 
                ? $price 
                : $price * $totalMultiplier;

            $totalPrice += $finalPrice;
        }
        return $totalPrice;
    }

    private function getServiceInvoiceItems (
        array $service_ids,
        int $daysNumber,
        int $clientNumber,
    ) {
        $services = Service::query()
            ->whereIn('id', $service_ids)
            ->get();
        $lineItems = [];

        foreach ($services as $service) {
            $price = (float) $service->price;
            $isFixedPrice = $service->fixed_price;
            $totalMultiplier = $daysNumber * $clientNumber;

            $lineItems[] = [
                'quantity' => $isFixedPrice ? 1 : $totalMultiplier,
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => (int) round($price * 100),
                    'product_data' => [
                        'name' => $service->name,
                        'images' => $service->image_url ? [$service->image_url] : [],
                    ],
                ],
            ];
        }

        return $lineItems;
    }

    private function createInvoice(
        string $email,
        array $service_ids,
        string $reserve_id,
        int $client_number,
        int $days_number
    ){
        $lineItems = $this->getServiceInvoiceItems(
            $service_ids,
            $days_number,
            $client_number,
        );
        $totalPrice = $this->getTotalPrice(
            $service_ids,
            $days_number,
            $client_number,
        );
        $stripe = new StripeClient(config('services.stripe.secret'));
        $services_stringified = json_encode($service_ids);

        $url_params="?session_id={CHECKOUT_SESSION_ID}&total_price={$totalPrice}&email={$email}&reserve_id={$reserve_id}&client_number={$client_number}&days_number={$days_number}&service_ids={$services_stringified}";

        $checkout_session = $stripe->checkout->sessions->create(
            [
                'customer_email'   => $email,
                'line_items'       => $lineItems,
                'mode'             => 'payment',
                'invoice_creation' => ['enabled' => true],

                'success_url' => config('services.frontend.url') . "/success{$url_params}",
                'cancel_url'  => config('services.frontend.url') . '/cancel',

                'metadata' => [
                    'service_ids'   => implode(',', $service_ids),
                    'reserve_id'    => $reserve_id,
                    'client_number' => (string) $client_number,
                    'days_number'   => (string) $days_number
                ],
            ],
            [
                'idempotency_key' => (string) Str::uuid(),
            ]
        );

        return $checkout_session;
    }
}
