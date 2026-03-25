<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaterialType;
use Illuminate\Support\Str;

class MaterialTypeSeeder extends Seeder
{
    public function run(): void
    {
        $materials = [
            [
                'name' => 'Batteries',
                'description' => 'Used household and industrial batteries including rechargeable and single-use batteries.',
            ],
            [
                'name' => 'Cans & aluminium',
                'description' => 'Aluminum cans and similar recyclable aluminium materials.',
            ],
            [
                'name' => 'Electronics',
                'description' => 'Old gadgets and electronic devices such as phones, chargers, and appliances.',
            ],
            [
                'name' => 'Glass',
                'description' => 'Glass bottles, jars, and other recyclable glass materials.',
            ],
            [
                'name' => 'Paper & cardboard',
                'description' => 'Newspapers, cartons, cardboard boxes, and office paper.',
            ],
            [
                'name' => 'Plastic',
                'description' => 'Plastic bottles, containers, packaging, and similar plastic waste.',
            ],
            [
                'name' => 'Organic waste',
                'description' => 'Biodegradable waste such as food scraps, leaves, and garden waste.',
            ],
            [
                'name' => 'Oils & hazardous waste',
                'description' => 'Used oils, chemicals, and other hazardous waste requiring proper disposal.',
            ],
            [
                'name' => 'Scrap metal',
                'description' => 'Metal scraps including steel, iron, and mixed recyclable metals.',
            ],
            [
                'name' => 'Textiles',
                'description' => 'Old clothes, fabrics, and other textile materials for recycling or reuse.',
            ],
        ];

        foreach ($materials as $material) {
            MaterialType::updateOrCreate(
                ['slug' => Str::slug($material['name'])],
                [
                    'name' => $material['name'],
                    'slug' => Str::slug($material['name']),
                    'description' => $material['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}