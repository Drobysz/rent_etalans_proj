<?php

namespace Tests\Feature;

use App\Models\Payment;
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
}
