<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; 

class Event extends Model
{
    //
    protected $fillable = [
        'title', 'description', 'start_date', 'end_date', 'location', 'max_participants'
    ];
    

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_registrations')
                    ->withTimestamps()
                    ->withPivot('status');
    }

    public function isRegistrationOpen(): bool
    {
        return $this->participants()
                    ->where('status', 'registered')
                    ->count() < $this->max_participants;
    }

    public function hasUserRegistered(User $user): bool
    {
        return $this->participants()
                    ->where('user_id', $user->id)
                    ->where('status', 'registered')
                    ->exists();
    }
}
