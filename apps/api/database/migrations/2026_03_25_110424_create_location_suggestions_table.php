<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('location_suggestions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('contact_info')->nullable();

            $table->string('location_name');
            $table->text('address');
            $table->string('city_municipality');
            $table->string('province');
            $table->string('postal_code')->nullable();

            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->text('materials_accepted')->nullable();
            $table->text('notes')->nullable();

            $table->string('status')->default('pending'); // pending, reviewed, approved, rejected, archived
            $table->timestamp('reviewed_at')->nullable();

            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('location_suggestions');
    }
};