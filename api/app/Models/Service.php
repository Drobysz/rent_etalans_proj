<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'price',
        'visible',
        'fixed_price',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'fixed_price' => 'boolean',
    ];

    public function payments()
    {
        return $this->belongsToMany(
            Payment::class,
            'payment_history',
            'service_id',
            'payment_id'
        );
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class, 'service_id');
    }

    public function descriptions()
    {
        return $this->hasMany(ServiceDescription::class, 'service_id');
    }
}
