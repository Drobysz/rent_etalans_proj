<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_service_create_uploads_images_to_service_cards_folder(): void
    {
        Storage::fake('s3');

        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('services-test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->post('/api/services', [
                'name' => 'Cleaning',
                'description' => 'Cleaning shown to clients.',
                'price' => 40,
                'visible' => true,
                'fixed_price' => true,
                'images' => [
                    UploadedFile::fake()->image('cleaning.jpg'),
                ],
            ]);

        $response->assertCreated();

        $serviceId = $response->json('data.id');
        $files = Storage::disk('s3')->files("service-cards-imgs/{$serviceId}");

        $this->assertCount(1, $files);
        $this->assertStringStartsWith(
            "service-cards-imgs/{$serviceId}/",
            Service::query()->findOrFail($serviceId)->images()->firstOrFail()->path
        );
    }

    public function test_service_image_uploader_uses_service_cards_folder(): void
    {
        Storage::fake('s3');

        $service = Service::query()->create([
            'name' => 'Transfer',
            'description' => 'Transfer shown to clients.',
            'price' => 70,
            'visible' => true,
            'fixed_price' => false,
        ]);

        $this->post('/api/image-uploader', [
            'object_id' => $service->id,
            'object_type' => 'service',
            'image' => UploadedFile::fake()->image('transfer.jpg'),
        ])->assertCreated();

        $files = Storage::disk('s3')->files("service-cards-imgs/{$service->id}");

        $this->assertCount(1, $files);
        $this->assertStringStartsWith(
            "service-cards-imgs/{$service->id}/",
            $service->images()->firstOrFail()->path
        );
    }
}
