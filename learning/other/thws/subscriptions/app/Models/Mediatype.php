<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Subscription;

class Mediatype extends Model
{
    use HasFactory;

    // A mediatype has many subscriptions
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
