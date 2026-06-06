<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_visible_services_endpoint_returns_only_client_visible_services(): void
    {
        Service::query()->create([
            'name' => 'Visible cleaning',
            'description' => 'Cleaning shown to clients.',
            'price' => 40,
            'visible' => true,
            'fixed_price' => true,
        ]);

        Service::query()->create([
            'name' => 'Hidden transfer',
            'description' => 'Transfer hidden from clients.',
            'price' => 70,
            'visible' => false,
            'fixed_price' => false,
        ]);

        $this->getJson('/api/services/visible')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Visible cleaning')
            ->assertJsonPath('data.0.visible', true)
            ->assertJsonPath('data.0.fixed_price', true);
    }

    public function test_admin_services_index_requires_authentication(): void
    {
        $this->getJson('/api/services')->assertUnauthorized();
    }

    public function test_admin_services_index_returns_hidden_and_visible_services(): void
    {
        Service::query()->create([
            'name' => 'Visible cleaning',
            'description' => 'Cleaning shown to clients.',
            'price' => 40,
            'visible' => true,
            'fixed_price' => true,
        ]);

        Service::query()->create([
            'name' => 'Hidden transfer',
            'description' => 'Transfer hidden from clients.',
            'price' => 70,
            'visible' => false,
            'fixed_price' => false,
        ]);

        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('services-test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/services')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
