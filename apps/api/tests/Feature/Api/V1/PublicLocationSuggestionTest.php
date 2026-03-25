<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicLocationSuggestionTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_submit_location_suggestion(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'contact_info' => '09171234567',
            'location_name' => 'Barangay Green Recycling Center',
            'address' => '123 Mabini Street, Barangay San Isidro',
            'city_municipality' => 'Pasay City',
            'province' => 'Metro Manila',
            'postal_code' => '1300',
            'latitude' => 14.5378,
            'longitude' => 121.0014,
            'materials_accepted' => 'Plastic, paper, e-waste',
            'notes' => 'Open every Saturday morning.',
        ];

        $response = $this->postJson('/api/v1/location-suggestions', $payload);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Location suggestion submitted successfully.',
                'data' => [
                    'name' => 'Juan Dela Cruz',
                    'email' => 'juan@example.com',
                    'contact_info' => '09171234567',
                    'location_name' => 'Barangay Green Recycling Center',
                    'address' => '123 Mabini Street, Barangay San Isidro',
                    'city_municipality' => 'Pasay City',
                    'province' => 'Metro Manila',
                    'postal_code' => '1300',
                    'materials_accepted' => 'Plastic, paper, e-waste',
                    'notes' => 'Open every Saturday morning.',
                    'status' => 'pending',
                ],
            ]);

        $this->assertDatabaseHas('location_suggestions', [
            'email' => 'juan@example.com',
            'location_name' => 'Barangay Green Recycling Center',
            'status' => 'pending',
        ]);
    }

    public function test_public_submission_requires_required_fields(): void
    {
        $response = $this->postJson('/api/v1/location-suggestions', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'location_name',
                'address',
                'city_municipality',
                'province',
            ]);
    }

    public function test_public_submission_requires_valid_email(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'not-an-email',
            'location_name' => 'Barangay Green Recycling Center',
            'address' => '123 Mabini Street',
            'city_municipality' => 'Pasay City',
            'province' => 'Metro Manila',
        ];

        $response = $this->postJson('/api/v1/location-suggestions', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_public_submission_validates_latitude_and_longitude(): void
    {
        $payload = [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'location_name' => 'Barangay Green Recycling Center',
            'address' => '123 Mabini Street',
            'city_municipality' => 'Pasay City',
            'province' => 'Metro Manila',
            'latitude' => 999,
            'longitude' => 999,
        ];

        $response = $this->postJson('/api/v1/location-suggestions', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'latitude',
                'longitude',
            ]);
    }
}