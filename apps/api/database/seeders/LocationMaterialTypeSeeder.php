<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WasteCollectionLocation;
use App\Models\MaterialType;

class LocationMaterialTypeSeeder extends Seeder
{
    public function run(): void
    {
        $materials = MaterialType::all()->keyBy('slug');

        $locations = WasteCollectionLocation::all();

        foreach ($locations as $location) {
            $notes = strtolower($location->notes ?? '');

            $matchedMaterialIds = [];

            $mapping = [
                'batteries' => ['battery'],
                'metals' => ['metal', 'aluminum', 'steel', 'copper', 'bronze', 'iron', 'solder'],
                'electronics' => ['electronics', 'computer', 'e-waste'],
                'appliances' => ['appliance'],
                'glass' => ['glass'],
                'paper-cardboard' => ['paper', 'carton', 'box'],
                'plastic' => ['plastic', 'polystyrene', 'styrofoam'],
                'rubber-tires' => ['tire', 'rubber'],
                'ink-cartridges' => ['ink'],
                'wood-lumber' => ['lumber', 'wood'],
                'oils-hazardous-waste' => ['oil', 'hazardous'],
                'industrial-waste' => ['industrial'],
                'mixed-recyclables' => ['all materials', 'mixed', 'segregated', 'all types'],
                'textiles' => ['fabric', 'textile'],
            ];

            foreach ($mapping as $slug => $keywords) {
                foreach ($keywords as $keyword) {
                    if (str_contains($notes, $keyword)) {
                        if (isset($materials[$slug])) {
                            $matchedMaterialIds[] = $materials[$slug]->id;
                        }
                        break;
                    }
                }
            }

            if (str_contains($notes, 'all')) {
                $matchedMaterialIds = $materials
                    ->filter(fn ($m) => $m->slug !== 'organic-waste')
                    ->pluck('id')
                    ->toArray();
            }

            // Remove duplicates
            $matchedMaterialIds = array_unique($matchedMaterialIds);

            // Attach pivot
            if (!empty($matchedMaterialIds)) {
                $location->materialTypes()->syncWithoutDetaching($matchedMaterialIds);
            }
        }

        $this->command->info('✅ Location ↔ Material mapping completed.');
    }
}