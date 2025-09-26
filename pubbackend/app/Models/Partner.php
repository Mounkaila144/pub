<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'website_url',
        'logo_path',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($partner) {
            if (!$partner->slug) {
                $partner->slug = Str::slug($partner->name);
            }
        });

        static::updating(function ($partner) {
            if ($partner->isDirty('name') && !$partner->isDirty('slug')) {
                $partner->slug = Str::slug($partner->name);
            }
        });
    }

    public function getLogoUrlAttribute()
    {
        if ($this->logo_path) {
            return asset('storage/' . $this->logo_path);
        }

        return null;
    }
}
