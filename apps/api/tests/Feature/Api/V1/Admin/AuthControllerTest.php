<?php

namespace Tests\Feature\Api\Admin\V1\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
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
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'is_active',
                ],
            ])
            ->assertJson([
                'message' => 'Login successful.',
                'user' => [
                    'id' => $user->id,
                    'email' => 'admin@ecolocator.com',
                    'role' => 'super_admin',
                    'is_active' => true,
                ],
            ]);

        $this->assertAuthenticatedAs($user, 'web');
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

        $response->assertOk()
            ->assertJson([
                'message' => 'Login successful.',
                'user' => [
                    'id' => $user->id,
                    'email' => 'editor@ecolocator.com',
                    'role' => 'editor',
                    'is_active' => true,
                ],
            ]);

        $this->assertAuthenticatedAs($user, 'web');
    }

    public function test_inactive_admin_cannot_login(): void
    {
        User::factory()->inactiveAdmin()->create([
            'email' => 'inactive@ecolocator.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'inactive@ecolocator.com',
            'password' => 'password123',
        ]);

        $response->assertForbidden()
            ->assertJson([
                'message' => 'Your account is not allowed to access the admin panel.',
            ]);

        $this->assertGuest('web');
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

        $response->assertUnauthorized()
            ->assertJson([
                'message' => 'Invalid credentials.',
            ]);

        $this->assertGuest('web');
    }

    public function test_authenticated_admin_can_fetch_profile(): void
    {
        $user = User::factory()->superAdmin()->create();

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/v1/admin/me');

        $response->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('user.role', $user->role);
    }
}