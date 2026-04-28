import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Submit feedback
export const submitFeedback = async (data) => {
  const response = await api.post("/feedback", data);
  return response.data;
};

// Get all feedbacks (paginated)
export const getAllFeedbacks = async (page = 1, limit = 10) => {
  const response = await api.get(`/feedbacks?page=${page}&limit=${limit}`);
  return response.data;
};

// Get feedbacks by subject (paginated)
export const getFeedbacksBySubject = async (subject, page = 1, limit = 10) => {
  const response = await api.get(
    `/feedbacks/${encodeURIComponent(subject)}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Delete feedback
export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedbacks/${id}`);
  return response.data;
};

// Admin login
export const adminLogin = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export default api;
