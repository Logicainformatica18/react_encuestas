<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('survey_clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_detail_id')->constrained()->onDelete('cascade');
            $table->foreignId('selection_detail_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('answer')->nullable();
            $table->json('option')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_clients');
    }
};
