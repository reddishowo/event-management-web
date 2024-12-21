import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventReview, submitEventReview, fetchEventReviews, checkCanReview } from '../utils/api';

interface EventReviewProps {
  eventId: number;
}

interface RatingStarsProps {
  value: number;
  onSelect: (rating: number) => void;
  onHover: (rating: number) => void;
  interactive?: boolean;
}

export default function EventReviewSystem({ eventId }: EventReviewProps) {
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      const data = await fetchEventReviews(eventId);
      setReviews(data.reviews);
      setAverageRating(data.average_rating);
    } catch (err) {
      console.error(err);
      setError('Failed to load reviews');
    }
  };

  const checkReviewStatus = async () => {
    try {
      const { can_review } = await checkCanReview(eventId);
      setCanReview(can_review);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    checkReviewStatus();
  }, [eventId]);

  const handleSubmitReview = async () => {
    try {
      await submitEventReview(eventId, { review, rating });
      setReview('');
      setRating(0);
      loadReviews();
      checkReviewStatus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const RatingStars: React.FC<RatingStarsProps> = ({ 
    value, 
    onSelect, 
    onHover, 
    interactive = true 
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={interactive ? 'cursor-pointer' : ''}
            onClick={() => interactive && onSelect(star)}
            onMouseEnter={() => interactive && onHover(star)}
            onMouseLeave={() => interactive && onHover(0)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hoverRating || value) 
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Event Reviews</h3>
        <div className="flex items-center">
          <span className="mr-2">Average Rating: {averageRating.toFixed(1)}</span>
          <RatingStars 
            value={averageRating} 
            onSelect={() => {}} 
            onHover={() => {}}
            interactive={false}
          />
        </div>
      </div>

      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <RatingStars 
                  value={rating}
                  onSelect={setRating}
                  onHover={setHoverRating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this event..."
                  className="min-h-[100px]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button 
                onClick={handleSubmitReview}
                disabled={!rating || !review.trim()}
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((reviewItem) => (
          <Card key={reviewItem.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{reviewItem.user?.name}</p>
                  <RatingStars 
                    value={reviewItem.rating}
                    onSelect={() => {}}
                    onHover={() => {}}
                    interactive={false}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(reviewItem.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{reviewItem.review}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}