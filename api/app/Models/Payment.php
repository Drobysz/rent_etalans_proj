<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'apart_id',
        'checkin',
        'checkout',
        'email',
        'reserve_id',
        'total_price'
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apart_id');
    }

    public function services()
    {
        return $this->belongsToMany(
            Service::class,
            'payment_history',
            'payment_id',
            'service_id'
        );
    }
}
