import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/adminService";
import { getAllAppointments } from "../services/appointmentService";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Activity,
  UserCheck,
  Zap,
  MoreHorizontal,
  Plus
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    totalAppointments: appointments.length,
    completedServices: appointments.filter(a => (a.serviceStatus || a.status) === "COMPLETED").length,
    pendingServices: appointments.filter(a => ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(a.serviceStatus || a.status)).length,
  };

  const statCards = [
    { title: "Platform Users", value: stats.totalUsers, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50", path: "/admin/users" },
    { title: "Service Load", value: stats.totalAppointments, icon: <Calendar />, color: "text-indigo-600", bg: "bg-indigo-50", path: "/admin/appointments" },
    { title: "Success Rate", value: stats.completedServices, icon: <CheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50", path: "/admin/appointments" },
    { title: "Active Orders", value: stats.pendingServices, icon: <Activity />, color: "text-amber-600", bg: "bg-amber-50", path: "/admin/appointments" },
  ];

  return (
    <div className="animate-spring-up overflow-x-hidden">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <h1 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Command Center</h1>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">System <span className="text-blue-600">Intelligence</span></h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:text-blue-600 hover:border-blue-200 transition-all">
            <MoreHorizontal size={20} />
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Modern Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, i) => (
          <div
            key={i}
            onClick={() => card.path && navigate(card.path)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-8 ${card.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
              {React.cloneElement(card.icon, { size: 100, strokeWidth: 1 })}
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{card.value}</h3>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Appointments List */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Activity</h2>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Live service feedback</p>
            </div>
            <button onClick={() => navigate('/admin/appointments')} className="w-10 h-10 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all">
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-center py-10 text-slate-600 font-bold uppercase text-xs tracking-widest">No recent data</p>
            ) : (
              appointments.slice(0, 5).map(appt => (
                <div key={appt._id} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900">{appt.vehicleId?.model || "Standard Service"}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{appt.serviceType}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${(appt.serviceStatus || appt.status) === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {appt.serviceStatus || appt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Fleet Distribution</h2>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Role-based user health</p>
            </div>
            <button onClick={() => navigate('/admin/users')} className="p-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              Manage Access
            </button>
          </div>

          <div className="space-y-8 pt-2">
            {['customer', 'technician', 'admin', 'service_center'].map((role, idx) => {
              const count = users.filter(u => u.role === role).length;
              const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
              const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-emerald-600'];

              return (
                <div key={role} className="group">
                  <div className="flex justify-between items-end text-xs mb-3 font-black uppercase tracking-[0.15em]">
                    <span className="text-slate-500 group-hover:text-slate-900 transition-colors">{role.replace('_', ' ')}s</span>
                    <span className="text-slate-900">{count}</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <div
                      className={`h-full ${colors[idx]} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Platform Meta</p>
              <p className="text-xl font-black text-white mt-1">v2.1.0 Stable</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldAlert size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;