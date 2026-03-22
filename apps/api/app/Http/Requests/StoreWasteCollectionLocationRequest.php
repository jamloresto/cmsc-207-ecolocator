<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWasteCollectionLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'country_code' => ['required', 'string', 'size:2'],
            'country_name' => ['required', 'string', 'max:255'],

            'state_province' => ['required', 'string', 'max:255'],
            'state_code' => ['nullable', 'string', 'max:20'],

            'city_municipality' => ['required', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],

            'street_address' => ['required', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],

            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],

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