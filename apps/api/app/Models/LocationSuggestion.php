<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'contact_info',
        'location_name',
        'address',
        'city_municipality',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'materials_accepted',
        'notes',
        'status',
        'reviewed_at',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'reviewed_at' => 'datetime',
        ];
    }
}