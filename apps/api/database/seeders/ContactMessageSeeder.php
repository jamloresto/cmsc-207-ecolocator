<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;
use Illuminate\Support\Carbon;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $messages = [
            [
                'name' => 'Mary Grace Piattos',
                'email' => 'mg.piattos@example.com',
                'contact_info' => '+639171234567',
                'subject' => 'Nearest recycling center',
                'message' => 'Hi, where is the nearest plastic recycling center in my area?',
                'status' => 'new',
                'read_at' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Carlos Miguel Oishi',
                'email' => 'cm.oishi@example.com',
                'contact_info' => '+639181112222',
                'subject' => 'E-waste disposal inquiry',
                'message' => 'Do you accept old laptops and batteries?',
                'status' => 'read',
                'read_at' => $now->copy()->subHours(5),
                'replied_at' => null,
            ],
            [
                'name' => 'Chippy McDonald',
                'email' => 'chippy.m@example.com',
                'contact_info' => '+639199998888',
                'subject' => 'Schedule of collection',
                'message' => 'When is the next garbage collection schedule in Pasig?',
                'status' => 'replied',
                'read_at' => $now->copy()->subDays(1),
                'replied_at' => $now->copy()->subHours(10),
            ],
            [
                'name' => 'Fernando Tempura',
                'email' => 'fernando.t@example.com',
                'contact_info' => '+639177776666',
                'subject' => 'Bulk waste concern',
                'message' => 'How can I dispose of large furniture?',
                'status' => 'archived',
                'read_at' => $now->copy()->subDays(3),
                'replied_at' => $now->copy()->subDays(2),
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create([
                ...$message,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Seeder Script',
            ]);
        }
    }
}