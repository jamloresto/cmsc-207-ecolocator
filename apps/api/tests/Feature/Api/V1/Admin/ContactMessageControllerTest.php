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

    public function test_admin_can_archive_contact_message(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create([
            'status' => 'new',
            'read_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/contact-messages/{$message->id}/archive");

        $response->assertOk()
            ->assertJson([
                'message' => 'Contact message archived successfully.',
                'data' => [
                    'id' => $message->id,
                    'status' => 'archived',
                ],
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'archived',
        ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
            'read_at' => null,
        ]);
    }

    public function test_admin_can_reply_to_contact_message(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create([
            'status' => 'new',
            'read_at' => null,
            'replied_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/contact-messages/{$message->id}/reply", [
                'reply_message' => 'Thank you for contacting us.',
            ]);

        $response->assertOk()
            ->assertJson([
                'message' => 'Reply sent successfully.',
                'data' => [
                    'id' => $message->id,
                    'status' => 'replied',
                ],
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'replied',
        ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
            'read_at' => null,
        ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
            'replied_at' => null,
        ]);
    }

    public function test_admin_cannot_reply_without_reply_message(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/contact-messages/{$message->id}/reply", []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['reply_message']);
    }

    public function test_unauthenticated_user_cannot_access_admin_contact_messages(): void
    {
        $response = $this->getJson('/api/v1/admin/contact-messages');

        $response->assertForbidden()
        ->assertJson([
            'message' => 'Unauthorized.',
        ]);
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

        ContactMessage::factory()->create(['name' => 'Zara']);
        ContactMessage::factory()->create(['name' => 'Anna']);
        ContactMessage::factory()->create(['name' => 'Mark']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?sort_by=name&sort_order=asc');

        $response->assertOk();

        $names = array_column($response->json('data'), 'name');

        $this->assertSame(['Anna', 'Mark', 'Zara'], $names);
    }

    public function test_super_admin_can_sort_contact_messages_by_name_descending(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create(['name' => 'Zara']);
        ContactMessage::factory()->create(['name' => 'Anna']);
        ContactMessage::factory()->create(['name' => 'Mark']);

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

    public function test_show_sets_read_at_but_preserves_non_new_status(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create([
            'status' => 'replied',
            'read_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertOk()
            ->assertJsonPath('data.status', 'replied');

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'replied',
        ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
            'read_at' => null,
        ]);
    }

    public function test_show_does_not_change_already_read_message(): void
    {
        $admin = $this->createSuperAdmin();

        $readAt = now()->subDay();

        $message = ContactMessage::factory()->create([
            'status' => 'read',
            'read_at' => $readAt,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertOk()
            ->assertJsonPath('data.status', 'read');

        $message->refresh();

        $this->assertNotNull($message->read_at);
        $this->assertEquals('read', $message->status);
    }

    public function test_archive_preserves_existing_read_at(): void
    {
        $admin = $this->createSuperAdmin();

        $readAt = now()->subHours(5);

        $message = ContactMessage::factory()->create([
            'status' => 'read',
            'read_at' => $readAt,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/contact-messages/{$message->id}/archive")
            ->assertOk();

        $message->refresh();

        $this->assertSame('archived', $message->status);
        $this->assertEquals(
            $readAt->toDateTimeString(),
            $message->read_at->toDateTimeString()
        );
    }

    public function test_reply_preserves_existing_replied_at(): void
    {
        $admin = $this->createSuperAdmin();

        $repliedAt = now()->subDay();

        $message = ContactMessage::factory()->create([
            'status' => 'read',
            'read_at' => now()->subDays(2),
            'replied_at' => $repliedAt,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/contact-messages/{$message->id}/reply", [
                'reply_message' => 'Following up.',
            ])
            ->assertOk();

        $message->refresh();

        $this->assertSame('replied', $message->status);
        $this->assertEquals(
            $repliedAt->toDateTimeString(),
            $message->replied_at->toDateTimeString()
        );
    }

    public function test_reply_sets_read_at_when_message_is_unread(): void
    {
        $admin = $this->createSuperAdmin();

        $message = ContactMessage::factory()->create([
            'status' => 'new',
            'read_at' => null,
            'replied_at' => null,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/contact-messages/{$message->id}/reply", [
                'reply_message' => 'Thank you.',
            ])
            ->assertOk();

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'replied',
        ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
            'read_at' => null,
        ]);
    }

    public function test_invalid_sort_by_falls_back_to_created_at_desc(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'subject' => 'Oldest',
            'created_at' => '2026-03-01 10:00:00',
        ]);

        ContactMessage::factory()->create([
            'subject' => 'Newest',
            'created_at' => '2026-03-03 10:00:00',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?sort_by=invalid_field');

        $response->assertOk();

        $subjects = array_column($response->json('data'), 'subject');

        $this->assertSame(['Newest', 'Oldest'], array_slice($subjects, 0, 2));
    }

    public function test_invalid_sort_order_falls_back_to_desc(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create(['name' => 'Anna']);
        ContactMessage::factory()->create(['name' => 'Zara']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?sort_by=name&sort_order=invalid');

        $response->assertOk();

        $names = array_column($response->json('data'), 'name');

        $this->assertSame(['Zara', 'Anna'], array_slice($names, 0, 2));
    }

    public function test_admin_can_paginate_contact_messages_with_per_page(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->count(15)->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?per_page=5');

        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('per_page', 5)
            ->assertJsonPath('total', 15);
    }

    public function test_admin_can_combine_search_status_and_date_filters(): void
    {
        $admin = $this->createSuperAdmin();

        ContactMessage::factory()->create([
            'name' => 'Juan Dela Cruz',
            'subject' => 'Plastic recycling',
            'status' => 'read',
            'created_at' => '2026-03-15 10:00:00',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Juan Dela Cruz',
            'subject' => 'Plastic recycling',
            'status' => 'new',
            'created_at' => '2026-03-15 10:00:00',
        ]);

        ContactMessage::factory()->create([
            'name' => 'Juan Dela Cruz',
            'subject' => 'Plastic recycling',
            'status' => 'read',
            'created_at' => '2026-04-15 10:00:00',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages?search=Juan&status=read&date_from=2026-03-01&date_to=2026-03-31');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'status' => 'read',
                'name' => 'Juan Dela Cruz',
            ]);
    }

    public function test_admin_gets_404_when_viewing_missing_contact_message(): void
    {
        $admin = $this->createSuperAdmin();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages/999999')
            ->assertNotFound();
    }
}