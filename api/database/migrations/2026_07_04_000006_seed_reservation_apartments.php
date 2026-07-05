<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $apartments = [
            [
                'name' => 'Apartment 1 - one room',
                'nb_chambers' => 1,
                'nb_beds' => 1,
                'price' => 45,
                'apart_link' => '/housing/reservation',
                'description' => 'One room apartment reservation.',
            ],
            [
                'name' => 'Apartment 2 - two rooms',
                'nb_chambers' => 2,
                'nb_beds' => 2,
                'price' => 90,
                'apart_link' => '/housing/reservation',
                'description' => 'Two room apartment reservation.',
            ],
        ];

        foreach ($apartments as $apartment) {
            if (!DB::table('apartments')->where('nb_chambers', $apartment['nb_chambers'])->exists()) {
                DB::table('apartments')->insert($apartment);
            }
        }
    }

    public function down(): void
    {
        DB::table('apartments')
            ->whereIn('name', ['Apartment 1 - one room', 'Apartment 2 - two rooms'])
            ->delete();
    }
};
