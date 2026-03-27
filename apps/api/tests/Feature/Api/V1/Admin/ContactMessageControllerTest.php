<?php

namespace Tests\Feature\Api\V1\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageControllerTest extends TestCase
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

    public function test_admin_can_list_contact_messages(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->count(3)->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages');

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

    public function test_admin_can_filter_contact_messages_by_status(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create(['status' => 'new']);
        ContactMessage::factory()->create(['status' => 'read']);
        ContactMessage::factory()->create(['status' => 'replied']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?status=read');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'status' => 'read',
            ]);
    }

    public function test_admin_can_view_single_contact_message(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create([
            'status' => 'new',
            'read_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $message->id);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'read',
        ]);
    }

    public function test_admin_can_update_contact_message_status(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create([
            'status' => 'new',
            'replied_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/contact-messages/{$message->id}/status", [
                'status' => 'replied',
            ]);

        $response->assertOk()
            ->assertJson([
                'message' => 'Contact message status updated successfully.',
                'data' => [
                    'id' => $message->id,
                    'status' => 'replied',
                ],
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'replied',
        ]);
    }

    public function test_admin_cannot_update_contact_message_status_with_invalid_value(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/contact-messages/{$message->id}/status", [
                'status' => 'invalid-status',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_admin_can_delete_contact_message(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertOk()
            ->assertJson([
                'message' => 'Contact message deleted successfully.',
            ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_admin_contact_messages(): void
    {
        $response = $this->getJson('/api/v1/admin/contact-messages');

        $response->assertUnauthorized();
    }

    public function test_editor_can_access_admin_contact_messages_if_allowed_by_middleware(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages');

        $response->assertOk();
    }

    public function test_super_admin_can_search_contact_messages_by_name(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'subject' => 'Plastic recycling',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'subject' => 'E-waste inquiry',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?search=Juan');

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Juan Dela Cruz'])
            ->assertJsonMissing(['name' => 'Maria Santos']);
    }

    public function test_super_admin_can_search_contact_messages_by_email(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'subject' => 'Plastic recycling',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'subject' => 'E-waste inquiry',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?search=maria@example.com');

        $response->assertOk()
            ->assertJsonFragment(['email' => 'maria@example.com'])
            ->assertJsonMissing(['email' => 'juan@example.com']);
    }

    public function test_super_admin_can_search_contact_messages_by_subject(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'subject' => 'Plastic recycling schedule',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'subject' => 'General inquiry',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?search=Plastic');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Plastic recycling schedule'])
            ->assertJsonMissing(['subject' => 'General inquiry']);
    }

    public function test_super_admin_can_filter_contact_messages_by_status(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'status' => 'new',
            'subject' => 'New message',
        ]);

        ContactMessage::factory()->create([
            'status' => 'read',
            'subject' => 'Read message',
        ]);

        ContactMessage::factory()->create([
            'status' => 'replied',
            'subject' => 'Replied message',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?status=read');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Read message'])
            ->assertJsonMissing(['subject' => 'New message'])
            ->assertJsonMissing(['subject' => 'Replied message']);
    }

    public function test_super_admin_can_filter_contact_messages_by_date_range(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'subject' => 'Old message',
            'created_at' => '2026-03-01 10:00:00',
        ]);

        ContactMessage::factory()->create([
            'subject' => 'Included message',
            'created_at' => '2026-03-15 10:00:00',
        ]);

        ContactMessage::factory()->create([
            'subject' => 'Later message',
            'created_at' => '2026-04-01 10:00:00',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?date_from=2026-03-10&date_to=2026-03-31');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Included message'])
            ->assertJsonMissing(['subject' => 'Old message'])
            ->assertJsonMissing(['subject' => 'Later message']);
    }

    public function test_super_admin_can_sort_contact_messages_by_name_ascending(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'name' => 'Zara',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Anna',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Mark',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?sort_by=name&sort_order=asc');

        $response->assertOk();

        $names = array_column($response->json('data'), 'name');

        $this->assertSame(['Anna', 'Mark', 'Zara'], $names);
    }

    public function test_super_admin_can_sort_contact_messages_by_name_descending(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'name' => 'Zara',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Anna',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Mark',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?sort_by=name&sort_order=desc');

        $response->assertOk();

        $names = array_column($response->json('data'), 'name');

        $this->assertSame(['Zara', 'Mark', 'Anna'], $names);
    }

    public function test_editor_can_access_contact_messages_index(): void
    {
        $editor = $this->createEditor();

        ContactMessage::factory()->count(2)->create();

        $response = $this->actingAs($editor, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages');

        $response->assertOk();
    }
}