<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceImage extends Model
{
    protected $fillable = [
        'image_name',
        'path'
    ];

    public function service()
    {
        return $this->belongsTo(Apartment::class, 'service_id');
    }
}
