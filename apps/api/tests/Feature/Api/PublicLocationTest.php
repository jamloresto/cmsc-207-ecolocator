<?php

namespace Tests\Feature\Api;

use App\Models\MaterialType;
use App\Models\WasteCollectionLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicLocationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_active_locations(): void
    {
        WasteCollectionLocation::factory()->count(2)->create(['is_active' => true]);
        WasteCollectionLocation::factory()->inactive()->create();

        $response = $this->getJson('/api/v1/locations');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_public_cannot_view_inactive_location(): void
    {
        $location = WasteCollectionLocation::factory()->inactive()->create();

        $response = $this->getJson("/api/v1/locations/{$location->id}");

        $response->assertNotFound();
    }

    public function test_public_can_filter_locations_by_country_code(): void
    {
        WasteCollectionLocation::factory()->create([
            'country_code' => 'PH',
            'country_name' => 'Philippines',
        ]);

        WasteCollectionLocation::factory()->create([
            'country_code' => 'US',
            'country_name' => 'United States',
        ]);

        $response = $this->getJson('/api/v1/locations?country_code=PH');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.country_code', 'PH');
    }

    public function test_public_can_filter_by_material_slug(): void
    {
        $plastic = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $glass = MaterialType::factory()->create([
            'name' => 'Glass',
            'slug' => 'glass',
        ]);

        $plasticLocation = WasteCollectionLocation::factory()->create();
        $plasticLocation->materialTypes()->attach($plastic->id);

        $glassLocation = WasteCollectionLocation::factory()->create();
        $glassLocation->materialTypes()->attach($glass->id);

        $response = $this->getJson('/api/v1/locations?material_slug=plastic');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $plasticLocation->id);
    }
}