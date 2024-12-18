import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';
import { Trash2, Edit, LogOut } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-indigo-600 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Event Management</h1>
          <button
            onClick={logout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create / Update Event</h2>
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                placeholder="Event Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="location"
                value={eventForm.location}
                onChange={handleInputChange}
                placeholder="Event Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <textarea
              name="description"
              value={eventForm.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={eventForm.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={eventForm.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
              <input
                type="number"
                name="max_participants"
                value={eventForm.max_participants}
                onChange={handleInputChange}
                placeholder="Max Participants"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md transition-colors"
            >
              {eventForm.id ? 'Update Event' : 'Create Event'}
            </button>
          </form>
        </div>

        <div className="p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Event List</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{event.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{event.start_date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => setEventForm(event)}
                          className="text-yellow-600 hover:text-yellow-800 mr-4"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}