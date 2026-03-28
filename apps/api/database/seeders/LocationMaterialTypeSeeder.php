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
                'batteries' => [
                    'battery', 'batteries', 'lead-acid', 'dry cell'
                ],

                'metals' => [
                    'metal', 'metals', 'aluminum', 'aluminium', 'steel', 'iron',
                    'copper', 'bronze', 'scrap metal', 'tin', 'can', 'cans',
                    'sheet metal', 'alloy'
                ],

                'electronics' => [
                    'electronics', 'electronic', 'e-waste', 'ewaste',
                    'computer', 'laptop', 'phone', 'mobile', 'charger',
                    'circuit', 'pcb', 'printer', 'monitor'
                ],

                'appliances' => [
                    'appliance', 'appliances', 'refrigerator', 'fridge',
                    'washing machine', 'aircon', 'air conditioner'
                ],

                'glass' => [
                    'glass', 'bottle', 'bottles', 'jar', 'jars',
                    'basag', 'bubog'
                ],

                'paper-cardboard' => [
                    'paper', 'papers', 'cardboard', 'carton', 'cartons',
                    'box', 'boxes', 'newspaper', 'magazine', 'corrugated'
                ],

                'plastic' => [
                    'plastic', 'plastics', 'pet', 'pet bottle',
                    'polystyrene', 'styrofoam', 'polyethylene',
                    'polypropylene', 'packaging'
                ],

                'rubber-tires' => [
                    'tire', 'tires', 'rubber', 'rubberized'
                ],

                'ink-cartridges' => [
                    'ink', 'cartridge', 'cartridges', 'toner', 'printer ink'
                ],

                'wood-lumber' => [
                    'wood', 'lumber', 'plywood', 'timber'
                ],

                'construction-mineral-waste' => [
                    'marble', 'marble chips', 'concrete', 'sand',
                    'gravel', 'construction', 'cement', 'tiles'
                ],

                'manufacturing-by-products' => [
                    'sawdust', 'scrap detergent', 'detergent bars',
                    'industrial by-product', 'residue'
                ],

                'oils-hazardous-waste' => [
                    'oil', 'used oil', 'hazardous', 'chemical',
                    'solvent', 'toxic', 'battery acid'
                ],

                'industrial-waste' => [
                    'industrial', 'factory waste', 'manufacturing waste',
                    'bulk waste'
                ],

                'mixed-recyclables' => [
                    'all materials', 'mixed', 'mixed recyclables',
                    'segregated', 'all types', 'various materials'
                ],

                'textiles' => [
                    'fabric', 'textile', 'clothes', 'clothing',
                    'garments', 'rags'
                ],

                'organic-waste' => [
                    'organic', 'biodegradable', 'compost',
                    'food waste', 'yard waste'
                ],
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