<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'name',
        'description',
        'type',
        'discount_percentage',
        'discount_amount_cfa',
        'buy_quantity',
        'get_quantity',
        'tiers',
        'start_date',
        'end_date',
        'min_purchase_quantity',
        'max_uses',
        'uses_count',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'discount_amount_cfa' => 'integer',
        'buy_quantity' => 'integer',
        'get_quantity' => 'integer',
        'tiers' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'min_purchase_quantity' => 'integer',
        'max_uses' => 'integer',
        'uses_count' => 'integer',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $appends = [
        'is_valid',
        'is_expired',
    ];

    /**
     * Get the book that owns this promotion.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Check if promotion is currently valid.
     */
    public function getIsValidAttribute(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();

        if ($this->start_date && $now->lt($this->start_date)) {
            return false;
        }

        if ($this->end_date && $now->gt($this->end_date)) {
            return false;
        }

        if ($this->max_uses && $this->uses_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Check if promotion is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        if ($this->end_date && Carbon::now()->gt($this->end_date)) {
            return true;
        }

        if ($this->max_uses && $this->uses_count >= $this->max_uses) {
            return true;
        }

        return false;
    }

    /**
     * Calculate discount for a given quantity and price.
     */
    public function calculateDiscount(int $quantity, int $unitPrice): array
    {
        $totalPrice = $quantity * $unitPrice;
        $discount = 0;
        $freeItems = 0;

        switch ($this->type) {
            case 'percentage':
                $discount = $totalPrice * ($this->discount_percentage / 100);
                break;

            case 'fixed':
                $discount = min($this->discount_amount_cfa, $totalPrice);
                break;

            case 'buy_x_get_y':
                if ($quantity >= $this->buy_quantity) {
                    $sets = floor($quantity / $this->buy_quantity);
                    $freeItems = $sets * $this->get_quantity;
                    $discount = $freeItems * $unitPrice;
                }
                break;

            case 'tiered':
                if ($this->tiers) {
                    foreach ($this->tiers as $tier) {
                        $min = $tier['min'] ?? 0;
                        $max = $tier['max'] ?? PHP_INT_MAX;
                        if ($quantity >= $min && $quantity <= $max) {
                            $discount = $totalPrice * ($tier['discount'] / 100);
                            break;
                        }
                    }
                }
                break;
        }

        return [
            'discount' => (int) $discount,
            'final_price' => max(0, $totalPrice - $discount),
            'free_items' => $freeItems,
        ];
    }

    /**
     * Scope to get only active promotions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only valid promotions (active and within date range).
     */
    public function scopeValid($query)
    {
        $now = Carbon::now();
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')
                    ->orWhereRaw('uses_count < max_uses');
            });
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }
}
