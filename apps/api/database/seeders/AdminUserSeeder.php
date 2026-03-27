<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminUsers = [
            [
                'name' => 'EcoLocator Super Admin',
                'email' => 'admin@ecolocator.com',
                'password' => 'password',
                'role' => 'super_admin',
                'is_active' => true,
            ],
            [
                'name' => 'EcoLocator Editor 1',
                'email' => 'editor1@ecolocator.com',
                'password' => 'password',
                'role' => 'editor',
                'is_active' => true,
            ],
            [
                'name' => 'EcoLocator Editor 2',
                'email' => 'editor2@ecolocator.com',
                'password' => 'password',
                'role' => 'editor',
                'is_active' => true,
            ],
            [
                'name' => 'EcoLocator Editor 3',
                'email' => 'editor3@ecolocator.com',
                'password' => 'password',
                'role' => 'editor',
                'is_active' => false,
            ],
        ];

        foreach ($adminUsers as $adminUser) {
            User::updateOrCreate(
                ['email' => $adminUser['email']],
                [
                    'name' => $adminUser['name'],
                    'password' => $adminUser['password'],
                    'role' => $adminUser['role'],
                    'is_active' => $adminUser['is_active'],
                ]
            );
        }
    }
}