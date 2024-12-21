<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventReview;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Exception;

class EventReviewController extends Controller
{
    public function store(Request $request, Event $event): JsonResponse
    {
        try {
            $user = auth()->user();

            // Check if event has ended
            if (!now()->isAfter($event->end_date)) {
                return response()->json([
                    'message' => 'Cannot review an event that hasn\'t ended yet'
                ], 400);
            }

            // Check if user was registered for the event
            if (!$event->hasUserRegistered($user)) {
                return response()->json([
                    'message' => 'You must have attended the event to leave a review'
                ], 403);
            }

            // Validate request
            $validated = $request->validate([
                'review' => 'required|string|min:10',
                'rating' => 'required|integer|between:1,5'
            ]);

            // Check if user has already reviewed
            $existingReview = EventReview::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'message' => 'You have already reviewed this event'
                ], 400);
            }

            DB::beginTransaction();

            // Create review
            $review = EventReview::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'review' => $validated['review'],
                'rating' => $validated['rating']
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Review submitted successfully',
                'review' => $review->load('user:id,name')
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'An error occurred while submitting the review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Event $event): JsonResponse
    {
        try {
            $reviews = $event->reviews()
                ->with('user:id,name')
                ->latest()
                ->get();

            return response()->json([
                'reviews' => $reviews,
                'average_rating' => round($event->averageRating(), 1)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function userCanReview(Event $event): JsonResponse
    {
        try {
            $user = auth()->user();
            
            $canReview = now()->isAfter($event->end_date) && 
                        $event->hasUserRegistered($user) &&
                        !EventReview::where('user_id', $user->id)
                            ->where('event_id', $event->id)
                            ->exists();

            return response()->json([
                'can_review' => $canReview
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while checking review status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}