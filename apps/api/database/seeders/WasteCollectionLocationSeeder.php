<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WasteCollectionLocation;

class WasteCollectionLocationSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/locations.csv');

        if (!file_exists($path)) {
            $this->command->error('CSV file not found.');
            return;
        }

        $file = fopen($path, 'r');

        $headers = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {
            $data = array_combine($headers, $row);

            WasteCollectionLocation::updateOrCreate(
                [
                    'name' => $data['name'],
                    'city_municipality' => $data['city_municipality'],
                ],
                [
                    'country_code' => $data['country_code'],
                    'country_name' => $data['country_name'],
                    'state_province' => $data['state_province'],
                    'state_code' => $data['state_code'],
                    'city_slug' => $data['city_slug'],
                    'region' => $data['region'],
                    'street_address' => $data['street_address'],
                    'postal_code' => $data['postal_code'] ?: null,
                    'latitude' => $data['latitude'] ?: 0,
                    'longitude' => $data['longitude'] ?: 0,
                    'contact_number' => $data['contact_number'],
                    'email' => $data['email'] ?: null,
                    'operating_hours' => $data['operating_hours'] ?: null,
                    'notes' => $data['notes'],
                    'is_active' => true,
                ]
            );
        }

        fclose($file);

        $this->command->info('✅ Waste collection locations seeded successfully.');
    }
}