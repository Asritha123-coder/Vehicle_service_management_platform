import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../services/adminService";
import { Trash2, ShieldAlert } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setSuccess("User role updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setSuccess("User deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading Users...</div>;

  return (
    <div className="p-8 text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="text-primary" /> User Management
        </h1>
        <p className="text-slate-400 mt-1">Manage system access and roles</p>
      </header>

      {error && <div className="badge badge-error mb-6 py-4 px-6 rounded-xl w-full flex items-center justify-between">
        <span>{error}</span>
      </div>}
      {success && <div className="badge badge-success mb-6 py-4 px-6 rounded-xl w-full flex items-center justify-between">
        <span>{success}</span>
      </div>}

      <div className="glass-card p-8 animate-in fade-in duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-4 py-4">User Details</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Change Role</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-white/5 transition group">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user.name && user.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge text-[10px] ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'technician' ? 'bg-blue-500/20 text-blue-400' :
                      user.role === 'service_center' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      className="bg-slate-800 border-white/10 text-xs rounded-md p-2 focus:ring-1 focus:ring-primary outline-none"
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="service_center">Service Center</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
