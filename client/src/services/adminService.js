import api from "./api";

// Fetch all users (Admin only)
export const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/admin/user/${userId}`, { role });
    return response.data;
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/user/${userId}`);
    return response.data;
};
