<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return Event::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'required',
            'max_participants' => 'required|integer',
            'category' => 'required|in:' . implode(',', Event::CATEGORIES),
        ]);

        return Event::create($request->all());
    }

    public function show($id)
    {
        return Event::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'category' => 'sometimes|required|in:' . implode(',', Event::CATEGORIES),
        ]);

        $event = Event::findOrFail($id);
        $event->update($request->all());
        return $event;
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }

    public function categories()
    {
        return response()->json(['categories' => Event::CATEGORIES]);
    }
}