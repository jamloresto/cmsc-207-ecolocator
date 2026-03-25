<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class WasteCollectionLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country_code',
        'country_name',
        'state_province',
        'state_code',
        'city_municipality',
        'city_slug',
        'region',
        'street_address',
        'postal_code',
        'latitude',
        'longitude',
        'contact_number',
        'email',
        'operating_hours',
        'notes',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (WasteCollectionLocation $location) {
            if (!empty($location->city_municipality)) {
                $location->city_slug = Str::slug($location->city_municipality);
            }

            if (!empty($location->country_code)) {
                $location->country_code = strtoupper($location->country_code);
            }

            if (!empty($location->state_code)) {
                $location->state_code = strtoupper($location->state_code);
            }
        });
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function materialTypes()
    {
        return $this->belongsToMany(
            MaterialType::class,
            'location_material_type'
        )->withTimestamps();
    }
}