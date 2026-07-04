<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Reservation extends Model
{
    protected $fillable = [
        'reservation_code',
        'email',
        'apart_id',
        'checkin',
        'checkout',
        'days_count',
        'rooms_count',
        'guests',
        'status',
        'stripe_session_id',
    ];

    protected $casts = [
        'checkin' => 'date:Y-m-d',
        'checkout' => 'date:Y-m-d',
        'days_count' => 'integer',
        'rooms_count' => 'integer',
        'guests' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Reservation $reservation) {
            if ($reservation->reservation_code) {
                return;
            }

            do {
                $code = sprintf('APT-%s-%s', now()->format('Y'), strtoupper(Str::random(6)));
            } while (self::query()->where('reservation_code', $code)->exists());

            $reservation->reservation_code = $code;
        });
    }

    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apart_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
