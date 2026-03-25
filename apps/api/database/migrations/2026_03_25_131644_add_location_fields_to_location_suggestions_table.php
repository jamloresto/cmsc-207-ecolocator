<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('location_suggestions', function (Blueprint $table) {
            $table->string('country_code', 10)->nullable()->after('location_name');
            $table->string('country_name')->nullable()->after('country_code');
            $table->string('state_province')->nullable()->after('country_name');
            $table->string('state_code', 20)->nullable()->after('state_province');
            $table->string('region')->nullable()->after('state_code');
            $table->string('street_address')->nullable()->after('region');
            $table->string('contact_number')->nullable()->after('longitude');
            $table->string('location_email')->nullable()->after('contact_number');
            $table->text('operating_hours')->nullable()->after('location_email');
            $table->boolean('is_active')->default(true)->after('operating_hours');
        });
    }

    public function down(): void
    {
        Schema::table('location_suggestions', function (Blueprint $table) {
            $table->dropColumn([
                'country_code',
                'country_name',
                'state_province',
                'state_code',
                'region',
                'street_address',
                'contact_number',
                'location_email',
                'operating_hours',
                'is_active',
            ]);
        });
    }
};