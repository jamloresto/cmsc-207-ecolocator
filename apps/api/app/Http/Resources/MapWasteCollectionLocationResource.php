<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapWasteCollectionLocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'distance' => isset($this->distance) ? round((float) $this->distance, 2) : null,
            'material_types' => $this->materialTypes->map(fn ($materialType) => [
                'name' => $materialType->name,
                'slug' => $materialType->slug,
            ])->values(),
        ];
    }
}