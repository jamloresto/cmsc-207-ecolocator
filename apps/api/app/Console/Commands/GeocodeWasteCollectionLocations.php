<?php

namespace App\Console\Commands;

use App\Models\WasteCollectionLocation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GeocodeWasteCollectionLocations extends Command
{
    protected $signature = 'locations:geocode {--only-missing : Geocode only rows with empty or zero coordinates}';
    protected $description = 'Populate latitude and longitude for waste collection locations';

    public function handle(): int
    {
        $query = WasteCollectionLocation::query();

        if ($this->option('only-missing')) {
            $query->where(function ($q) {
                $q->whereNull('latitude')
                    ->orWhereNull('longitude')
                    ->orWhere('latitude', 0)
                    ->orWhere('longitude', 0);
            });
        }

        $locations = $query->get();

        $this->info("Processing {$locations->count()} locations...");

        foreach ($locations as $location) {
            $searchCandidates = $this->buildSearchCandidates($location);

            $matched = false;

            foreach ($searchCandidates as $search) {
                $coords = $this->geocode($search);

                if ($coords !== null) {
                    $location->update([
                        'latitude' => $coords['lat'],
                        'longitude' => $coords['lon'],
                    ]);

                    $this->line("Matched: {$location->name} -> {$coords['lat']}, {$coords['lon']} using [{$search}]");
                    $matched = true;

                    break;
                }

                // Respect public Nominatim usage limits.
                usleep(1200000); // 1.2 seconds
            }

            if (! $matched) {
                $location->update([
                    'latitude' => 0,
                    'longitude' => 0,
                ]);

                $this->warn("Fallback 0,0: {$location->name}");
            }

            // Extra pause between records as a safety margin.
            usleep(1200000);
        }

        $this->info('Done.');

        return self::SUCCESS;
    }

    /**
     * Build search strings from best to weakest match.
     */
    private function buildSearchCandidates(WasteCollectionLocation $location): array
    {
        $parts = [
            $location->street_address,
            $location->city_municipality,
            $location->state_province,
            $location->country_name,
        ];

        $fullAddress = collect($parts)->filter()->implode(', ');

        $nameWithAddress = collect([
            $location->name,
            $location->street_address,
            $location->city_municipality,
            $location->state_province,
            $location->country_name,
        ])->filter()->implode(', ');

        $nameWithCity = collect([
            $location->name,
            $location->city_municipality,
            $location->state_province,
            $location->country_name,
        ])->filter()->implode(', ');

        $cityOnly = collect([
            $location->city_municipality,
            $location->state_province,
            $location->country_name,
        ])->filter()->implode(', ');

        return array_values(array_unique(array_filter([
            $location->street_address ? $nameWithAddress : null,
            $location->street_address ? $fullAddress : null,
            $nameWithCity,
            $cityOnly,
        ])));
    }

    /**
     * Query Nominatim and return ['lat' => float, 'lon' => float] or null.
     */
    private function geocode(string $search): ?array
    {
        $response = Http::timeout(10)
            ->retry(2, 1000)
            ->withHeaders([
                'User-Agent' => 'EcoLocator/1.0 (development geocoding pass)',
                'Accept-Language' => 'en',
            ])
            ->get('https://nominatim.openstreetmap.org/search', [
                'q' => $search,
                'format' => 'jsonv2',
                'limit' => 1,
                'countrycodes' => 'ph',
                'addressdetails' => 1,
            ]);

        if (! $response->successful()) {
            return null;
        }

        $results = $response->json();

        if (! is_array($results) || empty($results[0]['lat']) || empty($results[0]['lon'])) {
            return null;
        }

        return [
            'lat' => (float) $results[0]['lat'],
            'lon' => (float) $results[0]['lon'],
        ];
    }
}