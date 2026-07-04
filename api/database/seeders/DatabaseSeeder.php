<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Apartment;
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

        Apartment::query()->updateOrCreate(
            ['name' => 'Apartment 1 - one room'],
            [
                'nb_chambers' => 1,
                'nb_beds' => 1,
                'price' => 60,
                'apart_link' => '/housing/reservation',
                'description' => 'One room reservation option.',
            ],
        );

        Apartment::query()->updateOrCreate(
            ['name' => 'Apartment 2 - two rooms'],
            [
                'nb_chambers' => 2,
                'nb_beds' => 2,
                'price' => 100,
                'apart_link' => '/housing/reservation',
                'description' => 'Two rooms reservation option.',
            ],
        );
    }
}
