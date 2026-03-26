<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicRateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_endpoint_is_rate_limited(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'contact_info' => '+639171234567',
            'subject' => 'Inquiry about recycling center',
            'message' => 'Hello, I would like to ask about the nearest e-waste drop-off center.',
        ];

        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/v1/contact-messages', $payload);
            $response->assertStatus(201);
        }

        $response = $this->postJson('/api/v1/contact-messages', $payload);

        $response->assertStatus(429);
    }

    public function test_location_suggestions_endpoint_is_rate_limited(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'contact_info' => '+639171234567',
            'location_name' => 'Green Earth Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Metro Manila',
            'state_code' => 'NCR',
            'city_municipality' => 'Quezon City',
            'region' => 'National Capital Region',
            'street_address' => '123 Sample Street',
            'address' => '123 Sample Street, Quezon City, Metro Manila, Philippines',
            'province' => 'Metro Manila',
            'postal_code' => '1100',
            'latitude' => 14.6760,
            'longitude' => 121.0437,
            'contact_number' => '+639171234567',
            'materials_accepted' => 'plastic, paper',
            'notes' => 'Open during weekdays only.',
        ];

        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/v1/location-suggestions', $payload);
            $response->assertStatus(201);
        }

        $response = $this->postJson('/api/v1/location-suggestions', $payload);

        $response->assertStatus(429);
    }
}