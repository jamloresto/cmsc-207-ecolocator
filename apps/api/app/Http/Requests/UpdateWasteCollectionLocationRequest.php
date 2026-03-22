<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWasteCollectionLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],

            'country_code' => ['sometimes', 'string', 'size:2'],
            'country_name' => ['sometimes', 'string', 'max:255'],

            'state_province' => ['sometimes', 'string', 'max:255'],
            'state_code' => ['nullable', 'string', 'max:20'],

            'city_municipality' => ['sometimes', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],

            'street_address' => ['sometimes', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],

            'latitude' => ['sometimes', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'numeric', 'between:-180,180'],

            'contact_number' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],

            'operating_hours' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],

            'is_active' => ['sometimes', 'boolean'],

            'material_type_ids' => ['nullable', 'array'],
            'material_type_ids.*' => ['integer', 'exists:material_types,id'],
        ];
    }
}