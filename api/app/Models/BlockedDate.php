<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedDate extends Model
{
    protected $fillable = [
        'date',
        'start_date',
        'end_date',
        'reason',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];
}
