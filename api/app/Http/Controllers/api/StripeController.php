<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Stripe
use Stripe\Stripe;
use Stripe\StripeClient;
use Stripe\Checkout\Session;
use Stripe\Exception\InvalidRequestException;

use App\Http\Requests\StripeStoreRequest;

use App\Models\{
    Apartment,
    Reservation,
    Service
};
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

class StripeController extends Controller
{
    public function createCheckout(StripeStoreRequest $request)
    {
        $data = $request->validated();
        $serviceIds = $data['service_ids'] ?? [];
        $apartment = $this->resolveApartment($data['apart_id'] ?? null, $data['rooms_count'] ?? null);
        $apartmentId = $apartment?->id;

        if (empty($serviceIds) && !$apartmentId) {
            return response()->json([
                'message' => 'Select an apartment or at least one service.',
            ], 422);
        }

        if ($apartmentId && (empty($data['checkin']) || empty($data['checkout']))) {
            return response()->json([
                'message' => 'Check-in and check-out dates are required for apartment reservations.',
            ], 422);
        }

        $reservationDays = null;
        $reservation = null;

        if ($apartmentId) {
            $checkin = CarbonImmutable::parse($data['checkin'])->startOfDay();
            $checkout = CarbonImmutable::parse($data['checkout'])->startOfDay();
            $reservationDays = max(1, $checkin->diffInDays($checkout));

            $reservation = Reservation::query()->create([
                'email' => $data['email'],
                'apart_id' => $apartmentId,
                'checkin' => $checkin->toDateString(),
                'checkout' => $checkout->toDateString(),
                'days_count' => $reservationDays,
                'rooms_count' => $apartment->nb_chambers,
                'guests' => $data['client_number'],
                'status' => 'pending',
            ]);
        }

        try {
            $checkout_session = $this->createInvoice(
                $data['email'],
                $serviceIds,
                $data['reserve_id'],
                $data['client_number'],
                $data['days_number'],
                $apartmentId,
                $data['checkin'] ?? null,
                $data['checkout'] ?? null,
                $reservationDays ?? $data['days_count'] ?? null,
                $apartment?->nb_chambers ?? $data['rooms_count'] ?? null,
                $reservation
            );
        } catch (\Throwable $exception) {
            $reservation?->delete();

            throw $exception;
        }

        if ($reservation) {
            $reservation->forceFill([
                'stripe_session_id' => $checkout_session->id,
            ])->save();
        }

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

        $metadata = $session->metadata;

        return response()->json([
            'valid' => true,
            'payment_status' => $session->payment_status,
            'payment' => [
                'email' => $session->customer_details?->email ?? $session->customer_email,
                'reserve_id' => $metadata->reserve_id ?? null,
                'client_number' => (int) ($metadata->client_number ?? 0),
                'days_number' => (int) ($metadata->days_number ?? 0),
                'days_count' => (int) ($metadata->days_count ?? $metadata->days_number ?? 0),
                'reservation_id' => isset($metadata->reservation_id) && $metadata->reservation_id !== ''
                    ? (int) $metadata->reservation_id
                    : null,
                'reservation_code' => $metadata->reservation_code ?? null,
                'apart_id' => isset($metadata->apart_id) && $metadata->apart_id !== ''
                    ? (int) $metadata->apart_id
                    : null,
                'rooms_count' => isset($metadata->rooms_count) && $metadata->rooms_count !== ''
                    ? (int) $metadata->rooms_count
                    : null,
                'checkin' => $metadata->checkin ?? null,
                'checkout' => $metadata->checkout ?? null,
                'service_ids' => array_values(array_filter(
                    array_map('intval', explode(',', $metadata->service_ids ?? ''))
                )),
                'total_price' => ((float) ($session->amount_total ?? 0)) / 100,
            ],
        ]);
    }

    private function resolveApartment(?int $apartmentId, ?int $roomsCount): ?Apartment
    {
        if ($apartmentId) {
            $apartment = Apartment::query()->find($apartmentId);

            if ($apartment) {
                return $this->ensureReservationApartmentPrice($apartment);
            }
        }

        if (!$roomsCount) {
            return null;
        }

        $apartment = Apartment::query()
            ->where('nb_chambers', $roomsCount)
            ->orderBy('id')
            ->first();

        if (!$apartment) {
            $apartment = Apartment::query()->create([
                'name' => $roomsCount === 1 ? 'Apartment 1 - one room' : 'Apartment 2 - two rooms',
                'nb_chambers' => $roomsCount,
                'nb_beds' => $roomsCount,
                'price' => $this->getApartmentPriceForRooms($roomsCount),
                'apart_link' => '/housing/reservation',
                'description' => $roomsCount === 1
                    ? 'One room apartment reservation.'
                    : 'Two room apartment reservation.',
            ]);
        }

        return $this->ensureReservationApartmentPrice($apartment);
    }

