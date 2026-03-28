<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LocationSuggestion;
use App\Models\User;

class RejectedLocationSuggestionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'editor')->first()
            ?? User::factory()->create(['role' => 'editor']);

        LocationSuggestion::factory()->count(5)->create([
            'status' => 'rejected',
            'reviewed_at' => now(),
            'rejected_at' => now(),
            'rejected_by' => $admin->id,
            'review_notes' => 'Rejected due to incomplete or invalid information.',
        ]);
    }
}