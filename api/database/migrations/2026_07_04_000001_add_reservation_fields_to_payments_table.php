<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'checkin')) {
                $table->date('checkin')->nullable()->after('apart_id');
            }

            if (!Schema::hasColumn('payments', 'checkout')) {
                $table->date('checkout')->nullable()->after('checkin');
            }

            if (!Schema::hasColumn('payments', 'days_count')) {
                $table->unsignedBigInteger('days_count')->nullable()->after('days_number');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            foreach (['checkin', 'checkout', 'days_count'] as $column) {
                if (Schema::hasColumn('payments', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
