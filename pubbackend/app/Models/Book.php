<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'subtitle',
        'slug',
        'isbn_10',
        'isbn_13',
        'synopsis',
        'language',
        'publication_date',
        'pages',
        'status',
        'cover_path',
        'price_cfa',
        'currency',
    ];

    protected $casts = [
        'publication_date' => 'date',
        'pages' => 'integer',
        'price_cfa' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($book) {
            if (empty($book->slug)) {
                $book->slug = Str::slug($book->title);
            }
        });
    }

    public function authors()
    {
        return $this->belongsToMany(Author::class)
            ->withPivot('contribution_role', 'contribution_order')
            ->orderByPivot('contribution_order');
    }

    public function getCoverUrlAttribute()
    {
        return $this->cover_path ? asset('storage/' . $this->cover_path) : null;
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('subtitle', 'like', "%{$term}%")
              ->orWhere('synopsis', 'like', "%{$term}%")
              ->orWhere('isbn_10', 'like', "%{$term}%")
              ->orWhere('isbn_13', 'like', "%{$term}%");
        });
    }

    public function scopeFilterByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeFilterByLanguage($query, $language)
    {
        return $query->where('language', $language);
    }

    public function scopeFilterByAuthor($query, $authorId)
    {
        return $query->whereHas('authors', function ($q) use ($authorId) {
            $q->where('authors.id', $authorId);
        });
    }

    public function scopeFilterByYear($query, $year)
    {
        return $query->whereYear('publication_date', $year);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}