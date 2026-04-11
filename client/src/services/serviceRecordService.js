import api from "./api";

// Get service history for the current user (based on their vehicles)
export const getServiceHistory = async () => {
  const response = await api.get("/service-record");
  return response.data;
};

// Add a new service record (technician use case)
export const addServiceRecord = async (recordData) => {
  const response = await api.post("/service-record/add", recordData);
  return response.data;
};

// Update service status
export const updateServiceStatus = async (id, statusData) => {
  const response = await api.put(`/service-record/update/${id}`, statusData);
  return response.data;
};