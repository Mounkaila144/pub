<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AuthorCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        $pagination = [
            'current_page' => $this->currentPage(),
            'from' => $this->firstItem(),
            'last_page' => $this->lastPage(),
            'per_page' => $this->perPage(),
            'to' => $this->lastItem(),
            'total' => $this->total(),
        ];

        return [
            'data' => AuthorResource::collection($this->collection),
            'meta' => array_merge($pagination, ['pagination' => $pagination]),
        ];
    }
}
