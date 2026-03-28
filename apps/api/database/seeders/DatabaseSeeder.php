<?php

namespace Database\Seeders;

use App\Models\WasteCollectionLocation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            ContactMessageSeeder::class,
            MaterialTypeSeeder::class,
            WasteCollectionLocationSeeder::class,
            LocationMaterialTypeSeeder::class,
        ]);

        // Check if there are locations with missing or 0,0 coordinates
        $needsGeocoding = WasteCollectionLocation::where(function ($q) {
            $q->whereNull('latitude')
            ->orWhereNull('longitude')
            ->orWhere('latitude', 0)
            ->orWhere('longitude', 0);
        })->exists();

        if ($needsGeocoding) {
            $this->command->info('🌍 Running geocoding for locations...');

            Artisan::call('locations:geocode', [
                '--only-missing' => true,
            ]);

            $this->command->info('✅ Geocoding completed.');
        }
    }
}
