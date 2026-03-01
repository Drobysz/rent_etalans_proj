<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApartmentImage extends Model
{
    protected $fillable = [
        'image_name',
        'path'
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apart_id');
    }
}
