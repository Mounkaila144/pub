<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAuthorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $authorId = $this->route('author') ? $this->route('author')->id : $this->route('id');

        return [
            'first_name' => 'required|string|max:120',
            'last_name' => 'required|string|max:120',
            'slug' => 'nullable|string|unique:authors,slug,' . $authorId,
            'bio' => 'nullable|string',
            'photo' => 'nullable|image|max:3072',
            'website_url' => 'nullable|url',
            'socials' => 'nullable|array',
            'socials.*.platform' => 'required_with:socials|string',
            'socials.*.url' => 'required_with:socials|url',
            'is_active' => 'boolean',
        ];
    }
}