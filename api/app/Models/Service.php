<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'description',
        'price'
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
}
