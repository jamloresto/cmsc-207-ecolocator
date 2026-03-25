<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocationSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'contact_info' => ['nullable', 'string', 'max:255'],

            'location_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city_municipality' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            'materials_accepted' => ['nullable', 'string'],
            'notes' => ['nullable', 'string', 'max:5000'],

            // optional public fields
            'country_code' => ['nullable', 'string', 'max:10'],
            'country_name' => ['nullable', 'string', 'max:255'],
            'state_province' => ['nullable', 'string', 'max:255'],
            'state_code' => ['nullable', 'string', 'max:20'],
            'region' => ['nullable', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'location_email' => ['nullable', 'email', 'max:255'],
            'operating_hours' => ['nullable', 'string'],
        ];
    }
}