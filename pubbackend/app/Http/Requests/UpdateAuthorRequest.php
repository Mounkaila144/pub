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
            'first_name' => 'sometimes|required|string|max:120',
            'last_name' => 'sometimes|required|string|max:120',
            'slug' => 'sometimes|nullable|string|unique:authors,slug,' . $authorId,
            'bio' => 'sometimes|nullable|string',
            'photo' => 'sometimes|nullable|image|max:3072',
            'website_url' => 'sometimes|nullable|url',
            'socials' => 'sometimes|nullable|array',
            'socials.*.platform' => 'required_with:socials|string',
            'socials.*.url' => 'required_with:socials|url',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
