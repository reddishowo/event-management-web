import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser, FiLogOut, FiGrid, FiSettings, FiBell, FiMapPin, FiInfo } from 'react-icons/fi';
import { fetchEvents } from '../../utils/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
      return;
    }
    
    if (isAdmin) {
      router.push('/dashboard/admin');
      return;
    }

    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    loadEvents();
  }, [user, isAdmin, router]);

  if (!user || isAdmin) {
    return null;
  }

  const menuItems = [
    { icon: <FiGrid className="w-5 h-5" />, title: 'Overview', link: '/dashboard' },
    { icon: <FiCalendar className="w-5 h-5" />, title: 'Events', link: '/dashboard/events' },
    { icon: <FiUser className="w-5 h-5" />, title: 'Profile', link: '/dashboard/profile' },
  ];

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

    if (now < start) {
      return {
        text: 'Upcoming',
        className: 'bg-emerald-100 text-emerald-800'
      };
    } else if (now > end) {
      return {
        text: 'Completed',
        className: 'bg-gray-100 text-gray-800'
      };
    } else {
      return {
        text: 'Ongoing',
        className: 'bg-blue-100 text-blue-800'
      };
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <FiBell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {events.filter(event => new Date(event.start_date) > new Date()).length}
              </span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">User</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-[calc(100vh-73px)] p-6 border-r">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all duration-200"
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
              <Separator />
              <button
                onClick={logout}
                className="flex items-center space-x-3 text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all duration-200 w-full"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <FiCalendar className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.filter(event => new Date(event.start_date) > new Date()).length}
                </div>
                <p className="text-xs text-gray-500">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing Events</CardTitle>
                <FiGrid className="w-5 h-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.filter(event => {
                    const now = new Date();
                    return new Date(event.start_date) <= now && new Date(event.end_date) >= now;
                  }).length}
                </div>
                <p className="text-xs text-gray-500">Active right now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <FiUser className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-gray-500">All time events</p>
              </CardContent>
            </Card>
          </div>

          {/* Events Cards */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Events List</h2>
              <Button variant="outline">View All</Button>
            </div>
            
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const status = getEventStatus(event.start_date, event.end_date);
                  return (
                    <Card 
                      key={event.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => handleEventClick(event)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge className={status.className}>{status.text}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{formatDate(event.start_date)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FiMapPin className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                            <span>Max participants: {event.max_participants}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Event Details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1 text-sm">{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                    <p className="mt-1 text-sm">{formatDate(selectedEvent.start_date)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                    <p className="mt-1 text-sm">{formatDate(selectedEvent.end_date)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p className="mt-1 text-sm">{selectedEvent.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Maximum Participants</h4>
                  <p className="mt-1 text-sm">{selectedEvent.max_participants}</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}