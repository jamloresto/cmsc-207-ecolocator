<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContactMessageControllerTest extends TestCase
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

    protected function createRegularUser(): User
    {
        return User::factory()->create([
            'role' => 'user',
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

    public function test_non_admin_user_cannot_access_admin_contact_messages(): void
    {
        $user = $this->createRegularUser();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/admin/contact-messages');

        $response->assertForbidden();
    }
}