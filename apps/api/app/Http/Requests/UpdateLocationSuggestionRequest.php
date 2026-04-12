<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLocationSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'contact_info' => ['sometimes', 'nullable', 'string', 'max:50'],

            'location_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'street_address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city_municipality' => ['sometimes', 'nullable', 'string', 'max:100'],
            'province' => ['sometimes', 'nullable', 'string', 'max:100'],
            'country_code' => ['sometimes', 'nullable', 'string', 'size:2'],
            'country_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'state_province' => ['sometimes', 'nullable', 'string', 'max:100'],
            'state_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'region' => ['sometimes', 'nullable', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:20'],

            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],

            'contact_number' => ['sometimes', 'nullable', 'string', 'max:50'],
            'location_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'operating_hours' => ['sometimes', 'nullable', 'string'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'review_notes' => ['sometimes', 'nullable', 'string'],
            'is_active' => ['sometimes', 'nullable', 'boolean'],

            'materials_accepted' => ['sometimes', 'nullable'],
            'materials_accepted.*' => ['string', 'max:100'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $value = $this->input('materials_accepted');

            if ($value !== null && !is_string($value) && !is_array($value)) {
                $validator->errors()->add(
                    'materials_accepted',
                    'The materials accepted field must be a string or an array.'
                );
            }
        });
    }
}