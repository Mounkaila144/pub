<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:200',
            'subtitle' => 'nullable|string',
            'slug' => 'nullable|string|unique:books,slug',
            'isbn_10' => 'nullable|string',
            'isbn_13' => 'nullable|string',
            'synopsis' => 'nullable|string',
            'language' => 'required|string|in:fr,en,es,de,it,pt,ar,zh,ja,ko,ru',
            'publication_date' => 'nullable|date',
            'pages' => 'nullable|integer|min:1',
            'status' => 'required|in:draft,published',
            'cover' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'price_cfa' => 'nullable|integer|min:0',
            'currency' => 'nullable|string|size:3',
            'authors' => 'required|array|min:1',
            'authors.*.id' => 'required|exists:authors,id',
            'authors.*.contribution_role' => 'nullable|string|max:60',
            'authors.*.contribution_order' => 'nullable|integer|min:1',
        ];
    }

    protected function prepareForValidation()
    {
        if (!$this->has('currency')) {
            $this->merge(['currency' => 'XOF']);
        }

        if ($this->has('authors') && is_array($this->authors)) {
            $authors = [];
            foreach ($this->authors as $index => $author) {
                $authors[$index] = array_merge($author, [
                    'contribution_role' => $author['contribution_role'] ?? 'Author',
                    'contribution_order' => $author['contribution_order'] ?? ($index + 1),
                ]);
            }
            $this->merge(['authors' => $authors]);
        }
    }
}