    private function ensureReservationApartmentPrice(Apartment $apartment): Apartment
    {
        $price = $this->getApartmentPriceForRooms((int) $apartment->nb_chambers);

        if ($price !== null && (float) $apartment->price !== (float) $price) {
            $apartment->forceFill(['price' => $price])->save();
        }

        return $apartment;
    }

    private function getApartmentPriceForRooms(int $roomsCount): ?int
    {
        return match ($roomsCount) {
            1 => 45,
            2 => 90,
            default => null,
        };
    }

    public function getStripeInvoicePdf(Request $request)
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string'],
        ]);

        $stripe = new StripeClient(config('services.stripe.secret'));

        try {
            $session = $stripe->checkout->sessions->retrieve(
                $validated['session_id'],
                [
                    'expand' => ['invoice'],
                ]
            );
        } catch (InvalidRequestException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }

        if (!$session->invoice) {
            return response()->json([
                'message' => 'Invoice is not created yet',
            ], 404);
        }

        $invoice = $session->invoice;

        return response()->json([
            'invoice_pdf' => $invoice->invoice_pdf,
            'hosted_invoice_url' => $invoice->hosted_invoice_url,
        ]);
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

    private function getApartmentInvoiceItem(
        int $apartmentId,
        int $daysNumber,
        ?string $checkin,
        ?string $checkout,
    ): array {
        $apartment = Apartment::query()->findOrFail($apartmentId);
        $descriptionParts = array_filter([$checkin, $checkout]);

        return [
            'quantity' => $daysNumber,
            'price_data' => [
                'currency' => 'eur',
                'unit_amount' => (int) round(((float) $apartment->price) * 100),
                'product_data' => [
                    'name' => $apartment->name,
                    'description' => !empty($descriptionParts)
                        ? implode(' - ', $descriptionParts)
                        : $apartment->description,
                ],
            ],
        ];
    }

    private function getApartmentTotalPrice(?int $apartmentId, int $daysNumber): float
    {
        if (!$apartmentId) {
            return 0;
        }

        $apartment = Apartment::query()->findOrFail($apartmentId);

        return ((float) $apartment->price) * $daysNumber;
    }

    private function createInvoice(
        string $email,
        array $service_ids,
        string $reserve_id,
        int $client_number,
        int $days_number,
        ?int $apart_id = null,
        ?string $checkin = null,
        ?string $checkout = null,
        ?int $days_count = null,
        ?int $rooms_count = null,
        ?Reservation $reservation = null
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

        if ($apart_id) {
            $reservationDays = $days_count ?? $days_number;

            $lineItems[] = $this->getApartmentInvoiceItem(
                $apart_id,
                $reservationDays,
                $checkin,
                $checkout,
            );
            $totalPrice += $this->getApartmentTotalPrice($apart_id, $reservationDays);
        }

        $stripe = new StripeClient(config('services.stripe.secret'));
        $checkout_session = $stripe->checkout->sessions->create(
            [
                'customer_email'   => $email,
                'line_items'       => $lineItems,
                'mode'             => 'payment',
                'invoice_creation' => ['enabled' => true],

                'success_url' => config('services.frontend.url') . "/success?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url'  => config('services.frontend.url') . '/cancel',

                'metadata' => [
                    'email'         => $email,
                    'service_ids'   => implode(',', $service_ids),
                    'reserve_id'    => $reserve_id,
                    'client_number' => (string) $client_number,
                    'days_number'   => (string) $days_number,
                    'days_count'    => (string) ($days_count ?? $days_number),
                    'reservation_id' => $reservation ? (string) $reservation->id : '',
                    'reservation_code' => $reservation?->reservation_code ?? '',
                    'apart_id'      => $apart_id ? (string) $apart_id : '',
                    'rooms_count'   => $rooms_count ? (string) $rooms_count : '',
                    'checkin'       => $checkin ?? '',
                    'checkout'      => $checkout ?? '',
                    'total_price'   => (string) $totalPrice,
                ],
            ],
            [
                'idempotency_key' => (string) Str::uuid(),
            ]
        );

        return $checkout_session;
    }
}
