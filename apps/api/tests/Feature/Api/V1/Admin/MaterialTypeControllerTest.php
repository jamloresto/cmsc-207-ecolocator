<?php

namespace Tests\Feature\Api\V1\Admin;

use App\Models\MaterialType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MaterialTypeControllerTest extends TestCase
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

    public function test_admin_can_list_material_types(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Plastic bottles',
            'is_active' => true,
        ]);

        MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
            'description' => 'Glass containers',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/admin/material-types');

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material types fetched successfully.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'current_page',
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'slug',
                            'description',
                            'is_active',
                            'created_at',
                            'updated_at',
                        ],
                    ],
                    'first_page_url',
                    'from',
                    'last_page',
                    'last_page_url',
                    'links',
                    'next_page_url',
                    'path',
                    'per_page',
                    'prev_page_url',
                    'to',
                    'total',
                ],
            ]);

        $this->assertCount(2, $response->json('data.data'));
    }

    public function test_admin_can_search_material_types(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Plastic bottles and containers',
        ]);

        MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
            'description' => 'Transparent bottles',
        ]);

        $response = $this->getJson('/api/v1/admin/material-types?search=Plastic');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Plastic');
    }

    public function test_admin_can_search_material_types_by_description(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Paper',
            'slug' => 'paper',
            'description' => 'Newspapers and cartons',
        ]);

        MaterialType::factory()->create([
            'name' => 'Metal',
            'slug' => 'metal',
            'description' => 'Tin cans and scrap metal',
        ]);

        $response = $this->getJson('/api/v1/admin/material-types?search=cartons');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Paper');
    }

    public function test_admin_can_filter_material_types_by_active_status_true(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'is_active' => true,
        ]);

        MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/admin/material-types?is_active=1');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Plastic')
            ->assertJsonPath('data.data.0.is_active', true);
    }

    public function test_admin_can_filter_material_types_by_active_status_false(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'is_active' => true,
        ]);

        MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/admin/material-types?is_active=0');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Glass')
            ->assertJsonPath('data.data.0.is_active', false);
    }

    public function test_admin_can_sort_material_types_by_name_ascending(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Zinc',
            'slug' => 'zinc',
        ]);

        MaterialType::factory()->create([
            'name' => 'Aluminum',
            'slug' => 'aluminum',
        ]);

        MaterialType::factory()->create([
            'name' => 'Copper',
            'slug' => 'copper',
        ]);

        $response = $this->getJson('/api/v1/admin/material-types?sort=name&direction=asc');

        $response->assertOk();

        $names = collect($response->json('data.data'))->pluck('name')->values()->all();

        $this->assertSame(['Aluminum', 'Copper', 'Zinc'], $names);
    }

    public function test_admin_can_sort_material_types_by_name_descending(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Zinc',
            'slug' => 'zinc',
        ]);

        MaterialType::factory()->create([
            'name' => 'Aluminum',
            'slug' => 'aluminum',
        ]);

        MaterialType::factory()->create([
            'name' => 'Copper',
            'slug' => 'copper',
        ]);

        $response = $this->getJson('/api/v1/admin/material-types?sort=name&direction=desc');

        $response->assertOk();

        $names = collect($response->json('data.data'))->pluck('name')->values()->all();

        $this->assertSame(['Zinc', 'Copper', 'Aluminum'], $names);
    }

    public function test_admin_can_view_a_single_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Plastic bottles and containers',
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/v1/admin/material-types/{$materialType->id}");

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type fetched successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'name' => 'Plastic',
                    'slug' => 'plastic',
                    'description' => 'Plastic bottles and containers',
                    'is_active' => true,
                ],
            ]);
    }

    public function test_admin_can_create_a_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Plastic',
            'description' => 'Plastic bottles and containers',
            'is_active' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Material type created successfully.',
                'data' => [
                    'name' => 'Plastic',
                    'slug' => 'plastic',
                    'description' => 'Plastic bottles and containers',
                    'is_active' => true,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Plastic bottles and containers',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_a_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Plastic bottles',
            'is_active' => true,
        ]);

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'name' => 'Plastic Materials',
            'description' => 'Updated description',
            'is_active' => false,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type updated successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'name' => 'Plastic Materials',
                    'slug' => 'plastic-materials',
                    'description' => 'Updated description',
                    'is_active' => false,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'id' => $materialType->id,
            'name' => 'Plastic Materials',
            'slug' => 'plastic-materials',
            'description' => 'Updated description',
            'is_active' => false,
        ]);
    }

    public function test_admin_can_update_material_type_status_to_inactive(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/v1/admin/material-types/{$materialType->id}/status", [
            'is_active' => false,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type status updated successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'is_active' => false,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'id' => $materialType->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_update_material_type_status_to_active(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'is_active' => false,
        ]);

        $response = $this->patchJson("/api/v1/admin/material-types/{$materialType->id}/status", [
            'is_active' => true,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type status updated successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'is_active' => true,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'id' => $materialType->id,
            'is_active' => true,
        ]);
    }

    public function test_delete_material_type_route_is_not_available(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create();

        $response = $this->deleteJson("/api/v1/admin/material-types/{$materialType->id}");

        $response->assertStatus(405);
    }

    public function test_guest_cannot_list_material_types(): void
    {
        $response = $this->getJson('/api/v1/admin/material-types');

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }

    public function test_guest_cannot_view_a_single_material_type(): void
    {
        $materialType = MaterialType::factory()->create();

        $response = $this->getJson("/api/v1/admin/material-types/{$materialType->id}");

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }

    public function test_guest_cannot_create_a_material_type(): void
    {
        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Plastic',
        ]);

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }

    public function test_guest_cannot_update_a_material_type(): void
    {
        $materialType = MaterialType::factory()->create();

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }

    public function test_guest_cannot_update_material_type_status(): void
    {
        $materialType = MaterialType::factory()->create();

        $response = $this->patchJson("/api/v1/admin/material-types/{$materialType->id}/status", [
            'is_active' => false,
        ]);

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }

    public function test_admin_cannot_create_a_material_type_with_duplicate_name(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Plastic',
            'description' => 'Duplicate material type',
            'is_active' => true,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_cannot_update_a_material_type_with_duplicate_name(): void
    {
        $this->authenticateAdmin('super_admin');

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $materialType = MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
        ]);

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'name' => 'Plastic',
            'description' => 'Trying duplicate name',
            'is_active' => true,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_can_update_a_material_type_with_the_same_existing_name_of_that_record(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Plastic bottles',
            'is_active' => true,
        ]);

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'name' => 'Plastic',
            'description' => 'Updated description only',
            'is_active' => false,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type updated successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'name' => 'Plastic',
                    'slug' => 'plastic',
                    'description' => 'Updated description only',
                    'is_active' => false,
                ],
            ]);

        $this->assertDatabaseHas('material_types', [
            'id' => $materialType->id,
            'name' => 'Plastic',
            'slug' => 'plastic',
            'description' => 'Updated description only',
            'is_active' => false,
        ]);
    }

    public function test_admin_cannot_list_material_types_with_invalid_sort_field(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->getJson('/api/v1/admin/material-types?sort=invalid_column&direction=asc');

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['sort']);
    }

    public function test_admin_cannot_list_material_types_with_invalid_direction(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->getJson('/api/v1/admin/material-types?sort=name&direction=upwards');

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['direction']);
    }

    public function test_admin_cannot_update_material_type_status_without_is_active(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/v1/admin/material-types/{$materialType->id}/status", []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['is_active']);
    }

    public function test_admin_cannot_update_material_type_status_with_invalid_is_active_value(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/v1/admin/material-types/{$materialType->id}/status", [
            'is_active' => 'archived',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['is_active']);
    }

    public function test_admin_cannot_create_a_material_type_without_name(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->postJson('/api/v1/admin/material-types', [
            'description' => 'No name provided',
            'is_active' => true,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_cannot_update_a_material_type_without_name(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create();

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'description' => 'Missing name on update',
            'is_active' => true,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_cannot_create_a_material_type_with_invalid_is_active_value(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->postJson('/api/v1/admin/material-types', [
            'name' => 'Plastic',
            'description' => 'Plastic bottles',
            'is_active' => 'yes',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['is_active']);
    }

    public function test_admin_cannot_update_a_material_type_with_invalid_is_active_value(): void
    {
        $this->authenticateAdmin('super_admin');

        $materialType = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $response = $this->putJson("/api/v1/admin/material-types/{$materialType->id}", [
            'name' => 'Plastic Updated',
            'description' => 'Updated description',
            'is_active' => 'yes',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['is_active']);
    }

    public function test_admin_gets_404_when_viewing_non_existent_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->getJson('/api/v1/admin/material-types/999999');

        $response->assertStatus(404);
    }

    public function test_admin_gets_404_when_updating_non_existent_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->putJson('/api/v1/admin/material-types/999999', [
            'name' => 'Non Existent',
            'description' => 'Should fail',
            'is_active' => true,
        ]);

        $response->assertStatus(404);
    }

    public function test_admin_gets_404_when_updating_status_of_non_existent_material_type(): void
    {
        $this->authenticateAdmin('super_admin');

        $response = $this->patchJson('/api/v1/admin/material-types/999999/status', [
            'is_active' => false,
        ]);

        $response->assertStatus(404);
    }
}