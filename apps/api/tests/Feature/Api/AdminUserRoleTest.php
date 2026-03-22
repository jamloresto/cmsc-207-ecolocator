<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_create_admin_user(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();

        Sanctum::actingAs($superAdmin);

        $response = $this->postJson('/api/v1/admin/users', [
            'name' => 'Editor One',
            'email' => 'editor1@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'editor',
            'is_active' => true,
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'editor1@example.com',
            'role' => 'editor',
        ]);
    }

    public function test_editor_cannot_create_admin_user(): void
    {
        $editor = User::factory()->editor()->create();

        Sanctum::actingAs($editor);

        $response = $this->postJson('/api/v1/admin/users', [
            'name' => 'Editor Two',
            'email' => 'editor2@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'editor',
        ]);

        $response->assertForbidden();
    }
}