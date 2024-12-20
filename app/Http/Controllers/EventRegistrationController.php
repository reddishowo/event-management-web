<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Support\Str;
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
            // Begin transaction
            \DB::beginTransaction();

            // Register user for event
            $event->participants()->attach($user->id, [
                'status' => 'registered'
            ]);

            // Generate ticket
            $ticket = Ticket::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'ticket_code' => $this->generateTicketCode(),
                'status' => 'active'
            ]);

            \DB::commit();

            return response()->json([
                'message' => 'Successfully registered for the event',
                'event' => $event->load('participants'),
                'ticket' => $ticket
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
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
            \DB::beginTransaction();

            // Update registration status
            $event->participants()->updateExistingPivot($user->id, [
                'status' => 'cancelled'
            ]);

            // Deactivate ticket
            Ticket::where('user_id', $user->id)
                  ->where('event_id', $event->id)
                  ->update(['status' => 'cancelled']);

            \DB::commit();

            return response()->json([
                'message' => 'Registration cancelled successfully'
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Failed to cancel registration'
            ], 500);
        }
    }

    public function getRegisteredEvents(): JsonResponse
    {
        $user = auth()->user();
        
        $tickets = Ticket::with('event')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->get()
            ->map(function ($ticket) {
                $event = $ticket->event;
                return [
                    'id' => $event->id,  // Changed from ticket->id to event->id for compatibility
                    'title' => $event->title,
                    'description' => $event->description,
                    'start_date' => $event->start_date,
                    'end_date' => $event->end_date,
                    'location' => $event->location,
                    'max_participants' => $event->max_participants,
                    'ticket_code' => $ticket->ticket_code
                ];
            });

        return response()->json($tickets);
    }

    private function generateTicketCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Ticket::where('ticket_code', $code)->exists());

        return $code;
    }
}