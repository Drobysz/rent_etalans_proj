<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceDescription extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'service_id',
        'locale',
        'description',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
