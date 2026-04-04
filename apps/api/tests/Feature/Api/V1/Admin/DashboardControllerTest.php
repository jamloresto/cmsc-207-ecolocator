<?php

namespace Tests\Feature\Api\V1\Admin;

use App\Models\User;
use App\Models\ContactMessage;
use App\Models\LocationSuggestion;
use App\Models\MaterialType;
use App\Models\WasteCollectionLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function createEditor(): User
    {
        return User::factory()->create([
            'role' => 'editor',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_get_dashboard_stats(): void
    {
        $admin = $this->createEditor();

        WasteCollectionLocation::factory()->count(3)->create();
        MaterialType::factory()->count(2)->create(['is_active' => true]);
        MaterialType::factory()->create(['is_active' => false]);
        LocationSuggestion::factory()->count(4)->create(['status' => 'pending']);
        LocationSuggestion::factory()->create(['status' => 'approved']);
        ContactMessage::factory()->count(5)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard/stats');

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'recycling_centers_count' => 3,
                    'material_types_count' => 2,
                    'pending_location_suggestions_count' => 4,
                    'unread_contact_messages_count' => 5,
                    'contact_messages_this_month_count' => 7,
                ],
            ]);
    }

    public function test_guest_cannot_get_dashboard_stats(): void
    {
        $this->getJson('/api/v1/admin/dashboard/stats')
            ->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
    }
}