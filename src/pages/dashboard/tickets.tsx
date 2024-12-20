import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import { Calendar, MapPin, Users, Ticket, ArrowRight, RefreshCcw } from 'lucide-react';
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
  CardFooter,
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
  ticket_code: string;
}

export default function TicketsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/tickets', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setTickets(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // If the response is an object with nested data
        const ticketsData = response.data.tickets || response.data.data || [];
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      } else {
        setTickets([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to fetch tickets. Please try again later.');
      setTickets([]); // Ensure tickets is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
      return;
    }
    loadTickets();
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
    return { text: 'Active', variant: 'default' as const }; // Changed from 'success' to 'default'
  };
  

  const handleViewTicket = (ticket: Event) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Tickets</h1>
            <p className="text-gray-600 mt-2">Manage your event registrations and tickets</p>
          </div>
          <Button variant="outline" onClick={loadTickets}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Tickets
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <Ticket className="w-12 h-12 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700">No Tickets Found</h3>
                <p className="text-gray-500">You haven't registered for any events yet.</p>
                <Button onClick={() => router.push('/dashboard/events')}>
                  Browse Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const status = getEventStatus(ticket.start_date, ticket.end_date);
              return (
                <Card 
                  key={ticket.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{ticket.title}</CardTitle>
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </div>
                    <CardDescription className="flex items-center mt-2">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {formatDate(ticket.start_date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">{ticket.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      View Ticket
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            {selectedTicket && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-2xl font-bold">
                      Event Ticket
                    </DialogTitle>
                    <Badge variant={getEventStatus(selectedTicket.start_date, selectedTicket.end_date).variant}>
                      {getEventStatus(selectedTicket.start_date, selectedTicket.end_date).text}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
                        <div className="bg-gray-100 p-6 rounded-lg">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedTicket.ticket_code}`}
                            alt="Ticket QR Code"
                            className="mx-auto w-48 h-48"
                          />
                          <p className="mt-4 font-mono text-sm">{selectedTicket.ticket_code}</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Date & Time:</span>
                          <span className="font-medium">{formatDate(selectedTicket.start_date)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedTicket.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Ticket ID:</span>
                          <span className="font-medium">{selectedTicket.id}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center text-sm text-gray-500">
                    Please present this QR code at the event entrance
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}