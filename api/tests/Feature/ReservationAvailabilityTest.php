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
}
