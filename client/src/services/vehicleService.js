import api from "./api";

export const addVehicle = async (vehicleData) => {
  const response = await api.post("/vehicle/add", vehicleData);
  return response.data;
};

export const getUserVehicles = async () => {
  const response = await api.get("/vehicle/my");
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicle/${id}`);
  return response.data;
};