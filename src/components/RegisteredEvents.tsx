import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Clock, Ticket, Star } from 'lucide-react';
import { fetchUserReviews, fetchUserTickets, Ticket as TicketType, EventReview } from '../utils/api';


interface StatusStyle {
  backgroundColor: string;
  color: string;
}

const RegisteredEvents = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [reviewsMap, setReviewsMap] = useState<Map<number, EventReview>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine ticket status based on dates
  const getTicketStatus = (endDate: string, currentStatus: string): string => {
    const eventEndDate = new Date(endDate);
    const now = new Date();

    if (now > eventEndDate) {
      return 'expired';
    }
    return currentStatus;
  };

  // Function to get status style
  const getStatusStyle = (status: string): StatusStyle => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534'
        };
      case 'expired':
        return {
          backgroundColor: '#f1f5f9',
          color: '#64748b'
        };
      case 'cancelled':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b'
        };
      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#64748b'
        };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load tickets
        const ticketResponse = await fetchUserTickets();
        const ticketData = Array.isArray(ticketResponse) ? ticketResponse : 
                          Array.isArray(ticketResponse.data) ? ticketResponse.data : 
                          [];
        
        const updatedTickets = ticketData.map((ticket: TicketType) => ({
          ...ticket,
          status: getTicketStatus(ticket.end_date, ticket.status)
        }));
        
        const sortedTickets = updatedTickets.sort((a: TicketType, b: TicketType) => {
          if (a.status === 'active' && b.status !== 'active') return -1;
          if (a.status !== 'active' && b.status === 'active') return 1;
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        });

        setTickets(sortedTickets);

        // Load user's reviews
        const reviewResponse = await fetchUserReviews();
        const reviewData = Array.isArray(reviewResponse.data) ? reviewResponse.data : [];
        
        // Create a map of reviews indexed by event_id
        const newReviewsMap = new Map<number, EventReview>();
        reviewData.forEach((review: EventReview) => {

          newReviewsMap.set(review.event_id, review);
        });

        
        setReviewsMap(newReviewsMap);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load your registered events');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-2 rounded-full">
            <Ticket className="w-6 h-6 text-green-500" />
          </div>
          <CardTitle>My Registered Events</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!Array.isArray(tickets) || tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't registered for any events yet.
            </div>
          ) : (
            tickets.map((ticket: TicketType) => {
              const currentStatus = getTicketStatus(ticket.end_date, ticket.status);
              const statusStyle = getStatusStyle(currentStatus);
              const review = reviewsMap.get(ticket.event_id);
              
              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow ${
                    currentStatus === 'expired' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(ticket.start_date).toLocaleDateString()} -{' '}
                            {new Date(ticket.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{ticket.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{ticket.max_participants} participants</span>
                        </div>
                      </div>
                      {review && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-3">
                              {renderStars(review.rating)}
                              <span className="text-xs text-gray-400">
                                Reviewed on {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{review.review}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-medium uppercase"
                        style={statusStyle}
                      >
                        {currentStatus}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Ticket: {ticket.ticket_code}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredEvents;