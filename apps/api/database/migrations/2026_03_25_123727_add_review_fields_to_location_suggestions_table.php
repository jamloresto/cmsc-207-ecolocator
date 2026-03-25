<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('location_suggestions', function (Blueprint $table) {
            $table->text('review_notes')->nullable()->after('notes');

            $table->timestamp('approved_at')->nullable()->after('reviewed_at');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');

            $table->foreignId('approved_by')
                ->nullable()
                ->after('rejected_at')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('rejected_by')
                ->nullable()
                ->after('approved_by')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('waste_collection_location_id')
                ->nullable()
                ->after('rejected_by')
                ->constrained('waste_collection_locations')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('location_suggestions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('waste_collection_location_id');
            $table->dropConstrainedForeignId('rejected_by');
            $table->dropConstrainedForeignId('approved_by');
            $table->dropColumn([
                'review_notes',
                'approved_at',
                'rejected_at',
            ]);
        });
    }
};