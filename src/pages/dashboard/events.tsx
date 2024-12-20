import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { fetchEvents } from '../../utils/api';
import EventRegistrationSystem from '../../components/EventRegistration';
import { MapPin, Calendar, Users, CheckCircle } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
}

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
      return;
    }
    loadEvents();
  }, [user, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return { text: 'Upcoming', className: 'bg-green-100 text-green-800' };
    if (now > end) return { text: 'Completed', className: 'bg-gray-100 text-gray-800' };
    return { text: 'Ongoing', className: 'bg-blue-100 text-blue-800' };
  };

  const handleEventSelect = async (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Events</h1>
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading events...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
          {/* Events List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {events.map((event) => {
                const status = getEventStatus(event.start_date, event.end_date);
                return (
                  <div 
                    key={event.id} 
                    onClick={() => handleEventSelect(event)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEvent?.id === event.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${status.className}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.start_date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Event Details */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {selectedEvent ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedEvent.title}</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-green-500" />
                    <span>
                      {formatDate(selectedEvent.start_date)} - {formatDate(selectedEvent.end_date)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>

                  <EventRegistrationSystem 
                    event={selectedEvent}
                    onRegistrationUpdate={loadEvents}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select an event to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}