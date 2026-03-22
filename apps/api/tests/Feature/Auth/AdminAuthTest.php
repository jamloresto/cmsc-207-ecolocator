<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_login(): void
    {
        $user = User::factory()->superAdmin()->create([
            'email' => 'admin@ecolocator.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@ecolocator.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'is_active',
                ],
            ]);
    }

    public function test_editor_can_login(): void
    {
        $user = User::factory()->editor()->create([
            'email' => 'editor@ecolocator.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'editor@ecolocator.com',
            'password' => 'password123',
        ]);

        $response->assertOk();
    }

    public function test_inactive_admin_cannot_login(): void
    {
        $user = User::factory()->inactiveAdmin()->create([
            'email' => 'inactive@ecolocator.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'inactive@ecolocator.com',
            'password' => 'password123',
        ]);

        $response->assertForbidden();
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->superAdmin()->create([
            'email' => 'admin@ecolocator.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@ecolocator.com',
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_admin_can_fetch_profile(): void
    {
        $user = User::factory()->superAdmin()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/admin/me');

        $response->assertOk()
            ->assertJsonPath('user.id', $user->id);
    }
}