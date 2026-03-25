<?php

namespace Database\Factories;

use App\Models\LocationSuggestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LocationSuggestion>
 */
class LocationSuggestionFactory extends Factory
{
    protected $model = LocationSuggestion::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'contact_info' => fake()->phoneNumber(),

            'location_name' => fake()->company() . ' Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Metro Manila',
            'state_code' => 'NCR',
            'city_municipality' => fake()->city(),
            'region' => 'National Capital Region',
            'street_address' => fake()->streetAddress(),
            'address' => fake()->address(),
            'province' => 'Metro Manila',
            'postal_code' => fake()->postcode(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'contact_number' => fake()->phoneNumber(),
            'location_email' => fake()->safeEmail(),
            'operating_hours' => 'Mon-Fri 8AM-5PM',
            'materials_accepted' => 'Plastic, paper, e-waste',
            'notes' => fake()->sentence(),
            'review_notes' => null,
            'status' => 'pending',
            'reviewed_at' => null,
            'approved_at' => null,
            'rejected_at' => null,
            'approved_by' => null,
            'rejected_by' => null,
            'waste_collection_location_id' => null,
            'is_active' => true,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    public function approvable(): static
    {
        return $this->state(fn (array $attributes) => [
            'location_name' => 'Approved Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Metro Manila',
            'state_code' => 'NCR',
            'city_municipality' => 'Pasay City',
            'region' => 'National Capital Region',
            'street_address' => '123 Mabini Street',
            'address' => '123 Mabini Street, Pasay City, Metro Manila',
            'province' => 'Metro Manila',
            'postal_code' => '1300',
            'latitude' => 14.5378,
            'longitude' => 120.9991,
            'contact_number' => '09171234567',
            'location_email' => 'location@example.com',
            'operating_hours' => 'Mon-Fri 8AM-5PM',
            'materials_accepted' => 'Plastic, paper, e-waste',
            'notes' => 'Open for recyclable drop-offs.',
            'is_active' => true,
            'status' => 'pending',
        ]);
    }
}