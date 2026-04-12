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
                'icon' => 'Battery',
            ],
            [
                'name' => 'Metals',
                'description' => 'Recyclable metal materials such as aluminum cans, steel, iron, copper, bronze, and mixed scrap metals.',
                'icon' => 'Cuboid',
            ],
            [
                'name' => 'Electronics',
                'description' => 'Old electronic devices and components such as phones, chargers, computers, and other e-waste.',
                'icon' => 'MonitorSmartphone',
            ],
            [
                'name' => 'Appliances',
                'description' => 'Household and commercial appliances such as refrigerators, washing machines, air conditioners, and similar items.',
                'icon' => 'TV',
            ],
            [
                'name' => 'Glass',
                'description' => 'Glass bottles, jars, flat glass, container glass, and other recyclable glass materials.',
                'icon' => 'Bottle',
            ],
            [
                'name' => 'Paper & Cardboard',
                'description' => 'Office paper, newspapers, cartons, corrugated boxes, cardboard, and similar paper-based recyclables.',
                'icon' => 'Newspaper',
            ],
            [
                'name' => 'Plastic',
                'description' => 'Plastic bottles, packaging, containers, styrofoam, polystyrene, and other plastic materials.',
                'icon' => 'Recycle',
            ],
            [
                'name' => 'Rubber & Tires',
                'description' => 'Used tires and other rubber materials for recycling, retreading, or reprocessing.',
                'icon' => 'CircleDashed',
            ],
            [
                'name' => 'Ink Cartridges',
                'description' => 'Used printer ink and toner cartridges for recycling or proper disposal.',
                'icon' => 'PaintBucket',
            ],
            [
                'name' => 'Wood & Lumber',
                'description' => 'Secondhand wood, lumber, plywood, and other reusable or recyclable wood materials.',
                'icon' => 'Fence',
            ],
            [
                'name' => 'Oils & Hazardous Waste',
                'description' => 'Used oils, chemicals, solvents, and hazardous waste requiring special handling and disposal.',
                'icon' => 'Radiation',
            ],
            [
                'name' => 'Industrial Waste',
                'description' => 'Bulk industrial and manufacturing waste including scrap materials, production by-products, and surplus resources.',
                'icon' => 'Factory',
            ],
            [
                'name' => 'Construction & Mineral Waste',
                'description' => 'Construction-related waste such as scrap marble chips, concrete debris, sand, gravel, and similar materials.',
                'icon' => 'Stone',
            ],
            [
                'name' => 'Organic Waste',
                'description' => 'Biodegradable waste such as food scraps, leaves, yard waste, and compostable materials.',
                'icon' => 'Leaf',
            ],
            [
                'name' => 'Textiles',
                'description' => 'Old clothes, fabrics, garments, and other textile materials for recycling or reuse.',
                'icon' => 'Shirt',
            ],
            [
                'name' => 'Manufacturing By-products',
                'description' => 'Industrial by-products such as scrap detergent bars, saw dust, and similar residual materials from production processes.',
                'icon' => 'Building2',
            ],
            [
                'name' => 'Mixed Recyclables',
                'description' => 'Facilities that accept multiple recyclable material types in one location.',
                'icon' => 'Shapes',
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
                    'icon' => $material['icon'],
                    'is_active' => true,
                ]
            );
        }
    }
}