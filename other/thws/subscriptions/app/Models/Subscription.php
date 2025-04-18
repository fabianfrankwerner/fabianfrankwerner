<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mediatype;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'price',
        'mediatype_id'
    ];

    // A subscription belongs to a mediatype
    public function mediatype()
    {
        return $this->belongsTo(Mediatype::class);
    }
}
