<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LocationSuggestion;

class PendingLocationSuggestionSeeder extends Seeder
{
    public function run(): void
    {
        LocationSuggestion::factory()->count(5)->create([
            'status' => 'pending',
            'reviewed_at' => null,
            'approved_at' => null,
            'rejected_at' => null,
            'approved_by' => null,
            'rejected_by' => null,
            'review_notes' => null,
        ]);
    }
}