<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllowedEmailsTable extends Migration
{
    public function up(): void
    {
        Schema::create('allowed_emails', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->unsignedBigInteger('survey_id');
            $table->integer('quanty')->default(1);
            $table->timestamps();

            $table->foreign('survey_id')->references('id')->on('surveys')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('allowed_emails');
    }
}
