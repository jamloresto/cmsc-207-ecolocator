<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('location_material_type', function (Blueprint $table) {
            $table->id();

            $table->foreignId('waste_collection_location_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('material_type_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(
                ['waste_collection_location_id', 'material_type_id'],
                'location_material_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('location_material_type');
    }
};