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

            // NEW SEED DATA

            [
                'name' => 'Xiaome Ocho',
                'email' => 'xiaome.ocho@example.com',
                'contact_info' => '+639155556666',
                'subject' => 'Glass recycling options',
                'message' => 'Do you have centers that accept broken glass bottles?',
                'status' => 'new',
                'read_at' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Jay Kamote',
                'email' => 'jay.kamote@example.com',
                'contact_info' => '+639166667777',
                'subject' => 'Plastic pickup request',
                'message' => 'Can I schedule a pickup for recyclable plastics at home?',
                'status' => 'read',
                'read_at' => $now->copy()->subHours(2),
                'replied_at' => null,
            ],
            [
                'name' => 'Miggy Mango',
                'email' => 'miggy.mango@example.com',
                'contact_info' => '+639177778888',
                'subject' => 'Recycling paper waste',
                'message' => 'Where can I bring old newspapers and cardboard boxes?',
                'status' => 'replied',
                'read_at' => $now->copy()->subDay(),
                'replied_at' => $now->copy()->subHours(6),
            ],
            [
                'name' => 'Milky Secuya',
                'email' => 'milky.secuya@example.com',
                'contact_info' => '+639188889999',
                'subject' => 'Hazardous waste disposal',
                'message' => 'How do I properly dispose of old cleaning chemicals?',
                'status' => 'archived',
                'read_at' => $now->copy()->subDays(4),
                'replied_at' => $now->copy()->subDays(3),
            ],
            [
                'name' => 'Alice Cresencio',
                'email' => 'alice.cresencio@example.com',
                'contact_info' => '+639199990000',
                'subject' => 'Recycling center hours',
                'message' => 'What time do your recycling centers usually open?',
                'status' => 'new',
                'read_at' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Kokoy Villamin',
                'email' => 'kokoy.villamin@example.com',
                'contact_info' => '+639122223333',
                'subject' => 'Metal scrap recycling',
                'message' => 'Do you accept scrap metal like old roofing sheets?',
                'status' => 'read',
                'read_at' => $now->copy()->subHours(8),
                'replied_at' => null,
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