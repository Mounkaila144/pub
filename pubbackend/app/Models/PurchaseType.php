<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseType extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'type',
        'name',
        'description',
        'min_quantity',
        'max_quantity',
        'price_cfa',
        'discount_percentage',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'min_quantity' => 'integer',
        'max_quantity' => 'integer',
        'price_cfa' => 'integer',
        'discount_percentage' => 'decimal:2',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $appends = [
        'final_price',
        'savings',
    ];

    /**
     * Get the book that owns this purchase type.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the final price after discount.
     */
    public function getFinalPriceAttribute(): int
    {
        $discount = $this->price_cfa * ($this->discount_percentage / 100);
        return (int) ($this->price_cfa - $discount);
    }

    /**
     * Get the savings amount.
     */
    public function getSavingsAttribute(): int
    {
        return $this->price_cfa - $this->final_price;
    }

    /**
     * Scope to get only active purchase types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }
}
