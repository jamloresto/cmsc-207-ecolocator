<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WasteCollectionLocationFactory extends Factory
{
    public function definition(): array
    {
        $city = fake()->city();

        return [
            'name' => fake()->company() . ' Recycling Center',
            'country_code' => 'PH',
            'country_name' => 'Philippines',
            'state_province' => 'Davao del Sur',
            'state_code' => 'DVO',
            'city_municipality' => $city,
            'city_slug' => Str::slug($city),
            'region' => 'Region XI',
            'street_address' => fake()->streetAddress(),
            'postal_code' => fake()->postcode(),
            'latitude' => 7.0707,
            'longitude' => 125.6087,
            'contact_number' => '09171234567',
            'email' => fake()->safeEmail(),
            'operating_hours' => 'Mon-Fri 8:00 AM - 5:00 PM',
            'notes' => fake()->sentence(),
            'is_active' => true,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}