<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MaterialTypeFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Plastic',
            'Glass',
            'Paper & cardboard',
            'Batteries',
            'Electronics',
            'Scrap metal',
            'Textiles',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}