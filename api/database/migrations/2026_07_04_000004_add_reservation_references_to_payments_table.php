<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'reservation_id')) {
                $table->foreignId('reservation_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('reservations')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('payments', 'reservation_code')) {
                $table->string('reservation_code', 24)->nullable()->after('reserve_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'reservation_id')) {
                $table->dropConstrainedForeignId('reservation_id');
            }

            if (Schema::hasColumn('payments', 'reservation_code')) {
                $table->dropColumn('reservation_code');
            }
        });
    }
};
