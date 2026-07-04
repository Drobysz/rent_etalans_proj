<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id',
        'apart_id',
        'checkin',
        'checkout',
        'session_id',
        'client_number',
        'days_number',
        'days_count',
        'email',
        'reserve_id',
        'reservation_code',
        'total_price',
    ];

    protected $casts = [
        'reservation_id' => 'integer',
        'checkin' => 'date:Y-m-d',
        'checkout' => 'date:Y-m-d',
        'days_count' => 'integer',
        'days_number' => 'integer',
        'client_number' => 'integer',
        'total_price' => 'float',
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apart_id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
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
