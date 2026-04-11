import api from "./api";

// Book a new service appointment
export const bookAppointment = async (appointmentData) => {
  const response = await api.post("/appointment/book", appointmentData);
  return response.data;
};

// Get all appointments for the current user
export const getUserAppointments = async () => {
  const response = await api.get("/appointment/my");
  return response.data;
};

// Get all appointments (Admin/Service Center)
export const getAllAppointments = async () => {
  const response = await api.get("/appointment/all");
  return response.data;
};

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(`/appointment/${id}`, { status });
  return response.data;
};

// Assign a technician to an appointment
export const assignTechnician = async (appointmentId, technicianId) => {
  const response = await api.put(`/appointment/assign/${appointmentId}`, { technicianId });
  return response.data;
};

// Get technician specific appointments
export const getTechnicianAppointments = async () => {
  const response = await api.get("/appointment/technician");
  return response.data;
};