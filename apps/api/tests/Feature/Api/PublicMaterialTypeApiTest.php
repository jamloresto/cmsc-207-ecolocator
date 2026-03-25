<?php

namespace Tests\Feature\Api;

use App\Models\MaterialType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicMaterialTypeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_list_active_material_types(): void
    {
        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'is_active' => true,
        ]);

        MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
            'is_active' => true,
        ]);

        MaterialType::factory()->create([
            'name' => 'Hidden Material',
            'slug' => 'hidden-material',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/material-types');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material types retrieved successfully.',
            ])
            ->assertJsonFragment(['name' => 'Plastic'])
            ->assertJsonFragment(['name' => 'Glass'])
            ->assertJsonMissing(['name' => 'Hidden Material']);
    }

    public function test_it_can_show_a_single_active_material_type(): void
    {
        $materialType = MaterialType::factory()->create([
            'name' => 'Paper & cardboard',
            'slug' => 'paper-cardboard',
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/v1/material-types/{$materialType->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Material type retrieved successfully.',
                'data' => [
                    'id' => $materialType->id,
                    'name' => 'Paper & cardboard',
                    'slug' => 'paper-cardboard',
                ],
            ]);
    }

    public function test_it_returns_404_when_showing_inactive_material_type(): void
    {
        $materialType = MaterialType::factory()->create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'is_active' => false,
        ]);

        $response = $this->getJson("/api/v1/material-types/{$materialType->id}");

        $response->assertNotFound()
            ->assertJson([
                'success' => false,
                'message' => 'Material type not found.',
            ]);
    }

    public function test_it_returns_404_when_material_type_does_not_exist(): void
    {
        $response = $this->getJson('/api/v1/material-types/999999');

        $response->assertNotFound()
            ->assertJson([
                'success' => false,
                'message' => 'Material type not found.',
            ]);
    }
}