import axios from "axios";

// Define interfaces for type safety
export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
}

export interface Ticket extends Event {
  ticket_code: string;
  status: string;
}

export interface ProfileData {
  name: string;
  email: string;
}

export interface PasswordData {
  current_password: string;
  new_password: string;
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Events
export const fetchEvents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// User Profile
export const updateProfile = async (profileData: ProfileData) => {
  const response = await api.put("/user/profile", profileData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updatePassword = async (passwordData: PasswordData) => {
  const response = await api.put("/user/password", passwordData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// Tickets
export const fetchUserTickets = async () => {
  try {
    const response = await api.get("/tickets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketDetails = async (ticketId: number) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    throw error;
  }
};

// Event Registration
export const registerForEvent = async (eventId: number) => {
  try {
    const response = await api.post(
      `/events/${eventId}/register`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
};

export const cancelEventRegistration = async (eventId: number) => {
  try {
    const response = await api.post(
      `/events/${eventId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling event registration:", error);
    throw error;
  }
};

// Helper function to add auth header
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;