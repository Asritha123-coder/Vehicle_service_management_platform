import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/adminService";
import { getAllAppointments } from "../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, CheckCircle, Clock, ShieldAlert, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, apptsData] = await Promise.all([
          getAllUsers(),
          getAllAppointments()
        ]);
        setUsers(usersData);
        setAppointments(apptsData);
      } catch (err) {
        setError("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading Dashboard...</div>;

  const stats = {
    totalUsers: users.length,
    totalAppointments: appointments.length,
    completedServices: appointments.filter(a => (a.serviceStatus || a.status) === "COMPLETED").length,
    pendingServices: appointments.filter(a => (a.serviceStatus || a.status) === "PENDING" || (a.serviceStatus || a.status) === "ASSIGNED").length,
  };

  return (
    <div className="p-8 text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="text-primary" /> System Overview
        </h1>
        <p className="text-slate-400 mt-1">Real-time platform performance and metrics</p>
      </header>

      {error && <div className="badge badge-error mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border-l-4 border-blue-500 cursor-pointer hover:bg-white/5" onClick={() => navigate('/admin/users')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Users size={24} />
            </div>
            <ArrowRight size={16} className="text-slate-600" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Users</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-purple-500 cursor-pointer hover:bg-white/5" onClick={() => navigate('/admin/appointments')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Calendar size={24} />
            </div>
            <ArrowRight size={16} className="text-slate-600" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalAppointments}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Appointments</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <CheckCircle size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats.completedServices}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Completed</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-yellow-500 cursor-pointer hover:bg-white/5" onClick={() => navigate('/admin/appointments')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
              <Clock size={24} />
            </div>
            <ArrowRight size={16} className="text-slate-600" />
          </div>
          <h3 className="text-3xl font-bold">{stats.pendingServices}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pending Action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Appointments</h2>
            <button onClick={() => navigate('/admin/appointments')} className="text-xs text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {appointments.slice(0, 5).map(appt => (
              <div key={appt._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition border border-white/5">
                <div>
                  <p className="font-bold text-sm">{appt.vehicleId?.model || "Unknown Car"}</p>
                  <p className="text-xs text-slate-500">{appt.serviceType}</p>
                </div>
                <span className={`badge text-[10px] ${
                  (appt.serviceStatus || appt.status) === 'COMPLETED' ? 'badge-success' : 'badge-warning'
                }`}>
                  {appt.serviceStatus || appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">User Distribution</h2>
            <button onClick={() => navigate('/admin/users')} className="text-xs text-primary font-bold hover:underline">Manage Users</button>
          </div>
          <div className="space-y-6 pt-4">
            {['customer', 'technician', 'admin', 'service_center'].map(role => {
              const count = users.filter(u => u.role === role).length;
              const percentage = (count / users.length) * 100;
              return (
                <div key={role}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="capitalize font-bold text-slate-400">{role.replace('_', ' ')}s</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;