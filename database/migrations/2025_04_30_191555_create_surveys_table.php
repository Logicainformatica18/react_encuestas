<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('front_page')->nullable();   // portada
            $table->string('detail')->nullable();        // detalle adicional
            $table->string('url')->nullable();           // enlace
            $table->date('date_start')->nullable();
            $table->date('date_end')->nullable();

            $table->boolean('visible')->nullable();
            $table->boolean('email_confirmation')->nullable();
            $table->string('password')->nullable();
            $table->string('type')->nullable();
            $table->string('state')->nullable();

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->string('file_1')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};
