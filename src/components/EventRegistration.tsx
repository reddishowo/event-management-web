import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
}

interface RegistrationStatus {
  isRegistered: boolean;
  isOpen: boolean;
  currentParticipants: number;
  maxParticipants: number;
}

interface EventRegistrationSystemProps {
  event: Event;
  onRegistrationUpdate?: () => void;
}

const EventRegistrationSystem: React.FC<EventRegistrationSystemProps> = ({ event, onRegistrationUpdate }) => {
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>({
    isRegistered: false,
    isOpen: true,
    currentParticipants: 0,
    maxParticipants: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (event) {
      checkRegistrationStatus();
    }
  }, [event]);

const checkRegistrationStatus = async () => {
  try {
    const response = await api.get(`/events/${event.id}/check-registration`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = response.data;
    setRegistrationStatus({
      isRegistered: data.registered,
      isOpen: data.registration_open,
      currentParticipants: data.current_participants,
      maxParticipants: data.max_participants,
    });
  } catch (error) {
    setError('Failed to check registration status');
  }
};

const handleRegister = async () => {
  setLoading(true);
  setError('');
  try {
    await api.post(`/events/${event.id}/register`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    await checkRegistrationStatus();
    onRegistrationUpdate?.();
  } catch (error: any) {
    setError(error.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};

const handleCancel = async () => {
  setLoading(true);
  setError('');
  try {
    await api.post(`/events/${event.id}/cancel`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    await checkRegistrationStatus();
    onRegistrationUpdate?.();
  } catch (error: any) {
    setError(error.response?.data?.message || 'Cancellation failed');
  } finally {
    setLoading(false);
  }
};


  if (!event) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            registrationStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {registrationStatus.isOpen ? 'Registration Open' : 'Registration Closed'}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(event.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{registrationStatus.currentParticipants} / {registrationStatus.maxParticipants} participants</span>
          </div>
        </div>

        <div className="mt-4">
          {registrationStatus.isRegistered ? (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancel Registration
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading || !registrationStatus.isOpen}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Register for Event
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationSystem;