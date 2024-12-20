import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';
import { 
  Trash2, 
  Edit, 
  LogOut, 
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
}

export default function AdminPage() {
  const { user, logout, isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [eventForm, setEventForm] = useState<Event>({
    id: 0,
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: 0,
  });

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
      return;
    }
  
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
  
    fetchEvents();
  }, [user, isAdmin, router]);
  
  if (!user || !isAdmin) {
    return null;
  }

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (eventForm.id) {
        await api.put(`/events/${eventForm.id}`, eventForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await api.post('/events', eventForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      
      setEventForm({
        id: 0,
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        max_participants: 0,
      });
      setIsOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to submit event');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Welcome, Admin</span>
              <Button variant="destructive" onClick={logout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Events Overview</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>{eventForm.id ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  Fill in the details for your event. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitEvent} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={eventForm.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={eventForm.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      name="start_date"
                      value={eventForm.start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      name="end_date"
                      value={eventForm.end_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    name="max_participants"
                    value={eventForm.max_participants}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {eventForm.id ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-semibold">{event.title}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEventForm(event);
                          setIsOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{event.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{event.max_participants} participants max</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}