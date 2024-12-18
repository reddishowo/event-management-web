import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/router';

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
    // Redirect if no user is logged in
    if (!user) {
      router.push('/auth/Login');
      return;
    }
  
    // Redirect non-admin users
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
  
    // Fetch events data for admin
    fetchEvents();
  }, [user, isAdmin, router]);
  
  // If no user or not an admin, return null
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
        // Update existing event
        await api.put(`/events/${eventForm.id}`, eventForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        // Create new event
        await api.post('/events', eventForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      
      // Reset form and refresh events
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

  // If not an admin, don't render anything
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Event Management</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      <h2 className="text-xl mb-4">Create / Update Event</h2>
      <form onSubmit={handleSubmitEvent} className="mb-6">
        <input
          type="text"
          name="title"
          value={eventForm.title}
          onChange={handleInputChange}
          placeholder="Event Title"
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          name="description"
          value={eventForm.description}
          onChange={handleInputChange}
          placeholder="Event Description"
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="datetime-local"
          name="start_date"
          value={eventForm.start_date}
          onChange={handleInputChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="datetime-local"
          name="end_date"
          value={eventForm.end_date}
          onChange={handleInputChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="location"
          value={eventForm.location}
          onChange={handleInputChange}
          placeholder="Event Location"
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="number"
          name="max_participants"
          value={eventForm.max_participants}
          onChange={handleInputChange}
          placeholder="Max Participants"
          className="border p-2 w-full mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {eventForm.id ? 'Update Event' : 'Create Event'}
        </button>
      </form>

      <h2 className="text-xl mb-4">Event List</h2>
      {isLoading ? (
        <p>Loading events...</p>
      ) : (
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="border p-2">{event.title}</td>
                <td className="border p-2">{event.start_date}</td>
                <td className="border p-2">
                  <button
                    onClick={() => setEventForm(event)}
                    className="bg-yellow-500 text-white px-4 py-2 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}