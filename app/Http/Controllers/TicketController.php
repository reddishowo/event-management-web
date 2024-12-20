<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with('event')
            ->where('user_id', auth()->id())
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'title' => $ticket->event->title,
                    'description' => $ticket->event->description,
                    'start_date' => $ticket->event->start_date,
                    'end_date' => $ticket->event->end_date,
                    'location' => $ticket->event->location,
                    'max_participants' => $ticket->event->max_participants,
                    'ticket_code' => $ticket->ticket_code,
                    'status' => $ticket->status,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $tickets
        ]);
    }

    public function show($id)
    {
        $ticket = Ticket::with('event')
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $ticketData = [
            'id' => $ticket->id,
            'title' => $ticket->event->title,
            'description' => $ticket->event->description,
            'start_date' => $ticket->event->start_date,
            'end_date' => $ticket->event->end_date,
            'location' => $ticket->event->location,
            'max_participants' => $ticket->event->max_participants,
            'ticket_code' => $ticket->ticket_code,
            'status' => $ticket->status,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $ticketData
        ]);
    }
}