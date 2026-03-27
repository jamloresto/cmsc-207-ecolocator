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
                'description' => 'Used household, automotive, and industrial batteries including rechargeable and single-use batteries.',
            ],
            [
                'name' => 'Metals',
                'description' => 'Recyclable metal materials such as aluminum cans, steel, iron, copper, bronze, and mixed scrap metals.',
            ],
            [
                'name' => 'Electronics',
                'description' => 'Old electronic devices and components such as phones, chargers, computers, and other e-waste.',
            ],
            [
                'name' => 'Appliances',
                'description' => 'Household and commercial appliances such as refrigerators, washing machines, air conditioners, and similar items.',
            ],
            [
                'name' => 'Glass',
                'description' => 'Glass bottles, jars, flat glass, container glass, and other recyclable glass materials.',
            ],
            [
                'name' => 'Paper & cardboard',
                'description' => 'Office paper, newspapers, cartons, corrugated boxes, cardboard, and similar paper-based recyclables.',
            ],
            [
                'name' => 'Plastic',
                'description' => 'Plastic bottles, packaging, containers, styrofoam, polystyrene, and other plastic materials.',
            ],
            [
                'name' => 'Rubber & tires',
                'description' => 'Used tires and other rubber materials for recycling, retreading, or reprocessing.',
            ],
            [
                'name' => 'Ink cartridges',
                'description' => 'Used printer ink and toner cartridges for recycling or proper disposal.',
            ],
            [
                'name' => 'Wood & lumber',
                'description' => 'Secondhand wood, lumber, and other reusable or recyclable wood materials.',
            ],
            [
                'name' => 'Oils & hazardous waste',
                'description' => 'Used oils, chemicals, and other hazardous waste that require special handling and disposal.',
            ],
            [
                'name' => 'Industrial waste',
                'description' => 'Bulk, industrial, or manufacturing-related recyclable waste and surplus materials.',
            ],
            [
                'name' => 'Mixed recyclables',
                'description' => 'Facilities that accept multiple recyclable material types in one location.',
            ],
            [
                'name' => 'Textiles',
                'description' => 'Old clothes, fabrics, garments, and other textile materials for recycling or reuse.',
            ],
            [
                'name' => 'Organic waste',
                'description' => 'Biodegradable waste such as food scraps, leaves, yard waste, and other compostable materials.',
            ],
        ];

        foreach ($materials as $material) {
            $slug = Str::slug($material['name']);

            MaterialType::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $material['name'],
                    'slug' => $slug,
                    'description' => $material['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}