<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'isbn_10' => $this->isbn_10,
            'isbn_13' => $this->isbn_13,
            'synopsis' => $this->synopsis,
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
                    'first_name' => $author->first_name,
                    'last_name' => $author->last_name,
                    'full_name' => $author->full_name,
                    'photo_url' => $author->photo_url,
                    'bio' => $author->bio,
                    'contribution_role' => $author->pivot->contribution_role,
                    'contribution_order' => $author->pivot->contribution_order,
                ];
            }),
            'purchase_types' => $this->whenLoaded('activePurchaseTypes', function () {
                return $this->activePurchaseTypes;
            }),
            'promotions' => $this->whenLoaded('validPromotions', function () {
                return $this->validPromotions;
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
