import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  FiCalendar,
  FiUser,
  FiLogOut,
  FiGrid,
  FiSettings,
  FiBell,
  FiMapPin,
  FiInfo,
  FiCast,
  FiTag,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { fetchEvents } from "../../utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  category: string;
}

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/Login");
      return;
    }

    if (isAdmin) {
      router.push("/dashboard/admin");
      return;
    }

    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
        setLoading(false);
      }
    };

    loadEvents();
  }, [user, isAdmin, router]);

  if (!user || isAdmin) {
    return null;
  }

  const menuItems = [
    {
      icon: <FiGrid className="w-5 h-5" />,
      title: "Overview",
      link: "/dashboard",
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      title: "Events",
      link: "/dashboard/events",
    },
    {
      icon: <FiCast className="w-5 h-5" />,
      title: "Tickets",
      link: "/dashboard/tickets",
    },
    {
      icon: <FiUser className="w-5 h-5" />,
      title: "Profile",
      link: "/dashboard/profile",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        text: "Upcoming",
        className: "bg-emerald-100 text-emerald-800",
      };
    } else if (now > end) {
      return {
        text: "Completed",
        className: "bg-gray-100 text-gray-800",
      };
    } else {
      return {
        text: "Ongoing",
        className: "bg-blue-100 text-blue-800",
      };
    }
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.start_date) > now)
      .sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const getTimeUntilEvent = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(start.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-gray-50">
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
            <h1 className="text-2xl font-bold text-gray-900 ml-2">Dashboard</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 pl-35">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>

          {/* Notifications and Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={handleNotificationClick}
            >
              <FiBell className="w-6 h-6 text-gray-600" />
              {upcomingEvents.length > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {upcomingEvents.length}
                </span>
              )}
            </button>
            
            {/* Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">User</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/dashboard/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <FiUser className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600" 
                  onClick={logout}
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu - Modified to remove logout button since it's now in dropdown */}
        <div
          className={`lg:hidden transition-all duration-200 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-6">
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Events List</h2>
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
                        <div className="flex items-center text-sm">
                          <FiTag className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{event.category}</span>
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

      {/* Notification Modal */}
      <Dialog
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upcoming Events Notifications</DialogTitle>
            <DialogDescription>
              You have {upcomingEvents.length} upcoming events
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-center text-gray-500">No upcoming events</p>
              ) : (
                upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setIsNotificationModalOpen(false);
                      handleEventClick(event);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Starts in {getTimeUntilEvent(event.start_date)}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <FiMapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsNotificationModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Event Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>Event Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Description
                  </h4>
                  <p className="mt-1 text-sm">{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Start Date
                    </h4>
                    <p className="mt-1 text-sm">
                      {formatDate(selectedEvent.start_date)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      End Date
                    </h4>
                    <p className="mt-1 text-sm">
                      {formatDate(selectedEvent.end_date)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Location
                  </h4>
                  <p className="mt-1 text-sm">{selectedEvent.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Maximum Participants
                  </h4>
                  <p className="mt-1 text-sm">
                    {selectedEvent.max_participants}
                  </p>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
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
