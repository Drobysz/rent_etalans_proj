<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'email') && !Schema::hasColumn('users', 'tg_nickname')) {
            Schema::table('users', function (Blueprint $table) {
                $table->renameColumn('email', 'tg_nickname');
            });
        }

        if (Schema::hasColumn('users', 'email_verified_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('email_verified_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'tg_nickname') && !Schema::hasColumn('users', 'email')) {
            Schema::table('users', function (Blueprint $table) {
                $table->renameColumn('tg_nickname', 'email');
            });
        }

        if (!Schema::hasColumn('users', 'email_verified_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            });
        }
    }
};
