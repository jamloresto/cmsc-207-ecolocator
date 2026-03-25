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
        'review_notes',
        'status',
        'reviewed_at',
        'approved_at',
        'rejected_at',
        'approved_by',
        'rejected_by',
        'waste_collection_location_id',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function wasteCollectionLocation()
    {
        return $this->belongsTo(WasteCollectionLocation::class, 'waste_collection_location_id');
    }
}