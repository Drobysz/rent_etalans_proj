<?php

namespace Tests\Feature;

use App\Models\Apartment;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_payments_can_be_filtered_by_partial_reserve_id(): void
    {
        Payment::query()->create([
            'client_number' => 1,
            'days_number' => 3,
            'email' => 'first@example.com',
            'reserve_id' => 'FLKNEWF-001',
            'total_price' => 120,
        ]);

        Payment::query()->create([
            'client_number' => 2,
            'days_number' => 2,
            'email' => 'second@example.com',
            'reserve_id' => 'AIRBNB-002',
            'total_price' => 90,
        ]);

        $this->getJson('/api/payments?reserve_id=KNEW')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reserve_id', 'FLKNEWF-001');
    }

    public function test_empty_reserve_id_does_not_filter_payments(): void
    {
        Payment::query()->create([
            'client_number' => 1,
            'days_number' => 3,
            'email' => 'first@example.com',
            'reserve_id' => 'FLKNEWF-001',
            'total_price' => 120,
        ]);

        Payment::query()->create([
            'client_number' => 2,
            'days_number' => 2,
            'email' => 'second@example.com',
            'reserve_id' => 'AIRBNB-002',
            'total_price' => 90,
        ]);

        $this->getJson('/api/payments?reserve_id=')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_payments_can_be_filtered_by_related_reservation_code(): void
    {
        $apartment = Apartment::query()->create([
            'name' => 'Apartment 1',
            'nb_chambers' => 1,
            'nb_beds' => 1,
            'price' => 45,
            'apart_link' => '/housing/reservation',
            'description' => 'One room apartment.',
        ]);
        $reservation = Reservation::query()->create([
            'reservation_code' => 'APT-2026-8F4A2C',
            'email' => 'guest@example.com',
            'apart_id' => $apartment->id,
            'checkin' => '2026-08-01',
            'checkout' => '2026-08-03',
            'days_count' => 2,
            'rooms_count' => 1,
            'guests' => 2,
            'status' => 'paid',
        ]);

        Payment::query()->create([
            'reservation_id' => $reservation->id,
            'apart_id' => $apartment->id,
            'client_number' => 2,
            'days_number' => 2,
            'email' => 'guest@example.com',
            'reserve_id' => 'STRIPE-SESSION-CODE',
            'total_price' => 90,
        ]);

        $this->getJson('/api/payments?reserve_id=8F4A2C')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reservation.reservation_code', 'APT-2026-8F4A2C')
            ->assertJsonPath('data.0.reservation.apartment.name', 'Apartment 1');
    }
}
