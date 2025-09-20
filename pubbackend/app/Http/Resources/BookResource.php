<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'status' => $this->status,
            'language' => $this->language,
            'publication_date' => $this->publication_date,
            'pages' => $this->pages,
            'cover_url' => $this->cover_url,
            'price_cfa' => $this->price_cfa,
            'currency' => $this->currency ?? 'XOF',
            'authors' => $this->authors->map(function ($author) {
                return [
                    'id' => $author->id,
                    'full_name' => $author->full_name,
                    'contribution_role' => $author->pivot->contribution_role,
                    'contribution_order' => $author->pivot->contribution_order,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}