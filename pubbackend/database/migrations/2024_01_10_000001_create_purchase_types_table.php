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
        Schema::create('purchase_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['unique', 'pack', 'corporate'])->default('unique');
            $table->string('name'); // Ex: "Achat unique", "Pack 3 livres", "Entreprise (10+)"
            $table->text('description')->nullable();
            $table->integer('min_quantity')->default(1);
            $table->integer('max_quantity')->nullable();
            $table->integer('price_cfa'); // Prix unitaire en CFA
            $table->decimal('discount_percentage', 5, 2)->default(0); // Réduction en %
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['book_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_types');
    }
};
