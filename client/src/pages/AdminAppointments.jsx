import React, { useEffect, useState } from "react";
import { getAllAppointments, assignTechnician } from "../services/appointmentService";
import api from "../services/api";
import { Calendar, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptsData, techsData] = await Promise.all([
        getAllAppointments(),
        api.get("/user/technicians").then(res => res.data)
      ]);
      setAppointments(apptsData);
      setTechnicians(techsData);
    } catch (err) {
      setError("Failed to load appointment data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTech = async (appointmentId, techId) => {
    try {
      await assignTechnician(appointmentId, techId);
      setAppointments(prev => prev.map(a => a._id === appointmentId ? { ...a, technicianId: techId } : a));
      setSuccess("Technician assigned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to assign technician.");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading Appointments...</div>;

  return (
    <div className="p-8 text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="text-primary" /> Appointment Management
        </h1>
        <p className="text-slate-400 mt-1">Monitor and assign all incoming service requests</p>
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
                <th className="px-4 py-4">Vehicle & Customer</th>
                <th className="px-4 py-4">Service Type</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Technician</th>
                <th className="px-4 py-4">Assign Tech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {appointments.map(appt => (
                <tr key={appt._id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold">{appt.vehicleId?.model}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{appt.customerName || "-"}</div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">{appt.serviceType}</td>
                  <td className="px-4 py-4">
                    <span className={`badge text-[10px] ${
                      (appt.serviceStatus || appt.status) === 'COMPLETED' ? 'badge-success' : 
                      (appt.serviceStatus || appt.status) === 'IN_PROGRESS' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {appt.serviceStatus || appt.status}
                    </span>
                    {(appt.serviceStatus || appt.status) === 'COMPLETED' && (
                      <button 
                        onClick={() => navigate('/admin/invoices')}
                        className="flex items-center gap-1 mt-2 text-[10px] text-primary hover:text-primary/80 font-bold uppercase transition"
                      >
                        <FileText size={10} /> View Invoice
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {appt.technicianId?.name || <span className="text-slate-500 italic">Not Assigned</span>}
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      className="bg-slate-800 border-white/10 text-xs rounded-md p-2 focus:ring-1 focus:ring-primary outline-none"
                      value={appt.technicianId?._id || appt.technicianId || ""}
                      onChange={(e) => handleAssignTech(appt._id, e.target.value)}
                    >
                      <option value="">Choose Tech</option>
                      {technicians.map(tech => (
                        <option key={tech._id} value={tech._id}>{tech.name}</option>
                      ))}
                    </select>
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

export default AdminAppointments;
