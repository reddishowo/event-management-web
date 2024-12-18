import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL backend Laravel
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fungsi untuk mengambil events
export const fetchEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/events', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export default api;