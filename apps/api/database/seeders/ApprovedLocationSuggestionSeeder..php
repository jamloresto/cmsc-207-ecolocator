<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LocationSuggestion;
use App\Models\User;

class ApprovedLocationSuggestionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'super_admin')->first()
            ?? User::factory()->create(['role' => 'super_admin']);

        LocationSuggestion::factory()->count(5)->create([
            'status' => 'approved',
            'reviewed_at' => now(),
            'approved_at' => now(),
            'approved_by' => $admin->id,
            'review_notes' => 'Approved after verification of location details.',
        ]);
    }
}