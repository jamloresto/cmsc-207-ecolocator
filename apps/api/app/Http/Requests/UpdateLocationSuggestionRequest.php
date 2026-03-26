<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLocationSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && $user->hasAdminAccess();
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'contact_info' => ['nullable', 'string', 'max:255'],

            'location_name' => ['sometimes', 'required', 'string', 'max:255'],
            'country_code' => ['nullable', 'string', 'max:10'],
            'country_name' => ['nullable', 'string', 'max:255'],
            'state_province' => ['nullable', 'string', 'max:255'],
            'state_code' => ['nullable', 'string', 'max:20'],
            'city_municipality' => ['sometimes', 'required', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'required', 'string'],
            'province' => ['sometimes', 'required', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'location_email' => ['nullable', 'email', 'max:255'],
            'operating_hours' => ['nullable', 'string'],
            'materials_accepted' => ['nullable', 'string'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'review_notes' => ['nullable', 'string', 'max:5000'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}