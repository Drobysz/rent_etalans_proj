<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthCorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_and_receive_safe_user_payload(): void
    {
        User::factory()->create([
            'name' => 'admin',
            'tg_nickname' => 'admin_tg',
            'role' => 'admin',
            'password' => 'password',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'name' => 'admin',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.tg_nickname', 'admin_tg')
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonMissingPath('user.password')
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'tg_nickname', 'role'],
            ]);
    }

    public function test_users_me_requires_a_valid_token(): void
    {
        $this->getJson('/api/users/me')->assertUnauthorized();

        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/users/me')
            ->assertOk()
            ->assertJsonPath('data.tg_nickname', $user->tg_nickname)
            ->assertJsonMissingPath('data.password');
    }

    public function test_cors_preflight_allows_configured_frontend_origin(): void
    {
        config()->set('cors.allowed_origins', ['http://localhost:3000']);

        $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Access-Control-Request-Method' => 'POST',
        ])
            ->optionsJson('/api/services')
            ->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
    }
}
