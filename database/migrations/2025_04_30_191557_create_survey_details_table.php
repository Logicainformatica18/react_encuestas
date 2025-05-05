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

            $table->unsignedBigInteger('survey_id');
            $table->longText('question');
            $table->text('detail')->nullable();
            $table->text('detail_2')->nullable(); // ➕ nuevo
            $table->text('detail_3')->nullable(); // ➕ nuevo
            $table->string('correct')->nullable(); // ➕ nuevo
            $table->decimal('point', 5, 2)->nullable(); // ➕ nuevo (puedes ajustar la precisión)

            $table->string('type');
            $table->text('option')->nullable();
            $table->string('state')->nullable();
            $table->string('requerid')->default('Sí');
            $table->string('title')->nullable();
            $table->string('evaluate')->nullable();
            $table->unsignedBigInteger('selection_id')->nullable();

            $table->string('visible')->default('1');

            $table->string('enumeration')->nullable();
            $table->string('initialize')->nullable();
            $table->string('category')->nullable();

            $table->timestamps();

            $table->foreign('survey_id')->references('id')->on('surveys')->onDelete('cascade');
            $table->foreign('selection_id')->references('id')->on('selections')->nullOnDelete();
        });



            }

            public function down()
            {
                Schema::dropIfExists('survey_details');


            }


};
