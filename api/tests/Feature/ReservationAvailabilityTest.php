<?php

namespace Tests\Feature;

use App\Models\Apartment;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_block_range_and_availability_expands_dates(): void
    {
        $this->postJson('/api/blocked-dates', [
            'start_date' => '2026-07-21',
            'end_date' => '2026-07-23',
            'reason' => 'maintenance',
        ])
            ->assertCreated()
            ->assertJsonPath('start_date', '2026-07-21')
            ->assertJsonPath('end_date', '2026-07-23');

        $this->getJson('/api/reservations/availability')
            ->assertOk()
            ->assertJsonPath('blocked_dates', [
                '2026-07-21',
                '2026-07-22',
                '2026-07-23',
            ])
            ->assertJsonPath('disabled_dates', [
                '2026-07-21',
                '2026-07-22',
                '2026-07-23',
            ]);
    }

    public function test_checkout_rejects_blocked_reservation_dates(): void
    {
        Apartment::query()->create([
            'name' => 'Apartment 1 - one room',
            'nb_chambers' => 1,
            'nb_beds' => 1,
            'price' => 45,
            'apart_link' => '/housing/reservation',
            'description' => 'One room apartment reservation.',
        ]);

        $this->postJson('/api/blocked-dates', [
            'start_date' => '2026-07-21',
            'end_date' => '2026-07-23',
        ])->assertCreated();

        $this->postJson('/api/create-checkout-session', [
            'email' => 'guest@example.com',
            'reserve_id' => 'RSV-TEST',
            'client_number' => 2,
            'days_number' => 2,
            'service_ids' => [],
            'rooms_count' => 1,
            'checkin' => '2026-07-21',
            'checkout' => '2026-07-23',
            'days_count' => 2,
        ])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Selected dates are unavailable.');

        $this->assertSame(0, Reservation::query()->count());
    }

    public function test_checkout_rejects_guest_count_above_apartment_capacity(): void
    {
        Apartment::query()->create([
            'name' => 'Apartment 1 - one room',
            'nb_chambers' => 1,
            'nb_beds' => 1,
            'price' => 45,
            'apart_link' => '/housing/reservation',
            'description' => 'One room apartment reservation.',
        ]);

        $this->postJson('/api/create-checkout-session', [
            'email' => 'guest@example.com',
            'reserve_id' => 'RSV-TEST',
            'client_number' => 3,
            'days_number' => 2,
            'service_ids' => [],
            'rooms_count' => 1,
            'checkin' => '2026-07-21',
            'checkout' => '2026-07-23',
            'days_count' => 2,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('client_number');

        $this->assertSame(0, Reservation::query()->count());
    }

    public function test_payment_creation_rejects_guest_count_above_apartment_capacity(): void
    {
        $apartment = Apartment::query()->create([
            'name' => 'Apartment 2 - two rooms',
            'nb_chambers' => 2,
            'nb_beds' => 2,
            'price' => 90,
            'apart_link' => '/housing/reservation',
            'description' => 'Two room apartment reservation.',
        ]);

        $this->postJson('/api/payments', [
            'email' => 'guest@example.com',
            'reserve_id' => 'RSV-TEST',
            'client_number' => 5,
            'days_number' => 2,
            'days_count' => 2,
            'service_ids' => [],
            'apart_id' => $apartment->id,
            'checkin' => '2026-07-21',
            'checkout' => '2026-07-23',
            'total_price' => 180,
            'session_id' => 'cs_test_capacity',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('client_number');
    }

    public function test_only_paid_or_confirmed_reservations_block_availability(): void
    {
        $apartment = $this->createApartment();

        foreach ([
            Reservation::STATUS_PENDING,
            Reservation::STATUS_PAYMENT_FAILED,
            Reservation::STATUS_EXPIRED,
        ] as $index => $status) {
            $day = 21 + ($index * 3);

            $this->createReservation($apartment, $status, sprintf('2026-08-%02d', $day));
        }

        $this->createReservation($apartment, Reservation::STATUS_PAID, '2026-09-01');
        $this->createReservation($apartment, Reservation::STATUS_CONFIRMED, '2026-09-04');

        $this->getJson("/api/reservations/availability?apartment_id={$apartment->id}")
            ->assertOk()
            ->assertJsonPath('reserved_dates', [
                '2026-09-01',
                '2026-09-02',
                '2026-09-04',
                '2026-09-05',
            ]);
    }

    public function test_frontend_payment_creation_cannot_confirm_a_pending_reservation(): void
    {
        $apartment = $this->createApartment();
        $reservation = $this->createReservation(
            $apartment,
            Reservation::STATUS_PENDING,
            '2026-09-10',
        );

        $this->postJson('/api/payments', [
            'reservation_id' => $reservation->id,
            'email' => $reservation->email,
            'reserve_id' => 'RSV-TEST',
            'client_number' => 2,
            'days_number' => 2,
            'days_count' => 2,
            'service_ids' => [],
            'apart_id' => $apartment->id,
            'checkin' => '2026-09-10',
            'checkout' => '2026-09-12',
            'total_price' => 90,
            'session_id' => 'cs_test_unconfirmed',
        ])->assertCreated();

        $this->assertSame(Reservation::STATUS_PENDING, $reservation->fresh()->status);
    }

    public function test_signed_stripe_webhook_confirms_payment_and_blocks_dates(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test']);

        $apartment = $this->createApartment();
        $reservation = $this->createReservation(
            $apartment,
            Reservation::STATUS_PENDING,
            '2026-09-15',
            'cs_test_paid',
        );

        $this->postSignedStripeEvent('checkout.session.completed', [
            'id' => 'cs_test_paid',
            'object' => 'checkout.session',
            'payment_status' => 'paid',
            'metadata' => [
                'reservation_id' => (string) $reservation->id,
            ],
        ])->assertOk()->assertJsonPath('received', true);

        $this->assertSame(Reservation::STATUS_PAID, $reservation->fresh()->status);

        $this->getJson("/api/reservations/availability?apartment_id={$apartment->id}")
            ->assertOk()
            ->assertJsonPath('reserved_dates', [
                '2026-09-15',
                '2026-09-16',
            ]);
    }

    public function test_expired_checkout_does_not_block_dates_or_downgrade_paid_reservation(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test']);

        $apartment = $this->createApartment();
        $expired = $this->createReservation(
            $apartment,
            Reservation::STATUS_PENDING,
            '2026-09-20',
            'cs_test_expired',
        );
        $paid = $this->createReservation(
            $apartment,
            Reservation::STATUS_PAID,
            '2026-09-23',
            'cs_test_already_paid',
        );

        foreach ([$expired, $paid] as $reservation) {
            $this->postSignedStripeEvent('checkout.session.expired', [
                'id' => $reservation->stripe_session_id,
                'object' => 'checkout.session',
                'payment_status' => 'unpaid',
                'metadata' => [
                    'reservation_id' => (string) $reservation->id,
                ],
            ])->assertOk();
        }

        $this->assertSame(Reservation::STATUS_EXPIRED, $expired->fresh()->status);
        $this->assertSame(Reservation::STATUS_PAID, $paid->fresh()->status);

        $this->getJson("/api/reservations/availability?apartment_id={$apartment->id}")
            ->assertOk()
            ->assertJsonPath('reserved_dates', [
                '2026-09-23',
                '2026-09-24',
            ]);
    }

    private function createApartment(): Apartment
    {
        return Apartment::query()->create([
            'name' => 'Apartment 1 - one room',
            'nb_chambers' => 1,
            'nb_beds' => 1,
            'price' => 45,
            'apart_link' => '/housing/reservation',
            'description' => 'One room apartment reservation.',
        ]);
    }

    private function createReservation(
        Apartment $apartment,
        string $status,
        string $checkin,
        ?string $sessionId = null,
    ): Reservation {
        return Reservation::query()->create([
            'email' => 'guest@example.com',
            'apart_id' => $apartment->id,
            'checkin' => $checkin,
            'checkout' => date('Y-m-d', strtotime("{$checkin} +2 days")),
            'days_count' => 2,
            'rooms_count' => 1,
            'guests' => 2,
            'status' => $status,
            'stripe_session_id' => $sessionId,
        ]);
    }

    private function postSignedStripeEvent(string $type, array $object)
    {
        $payload = json_encode([
            'id' => 'evt_'.uniqid(),
            'object' => 'event',
            'type' => $type,
            'data' => ['object' => $object],
        ], JSON_THROW_ON_ERROR);
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", 'whsec_test');

        return $this->call(
            'POST',
            '/api/stripe/webhook',
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
                'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}",
            ],
            $payload,
        );
    }
}
