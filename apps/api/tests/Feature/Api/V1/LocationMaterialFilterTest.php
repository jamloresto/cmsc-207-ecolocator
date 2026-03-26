<?php

namespace Tests\Feature\Api\V1;

use App\Models\MaterialType;
use App\Models\WasteCollectionLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocationMaterialFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_filter_by_material_type_id(): void
    {
        $plastic = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $glass = MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
        ]);

        $locationA = WasteCollectionLocation::factory()->create();
        $locationA->materialTypes()->attach($plastic->id);

        $locationB = WasteCollectionLocation::factory()->create();
        $locationB->materialTypes()->attach($glass->id);

        $response = $this->getJson("/api/v1/locations?material_type_id={$plastic->id}");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $locationA->id);
    }
}