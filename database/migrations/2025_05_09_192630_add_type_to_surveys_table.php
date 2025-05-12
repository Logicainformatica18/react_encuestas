<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('surveys', function (Blueprint $table) {
            // Tipo de vencimiento del contrato
            $table->enum('contract_end_type', ['by_day_and_months', 'by_days', 'fixed'])->default('by_day_and_months');

            // Opción 1: meses + día fijo
            $table->unsignedTinyInteger('contract_duration_months')->nullable()->after('contract_end_type');
            $table->unsignedTinyInteger('contract_end_day')->nullable()->after('contract_duration_months');

            // Opción 2: duración en días
            $table->unsignedSmallInteger('contract_duration_days')->nullable()->after('contract_end_day');

            // Opción 3: fecha exacta fija
            $table->date('contract_end_date')->nullable()->after('contract_duration_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surveys', function (Blueprint $table) {
            $table->dropColumn([
                'contract_end_type',
                'contract_duration_months',
                'contract_end_day',
                'contract_duration_days',
                'contract_end_date',
            ]);
        });
    }
};
