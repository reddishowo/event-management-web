<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('event_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->text('review');
            $table->integer('rating')->unsigned()->between(1, 5);
            $table->timestamps();
            $table->unique(['user_id', 'event_id']); // Ensure one review per user per event
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_reviews');
    }
};
