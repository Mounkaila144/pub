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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Ex: "Promo 3+1 gratuit", "Remise Black Friday"
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed', 'buy_x_get_y', 'tiered'])->default('percentage');

            // Pour les promotions pourcentage/fixe
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->integer('discount_amount_cfa')->nullable();

            // Pour les promotions "Acheter X, obtenir Y"
            $table->integer('buy_quantity')->nullable(); // Acheter X
            $table->integer('get_quantity')->nullable(); // Obtenir Y gratuit

            // Pour les promotions par paliers
            $table->json('tiers')->nullable(); // [{min: 5, max: 9, discount: 10}, {min: 10, max: null, discount: 20}]

            // Dates de validité
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();

            // Conditions
            $table->integer('min_purchase_quantity')->default(1);
            $table->integer('max_uses')->nullable(); // Limite d'utilisation
            $table->integer('uses_count')->default(0); // Nombre d'utilisations

            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['book_id', 'is_active']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
