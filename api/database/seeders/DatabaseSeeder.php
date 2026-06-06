<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'superadmin',
            'tg_nickname' => 'superadmin',
            'role' => 'superadmin',
            'password' => bcrypt('password123'),
        ]);

        User::factory()->create([
            'name' => 'admin',
            'tg_nickname' => 'admin',
            'role' => 'admin',
            'password' => bcrypt('password123'),
        ]);

        User::factory()->create([
            'name' => 'client',
            'tg_nickname' => 'client',
            'role' => 'client',
            'password' => bcrypt('password3241'),
        ]);
    }
}
