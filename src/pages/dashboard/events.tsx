import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { fetchEvents } from '../../utils/api';
import EventRegistrationSystem from '../../components/EventRegistration';
import { MapPin, Calendar, Users, CheckCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    
    if (now < start) return { text: 'Upcoming', variant: 'default' as const };
    if (now > end) return { text: 'Completed', variant: 'secondary' as const };
    return { text: 'Ongoing', variant: 'outline' as const };
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Events</h1>
          <Button variant="outline" onClick={loadEvents}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Refresh Events
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const status = getEventStatus(event.start_date, event.end_date);
            return (
              <Card 
                key={event.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEventSelect(event)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </div>
                  <CardDescription className="flex items-center mt-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {formatDate(event.start_date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="flex items-center mt-4">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Max participants: {event.max_participants}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-2xl font-bold">
                      {selectedEvent.title}
                    </DialogTitle>
                    <Badge variant={getEventStatus(selectedEvent.start_date, selectedEvent.end_date).variant}>
                      {getEventStatus(selectedEvent.start_date, selectedEvent.end_date).text}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-primary" />
                      <span>
                        {formatDate(selectedEvent.start_date)} - {formatDate(selectedEvent.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-3 text-primary" />
                      <span>Maximum participants: {selectedEvent.max_participants}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>

                  <EventRegistrationSystem 
                    event={selectedEvent}
                    onRegistrationUpdate={loadEvents}
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}