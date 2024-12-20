import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL backend Laravel
  headers: {
    "Content-Type": "application/json",
  },
});

// Fungsi untuk mengambil events
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

export const updateProfile = async (profileData: {
  name: string;
  email: string;
}) => {
  const response = await api.put("/user/profile", profileData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

export const updatePassword = async (passwordData: {
  current_password: string;
  new_password: string;
}) => {
  const response = await api.put("/user/password", passwordData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

export default api;
