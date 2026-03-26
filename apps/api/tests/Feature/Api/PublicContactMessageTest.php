<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_submit_contact_message(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'contact_info' => '09171234567',
            'subject' => 'Inquiry about recycling center',
            'message' => 'I would like to ask about the nearest recycling center.',
        ];

        $response = $this->postJson('/api/v1/contact-messages', $payload);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Contact message submitted successfully.',
                'data' => [
                    'name' => 'Juan Dela Cruz',
                    'email' => 'juan@example.com',
                    'contact_info' => '09171234567',
                    'subject' => 'Inquiry about recycling center',
                    'message' => 'I would like to ask about the nearest recycling center.',
                    'status' => 'new',
                ],
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'subject' => 'Inquiry about recycling center',
            'status' => 'new',
        ]);
    }

    public function test_public_submission_requires_required_fields(): void
    {
        $response = $this->postJson('/api/v1/contact-messages', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'subject',
                'message',
            ]);
    }

    public function test_public_submission_requires_valid_email(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'not-an-email',
            'contact_info' => '09123456789',
            'subject' => 'Inquiry',
            'message' => 'Test message',
        ];

        $response = $this->postJson('/api/v1/contact-messages', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }
}