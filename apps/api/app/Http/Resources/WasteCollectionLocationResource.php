<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteCollectionLocationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,

            'country_code' => $this->country_code,
            'country_name' => $this->country_name,

            'state_province' => $this->state_province,
            'state_code' => $this->state_code,

            'city_municipality' => $this->city_municipality,
            'city_slug' => $this->city_slug,

            'region' => $this->region,

            'street_address' => $this->street_address,
            'postal_code' => $this->postal_code,

            'full_address' => collect([
                $this->street_address,
                $this->city_municipality,
                $this->state_province,
                $this->postal_code,
                $this->country_name,
            ])->filter()->implode(', '),

            'latitude' => $this->latitude,
            'longitude' => $this->longitude,

            'contact_number' => $this->contact_number,
            'email' => $this->email,

            'operating_hours' => $this->operating_hours,
            'notes' => $this->notes,

            'is_active' => $this->is_active,

            'material_types' => $this->whenLoaded('materialTypes', function () {
                return $this->materialTypes->map(function ($materialType) {
                    return [
                        'id' => $materialType->id,
                        'name' => $materialType->name,
                        'slug' => $materialType->slug,
                    ];
                });
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}