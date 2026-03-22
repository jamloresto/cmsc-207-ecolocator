<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_collection_locations', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->string('country_code', 2);
            $table->string('country_name');

            $table->string('state_province');
            $table->string('state_code')->nullable();

            $table->string('city_municipality');
            $table->string('city_slug')->nullable();

            $table->string('region')->nullable();

            $table->string('street_address');
            $table->string('postal_code')->nullable();

            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();

            $table->text('operating_hours')->nullable();
            $table->text('notes')->nullable();

            $table->boolean('is_active')->default(true);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index('country_code');
            $table->index('state_province');
            $table->index('state_code');
            $table->index('city_municipality');
            $table->index('city_slug');
            $table->index('region');
            $table->index(
                ['country_code', 'state_province', 'city_municipality'],
                'wcl_country_state_city_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_collection_locations');
    }
};