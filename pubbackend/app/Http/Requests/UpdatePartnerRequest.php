<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $partnerId = $this->route('partner')?->id;

        $rules = [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:partners,slug,' . $partnerId,
            'description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'is_active' => 'boolean',
            'display_order' => 'integer|min:0',
        ];

        // Only validate logo if it's present and is a file
        if ($this->hasFile('logo')) {
            $rules['logo'] = 'image|mimes:jpeg,jpg,png,gif,svg|max:2048';
        }

        return $rules;
    }

    protected function prepareForValidation()
    {
        // Convert string boolean to actual boolean
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true
            ]);
        }
    }
}
