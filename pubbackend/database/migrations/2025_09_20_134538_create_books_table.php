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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('subtitle')->nullable();
            $table->string('slug')->unique();
            $table->string('isbn_10', 10)->unique()->nullable();
            $table->string('isbn_13', 13)->unique()->nullable();
            $table->longText('synopsis')->nullable();
            $table->string('language', 10);
            $table->date('publication_date')->nullable();
            $table->unsignedInteger('pages')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->string('cover_path')->nullable();
            $table->unsignedInteger('price_cfa')->nullable();
            $table->string('currency', 3)->default('XOF');
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('status');
            $table->index('language');
            $table->index('publication_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
