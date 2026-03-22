<?php

namespace Database\Seeders;

use App\Models\MaterialType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MaterialTypeSeeder extends Seeder
{
    public function run(): void
    {
        $materials = [
            'Batteries',
            'Cans & aluminium',
            'Electronics',
            'Glass',
            'Paper & cardboard',
            'Plastic',
            'Organic waste',
            'Oils & hazardous waste',
            'Scrap metal',
            'Textiles',
        ];

        foreach ($materials as $material) {
            MaterialType::updateOrCreate(
                ['slug' => Str::slug($material)],
                [
                    'name' => $material,
                    'description' => null,
                    'is_active' => true,
                ]
            );
        }
    }
}