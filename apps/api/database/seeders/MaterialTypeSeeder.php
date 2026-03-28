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
                'name' => 'Paper & Cardboard',
                'description' => 'Office paper, newspapers, cartons, corrugated boxes, cardboard, and similar paper-based recyclables.',
            ],
            [
                'name' => 'Plastic',
                'description' => 'Plastic bottles, packaging, containers, styrofoam, polystyrene, and other plastic materials.',
            ],
            [
                'name' => 'Rubber & Tires',
                'description' => 'Used tires and other rubber materials for recycling, retreading, or reprocessing.',
            ],
            [
                'name' => 'Ink Cartridges',
                'description' => 'Used printer ink and toner cartridges for recycling or proper disposal.',
            ],
            [
                'name' => 'Wood & Lumber',
                'description' => 'Secondhand wood, lumber, plywood, and other reusable or recyclable wood materials.',
            ],
            [
                'name' => 'Oils & Hazardous Waste',
                'description' => 'Used oils, chemicals, solvents, and hazardous waste requiring special handling and disposal.',
            ],
            [
                'name' => 'Industrial Waste',
                'description' => 'Bulk industrial and manufacturing waste including scrap materials, production by-products, and surplus resources.',
            ],
            [
                'name' => 'Construction & Mineral Waste',
                'description' => 'Construction-related waste such as scrap marble chips, concrete debris, sand, gravel, and similar materials.',
            ],
            [
                'name' => 'Organic Waste',
                'description' => 'Biodegradable waste such as food scraps, leaves, yard waste, and compostable materials.',
            ],
            [
                'name' => 'Textiles',
                'description' => 'Old clothes, fabrics, garments, and other textile materials for recycling or reuse.',
            ],
            [
                'name' => 'Manufacturing By-products',
                'description' => 'Industrial by-products such as scrap detergent bars, saw dust, and similar residual materials from production processes.',
            ],
            [
                'name' => 'Mixed Recyclables',
                'description' => 'Facilities that accept multiple recyclable material types in one location.',
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