<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $locales = ['en', 'fr', 'de'];

    public function up(): void
    {
        Schema::create('service_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('description', 500);
            $table->unique(['service_id', 'locale']);
        });

        if (Schema::hasColumn('services', 'description')) {
            $services = DB::table('services')
                ->select(['id', 'description'])
                ->get();

            foreach ($services as $service) {
                foreach ($this->locales as $locale) {
                    DB::table('service_descriptions')->insert([
                        'service_id' => $service->id,
                        'locale' => $locale,
                        'description' => $service->description ?? '',
                    ]);
                }
            }

            Schema::table('services', function (Blueprint $table) {
                $table->dropColumn('description');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('services', 'description')) {
            Schema::table('services', function (Blueprint $table) {
                $table->string('description', 500)->nullable()->after('name');
            });

            DB::table('services')
                ->orderBy('id')
                ->each(function ($service) {
                    $descriptions = DB::table('service_descriptions')
                        ->where('service_id', $service->id)
                        ->whereIn('locale', $this->locales)
                        ->pluck('description', 'locale');

                    DB::table('services')
                        ->where('id', $service->id)
                        ->update([
                            'description' => $descriptions['fr']
                                ?? $descriptions['en']
                                ?? $descriptions['de']
                                ?? null,
                        ]);
                });
        }

        Schema::dropIfExists('service_descriptions');
    }
};
