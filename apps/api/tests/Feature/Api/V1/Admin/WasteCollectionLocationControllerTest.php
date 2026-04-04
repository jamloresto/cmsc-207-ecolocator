<?php

namespace Tests\Feature\Api\V1\Admin;

use App\Models\MaterialType;
use App\Models\User;
use App\Models\WasteCollectionLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WasteCollectionLocationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_create_location(): void
    {
        $editor = User::factory()->editor()->create();
        $plastic = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        Sanctum::actingAs($editor);

        $response = $this->postJson('/api/v1/admin/locations', [
            'name' => 'Barangay Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Davao del Sur',
            'state_code' => 'DVO',
            'city_municipality' => 'Davao City',
            'region' => 'Region XI',
            'street_address' => '123 Recycling St.',
            'postal_code' => '8000',
            'latitude' => 7.0707,
            'longitude' => 125.6087,
            'contact_number' => '09171234567',
            'email' => 'center@example.com',
            'operating_hours' => 'Mon-Fri 8AM-5PM',
            'notes' => 'Walk-in accepted',
            'is_active' => true,
            'material_type_ids' => [$plastic->id],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Barangay Recycling Center')
            ->assertJsonPath('data.city_slug', 'davao-city');

        $this->assertDatabaseHas('waste_collection_locations', [
            'name' => 'Barangay Recycling Center',
            'city_slug' => 'davao-city',
        ]);

        $this->assertDatabaseHas('location_material_type', [
            'material_type_id' => $plastic->id,
        ]);
    }

    public function test_editor_can_update_location(): void
    {
        $editor = User::factory()->editor()->create();
        $location = WasteCollectionLocation::factory()->create([
            'city_municipality' => 'Digos City',
            'city_slug' => 'digos-city',
        ]);

        Sanctum::actingAs($editor);

        $response = $this->putJson("/api/v1/admin/locations/{$location->id}", [
            'city_municipality' => 'Davao City',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.city_municipality', 'Davao City')
            ->assertJsonPath('data.city_slug', 'davao-city');
    }

    public function test_editor_can_delete_location(): void
    {
        $editor = User::factory()->editor()->create();
        $location = WasteCollectionLocation::factory()->create();

        Sanctum::actingAs($editor);

        $response = $this->deleteJson("/api/v1/admin/locations/{$location->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('waste_collection_locations', [
            'id' => $location->id,
        ]);
    }

    public function test_guest_cannot_create_location(): void
    {
        $response = $this->postJson('/api/v1/admin/locations', []);

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }
}