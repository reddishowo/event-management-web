<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventRegistrationController extends Controller
{
    public function checkRegistration(Event $event): JsonResponse
    {
        $user = auth()->user();
        $registered = $event->hasUserRegistered($user);
        
        return response()->json([
            'registered' => $registered,
            'registration_open' => $event->isRegistrationOpen(),
            'current_participants' => $event->participants()->where('status', 'registered')->count(),
            'max_participants' => $event->max_participants
        ]);
    }

    public function register(Event $event): JsonResponse
    {
        $user = auth()->user();

        // Check if user is already registered
        if ($event->hasUserRegistered($user)) {
            return response()->json([
                'message' => 'You are already registered for this event'
            ], 400);
        }

        // Check if event registration is still open
        if (!$event->isRegistrationOpen()) {
            return response()->json([
                'message' => 'Event has reached maximum participants'
            ], 400);
        }

        // Check if event hasn't ended
        if ($event->end_date->isPast()) {
            return response()->json([
                'message' => 'Event has already ended'
            ], 400);
        }

        try {
            $event->participants()->attach($user->id, [
                'status' => 'registered'
            ]);

            return response()->json([
                'message' => 'Successfully registered for the event',
                'event' => $event->load('participants')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to register for the event'
            ], 500);
        }
    }

    public function cancelRegistration(Event $event): JsonResponse
    {
        $user = auth()->user();

        if (!$event->hasUserRegistered($user)) {
            return response()->json([
                'message' => 'You are not registered for this event'
            ], 400);
        }

        try {
            $event->participants()->updateExistingPivot($user->id, [
                'status' => 'cancelled'
            ]);

            return response()->json([
                'message' => 'Registration cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to cancel registration'
            ], 500);
        }
    }

    public function getRegisteredEvents(): JsonResponse
    {
        $user = auth()->user();
        $events = $user->registeredEvents()
                      ->where('status', 'registered')
                      ->get();

        return response()->json($events);
    }
}