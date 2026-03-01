<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apartment extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'nb_beds',
        'nb_chambers',
        'apart_link',
        'price',
        'description'
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'apart_id');
    }

    public function images()
    {
        return $this->hasMany(ApartmentImage::class, 'apart_id');
    }
}
