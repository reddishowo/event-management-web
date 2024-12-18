import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser, FiLogOut, FiGrid, FiSettings, FiBell, FiMapPin } from 'react-icons/fi';
import { fetchEvents } from '../../utils/api';

// Interface untuk tipe data Event
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

  useEffect(() => {
    console.log('Dashboard User:', user);
    console.log('Is Admin:', isAdmin);

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
    { icon: <FiSettings className="w-5 h-5" />, title: 'Settings', link: '/dashboard/settings' },
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get event status
  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        text: 'Upcoming',
        className: 'bg-green-100 text-green-800'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <FiBell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {events.filter(event => new Date(event.start_date) > new Date()).length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-[calc(100vh-73px)] p-6">
          <div className="space-y-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center space-x-3 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 w-full"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm">Upcoming Events</h3>
                <FiCalendar className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {events.filter(event => new Date(event.start_date) > new Date()).length}
              </p>
              <p className="text-gray-500 text-sm mt-2">Total upcoming events</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm">Ongoing Events</h3>
                <FiGrid className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {events.filter(event => {
                  const now = new Date();
                  return new Date(event.start_date) <= now && new Date(event.end_date) >= now;
                }).length}
              </p>
              <p className="text-gray-500 text-sm mt-2">Currently active events</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm">Total Events</h3>
                <FiUser className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{events.length}</p>
              <p className="text-gray-500 text-sm mt-2">All time events</p>
            </div>
          </div>

          {/* Events Table */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Events List</h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => {
                        const status = getEventStatus(event.start_date, event.end_date);
                        return (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {event.description}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {formatDate(event.start_date)} - {formatDate(event.end_date)}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FiMapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                Max: {event.max_participants}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                                {status.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}