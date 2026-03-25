<?php

namespace Tests\Feature\Api\Admin;

use App\Models\MaterialType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminMaterialTypeApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateAdmin(string $role = 'super_admin'): User
    {
        $admin = User::factory()->create([
            'role' => $role,
            'is_active' => true,
        ]);

        Sanctum::actingAs($admin);

        return $admin;
    }

    public function test_admin_can_create_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $payload = [
            'name' => 'Batteries',
            'description' => 'Used household and industrial batteries.',
            'is_active' => true,
        ];

        $response = $this->postJson('/api/v1/admin/material-types', $payload);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Material type created successfully.',
                'data' => [
                    'name' => 'Batteries',
                    'slug' => 'batteries',
                    'description' => 'Used household and industrial batteries.',
                    'is_active' => true,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'name' => 'Batteries',
            'slug' => 'batteries',
            'description' => 'Used household and industrial batteries.',
            'is_active' => true,
        ]);
    }

    public function test_editor_can_create_material_type_if_allowed_by_middleware(): void
    {
        $this->authenticateAdmin('editor');

        $payload = [
            'name' => 'Textiles',
            'description' => 'Old clothes and fabrics.',
            'is_active' => true,
        ];

        $response = $this->postJson('/api/v1/admin/material-types', $payload);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Material type created successfully.',
                'data' => [
                    'name' => 'Textiles',
                    'slug' => 'textiles',
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'name' => 'Textiles',
            'slug' => 'textiles',
        ]);
    }

    public function test_unauthenticated_user_cannot_create_material_type(): void
    {
        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Glass',
        ]);

        $response->assertUnauthorized();
    }

    public function test_inactive_admin_cannot_create_material_type(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'is_active' => false,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Glass',
            'description' => 'Glass materials',
            'is_active' => true,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
            ]);
    }

    public function test_admin_cannot_create_duplicate_material_type_name(): void
    {
        $this->authenticateAdmin();

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Plastic',
            'description' => 'Duplicate test',
            'is_active' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_can_update_material_type(): void
    {
        $this->authenticateAdmin();

        $materialType = MaterialType::factory()->create([
            'name' => 'Paper',
            'slug' => 'paper',
            'description' => 'Old description',
            'is_active' => true,
        ]);

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'name' => 'Paper & cardboard',
            'description' => 'Updated description',
            'is_active' => false,
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type updated successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'name' => 'Paper & cardboard',
                    'slug' => 'paper-cardboard',
                    'description' => 'Updated description',
                    'is_active' => false,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'id' => $materialType->id,
            'name' => 'Paper & cardboard',
            'slug' => 'paper-cardboard',
            'description' => 'Updated description',
            'is_active' => false,
        ]);
    }

    public function test_admin_gets_404_when_updating_non_existing_material_type(): void
    {
        $this->authenticateAdmin();

        $response = $this->putJson('/api/v1/admin/material-types/999999', [
            'name' => 'Non Existing',
            'description' => 'Test',
            'is_active' => true,
        ]);

        $response->assertNotFound()
            ->assertJson([
                'success' => false,
                'message' => 'Material type not found.',
            ]);
    }

    public function test_admin_can_delete_material_type(): void
    {
        $this->authenticateAdmin();

        $materialType = MaterialType::factory()->create([
            'is_active' => true,
        ]);

        $response = $this->deleteJson("/api/v1/admin/material-types/{$materialType->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type deleted successfully.',
            ]);

        $this->assertDatabaseMissing('material_types', [
            'id' => $materialType->id,
        ]);
    }

    public function test_admin_gets_404_when_deleting_non_existing_material_type(): void
    {
        $this->authenticateAdmin();

        $response = $this->deleteJson('/api/v1/admin/material-types/999999');

        $response->assertNotFound()
            ->assertJson([
                'success' => false,
                'message' => 'Material type not found.',
            ]);
    }
}