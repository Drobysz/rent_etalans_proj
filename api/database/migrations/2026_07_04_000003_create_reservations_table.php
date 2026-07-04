<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservation_code', 24)->unique();
            $table->string('email', 80);
            $table->foreignId('apart_id')->constrained('apartments')->cascadeOnDelete();
            $table->date('checkin');
            $table->date('checkout');
            $table->unsignedInteger('days_count');
            $table->unsignedTinyInteger('rooms_count');
            $table->unsignedTinyInteger('guests');
            $table->string('status', 24)->default('pending');
            $table->string('stripe_session_id')->nullable()->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
