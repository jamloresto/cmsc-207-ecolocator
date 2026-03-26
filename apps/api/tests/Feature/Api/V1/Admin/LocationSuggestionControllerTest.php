<?php

namespace Tests\Feature\Api\V1\Admin;

use App\Models\LocationSuggestion;
use App\Models\MaterialType;
use App\Models\User;
use App\Models\WasteCollectionLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocationSuggestionControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function createSuperAdmin(): User
    {
        return User::factory()->create([
            'role' => 'super_admin',
            'is_active' => true,
        ]);
    }

    protected function createEditor(): User
    {
        return User::factory()->create([
            'role' => 'editor',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_list_location_suggestions(): void
    {
        $admin = $this->createSuperAdmin();

        LocationSuggestion::factory()->count(3)->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/location-suggestions');

        $response->assertOk()
            ->assertJsonStructure([
                'current_page',
                'data',
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
            ]);
    }

    public function test_admin_can_filter_location_suggestions_by_status(): void
    {
        $admin = $this->createSuperAdmin();

        LocationSuggestion::factory()->create(['status' => 'pending']);
        LocationSuggestion::factory()->create(['status' => 'under_review']);
        LocationSuggestion::factory()->create(['status' => 'approved']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/location-suggestions?status=under_review');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'status' => 'under_review',
            ]);
    }

    public function test_admin_can_search_location_suggestions(): void
    {
        $admin = $this->createSuperAdmin();

        LocationSuggestion::factory()->create([
            'location_name' => 'Alpha Recycling Center',
            'email' => 'alpha@example.com',
        ]);

        LocationSuggestion::factory()->create([
            'location_name' => 'Beta Collection Point',
            'email' => 'beta@example.com',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/location-suggestions?search=Alpha');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'location_name' => 'Alpha Recycling Center',
            ]);
    }

    public function test_admin_can_view_single_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/location-suggestions/{$suggestion->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $suggestion->id);
    }

    public function test_admin_can_update_pending_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'pending',
            'reviewed_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/location-suggestions/{$suggestion->id}", [
                'location_name' => 'Updated Recycling Center',
                'review_notes' => 'Corrected the location name.',
            ]);

        $response->assertOk()
            ->assertJson([
                'message' => 'Location suggestion updated successfully.',
                'data' => [
                    'id' => $suggestion->id,
                    'location_name' => 'Updated Recycling Center',
                    'status' => 'under_review',
                    'review_notes' => 'Corrected the location name.',
                ],
            ]);

        $this->assertDatabaseHas('location_suggestions', [
            'id' => $suggestion->id,
            'location_name' => 'Updated Recycling Center',
            'status' => 'under_review',
            'review_notes' => 'Corrected the location name.',
        ]);
    }

    public function test_admin_can_update_under_review_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'under_review',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/location-suggestions/{$suggestion->id}", [
                'address' => '456 Updated Street',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.address', '456 Updated Street');

        $this->assertDatabaseHas('location_suggestions', [
            'id' => $suggestion->id,
            'address' => '456 Updated Street',
            'status' => 'under_review',
        ]);
    }

    public function test_admin_cannot_update_approved_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/location-suggestions/{$suggestion->id}", [
                'location_name' => 'Should Not Update',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'This suggestion can no longer be edited.',
            ]);
    }

    public function test_admin_cannot_update_rejected_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'rejected',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/location-suggestions/{$suggestion->id}", [
                'location_name' => 'Should Not Update',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'This suggestion can no longer be edited.',
            ]);
    }

    public function test_admin_can_approve_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        MaterialType::factory()->create([
            'name' => 'Paper',
            'slug' => 'paper',
        ]);

        MaterialType::factory()->create([
            'name' => 'E-waste',
            'slug' => 'e-waste',
        ]);

        $suggestion = LocationSuggestion::factory()
            ->approvable()
            ->create([
                'status' => 'pending',
            ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/approve");

        $response->assertOk()
            ->assertJson([
                'message' => 'Location suggestion approved successfully.',
                'data' => [
                    'id' => $suggestion->id,
                    'status' => 'approved',
                ],
            ]);

        $suggestion->refresh();

        $this->assertEquals('approved', $suggestion->status);
        $this->assertNotNull($suggestion->approved_at);
        $this->assertEquals($admin->id, $suggestion->approved_by);
        $this->assertNotNull($suggestion->waste_collection_location_id);
    }

    public function test_admin_cannot_approve_already_approved_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/approve");

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Location suggestion is already approved.',
            ]);
    }

    public function test_admin_cannot_approve_rejected_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'rejected',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/approve");

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Rejected suggestions cannot be approved.',
            ]);
    }

    public function test_admin_can_reject_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'under_review',
            'rejected_at' => null,
            'rejected_by' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/reject", [
                'review_notes' => 'Insufficient location details.',
            ]);

        $response->assertOk()
            ->assertJson([
                'message' => 'Location suggestion rejected successfully.',
                'data' => [
                    'id' => $suggestion->id,
                    'status' => 'rejected',
                    'review_notes' => 'Insufficient location details.',
                ],
            ]);

        $this->assertDatabaseHas('location_suggestions', [
            'id' => $suggestion->id,
            'status' => 'rejected',
            'review_notes' => 'Insufficient location details.',
            'rejected_by' => $admin->id,
        ]);
    }

    public function test_admin_cannot_reject_approved_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/reject", [
                'review_notes' => 'Should fail.',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Approved suggestions cannot be rejected.',
            ]);
    }

    public function test_admin_can_delete_location_suggestion(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/location-suggestions/{$suggestion->id}");

        $response->assertOk()
            ->assertJson([
                'message' => 'Location suggestion deleted successfully.',
            ]);

        $this->assertDatabaseMissing('location_suggestions', [
            'id' => $suggestion->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_admin_location_suggestions(): void
    {
        $response = $this->getJson('/api/v1/admin/location-suggestions');

        $response->assertUnauthorized();
    }

    public function test_editor_can_access_admin_location_suggestions_if_allowed_by_middleware(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor, 'sanctum')
            ->getJson('/api/v1/admin/location-suggestions');

        $response->assertOk();
    }

    public function test_super_admin_can_approve_suggestion_and_attach_material_types(): void
    {
        $admin = $this->createSuperAdmin();

        $plastic = MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $paper = MaterialType::factory()->create([
            'name' => 'Paper',
            'slug' => 'paper',
        ]);

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'pending',
            'location_name' => 'Green Earth Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Metro Manila',
            'state_code' => 'NCR',
            'city_municipality' => 'Quezon City',
            'region' => 'National Capital Region',
            'street_address' => '123 Eco St.',
            'postal_code' => '1100',
            'latitude' => 14.6760,
            'longitude' => 121.0437,
            'contact_number' => '09171234567',
            'location_email' => 'greenearth@example.com',
            'operating_hours' => '8:00 AM - 5:00 PM',
            'notes' => 'Accepts recyclable materials',
            'is_active' => true,
            'materials_accepted' => json_encode(['Plastic', 'Paper']),
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/approve");

        $response->assertOk()
            ->assertJson([
                'message' => 'Location suggestion approved successfully.',
                'data' => [
                    'id' => $suggestion->id,
                    'status' => 'approved',
                ],
            ]);

        $suggestion->refresh();

        $this->assertEquals('approved', $suggestion->status);
        $this->assertNotNull($suggestion->approved_at);
        $this->assertEquals($admin->id, $suggestion->approved_by);
        $this->assertNotNull($suggestion->waste_collection_location_id);

        $location = WasteCollectionLocation::find($suggestion->waste_collection_location_id);

        $this->assertNotNull($location);

        $this->assertDatabaseHas('location_material_type', [
            'waste_collection_location_id' => $location->id,
            'material_type_id' => $plastic->id,
        ]);

        $this->assertDatabaseHas('location_material_type', [
            'waste_collection_location_id' => $location->id,
            'material_type_id' => $paper->id,
        ]);
    }

    public function test_approval_fails_when_one_material_does_not_exist(): void
    {
        $admin = $this->createSuperAdmin();

        MaterialType::factory()->create([
            'name' => 'Plastic',
            'slug' => 'plastic',
        ]);

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'pending',
            'location_name' => 'Green Earth Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Metro Manila',
            'state_code' => 'NCR',
            'city_municipality' => 'Quezon City',
            'region' => 'National Capital Region',
            'street_address' => '123 Eco St.',
            'postal_code' => '1100',
            'latitude' => 14.6760,
            'longitude' => 121.0437,
            'contact_number' => '09171234567',
            'location_email' => 'greenearth@example.com',
            'operating_hours' => '8:00 AM - 5:00 PM',
            'notes' => 'Accepts recyclable materials',
            'is_active' => true,
            'materials_accepted' => json_encode(['Plastic', 'Unknown Material']),
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/approve");

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Some suggested materials do not match official material types. Please review before approval.',
            ]);

        $suggestion->refresh();

        $this->assertEquals('pending', $suggestion->status);
        $this->assertNull($suggestion->approved_at);
        $this->assertNull($suggestion->approved_by);
        $this->assertNull($suggestion->waste_collection_location_id);

        $this->assertDatabaseMissing('waste_collection_locations', [
            'name' => 'Green Earth Recycling Center',
        ]);
    }

    public function test_suggestion_remains_pending_when_material_mapping_fails(): void
    {
        $admin = $this->createSuperAdmin();

        $suggestion = LocationSuggestion::factory()->create([
            'status' => 'pending',
            'location_name' => 'Eco Dropoff Hub',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Metro Manila',
            'state_code' => 'NCR',
            'city_municipality' => 'Pasig',
            'region' => 'National Capital Region',
            'street_address' => '456 Recycle Ave.',
            'postal_code' => '1600',
            'latitude' => 14.5764,
            'longitude' => 121.0851,
            'contact_number' => '09981234567',
            'location_email' => 'ecohub@example.com',
            'operating_hours' => '9:00 AM - 6:00 PM',
            'notes' => 'Community dropoff point',
            'is_active' => true,
            'materials_accepted' => json_encode(['Nonexistent Material']),
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/location-suggestions/{$suggestion->id}/approve");

        $response->assertStatus(422);

        $suggestion->refresh();

        $this->assertEquals('pending', $suggestion->status);
        $this->assertNull($suggestion->approved_at);
        $this->assertNull($suggestion->approved_by);
        $this->assertNull($suggestion->waste_collection_location_id);

        $this->assertDatabaseCount('waste_collection_locations', 0);
        $this->assertDatabaseCount('location_material_type', 0);
    }
}