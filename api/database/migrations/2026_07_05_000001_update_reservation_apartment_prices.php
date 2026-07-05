<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('apartments')
            ->where('nb_chambers', 1)
            ->update(['price' => 45]);

        DB::table('apartments')
            ->where('nb_chambers', 2)
            ->update(['price' => 90]);
    }

    public function down(): void
    {
        DB::table('apartments')
            ->where('nb_chambers', 1)
            ->where('name', 'Apartment 1 - one room')
            ->update(['price' => 60]);

        DB::table('apartments')
            ->where('nb_chambers', 2)
            ->where('name', 'Apartment 2 - two rooms')
            ->update(['price' => 100]);
    }
};
