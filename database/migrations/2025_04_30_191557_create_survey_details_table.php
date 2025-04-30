<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_details', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->unsignedBigInteger('survey_id');
            $table->foreign('survey_id')->references('id')->on('surveys');

            $table->unsignedBigInteger('selection_id')->nullable();
            $table->foreign('selection_id')->references('id')->on('selections');

            // Datos de la pregunta
            $table->string('front_page')->nullable();
            $table->string('image')->nullable();
            $table->string('post')->nullable();
            $table->longText('question');
            $table->string('type');
            $table->json('option')->nullable();
            $table->string('requerid')->nullable();
            $table->string('state')->nullable();

            // Extras encontrados en otras migraciones
            $table->string('initialize')->default('not');
            $table->string('category')->default('all');
            $table->integer('enumeration')->default(0);
            $table->string('visible')->default('yes');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_details');
    }
};
