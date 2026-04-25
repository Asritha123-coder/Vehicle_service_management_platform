import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assignTechnician } from "../services/appointmentService";
import api from "../services/api";
import { getUserInvoices, createInvoice } from "../services/invoiceService";
import { 
  Briefcase, 
  Users, 
  Wrench, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Plus
} from "lucide-react";

const ServiceCenterDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, techRes, invoiceRes] = await Promise.all([
          api.get("/appointment/all"),
          api.get("/user/technicians"),
          getUserInvoices()
        ]);
        setAppointments(apptRes.data);
        setTechnicians(techRes.data);
        setInvoices(invoiceRes);
      } catch (err) {
        setError("Failed to load operational data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (appointmentId, technicianId) => {
    setAssigning(appointmentId);
    setSuccess("");
    setError("");

    try {
      await assignTechnician(appointmentId, technicianId);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, technicianId: technicians.find(t => t._id === technicianId) } : appt
        )
      );
      setSuccess("Technician assigned!");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError("Assignment failed.");
    } finally {
      setAssigning("");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600';
      case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-600';
      case 'ASSIGNED': return 'bg-blue-50 text-blue-600';
      default: return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="animate-spring-up">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100">
                  <Briefcase className="text-white w-5 h-5" />
              </div>
              <h1 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">Operational Hub</h1>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Service <span className="text-slate-400">Logistics</span></h2>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-4 py-2 border-r border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Techs</p>
              <p className="text-lg font-black text-slate-900 leading-none mt-1">{technicians.length}</p>
           </div>
           <div className="px-4 py-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Queue</p>
              <p className="text-lg font-black text-slate-900 leading-none mt-1">{appointments.length}</p>
           </div>
        </div>
      </header>

      {/* Messaging */}
      {(error || success) && (
        <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold animate-spring-in ${error ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
            {error ? <CheckCircle className="rotate-45" size={20} /> : <CheckCircle size={20} />}
            {error || success}
        </div>
      )}

      {/* High Performance Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <div className="relative group max-w-xs w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input type="text" placeholder="Filter bookings..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              <Filter size={14} /> View Preferences
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 text-left">Vehicle Details</th>
                <th className="px-6 py-5 text-left">Customer</th>
                <th className="px-6 py-5 text-left">Service Type</th>
                <th className="px-6 py-5 text-left">Status</th>
                <th className="px-6 py-5 text-left">Assigned Tech</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading operational pulse...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="6" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active bookings found</td></tr>
              ) : (
                appointments.map((appt) => {
                  const invoice = invoices.find(inv => inv.vehicleId?._id === appt.vehicleId?._id);
                  const status = appt.serviceStatus || appt.status;
                  
                  return (
                    <tr key={appt._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Wrench size={18} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 tracking-tight">{appt.vehicleId?.model || "Standard Car"}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{appt.vehicleId?.vehicleNumber || "No Plate"}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <p className="text-sm font-bold text-slate-700">{appt.customerName || "Member"}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic">{new Date(appt.appointmentDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-6">
                         <div className="inline-flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-tighter">
                            <Plus size={12} /> {appt.serviceType}
                         </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ring-inset ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="relative inline-block w-48 group/select">
                           <select
                              value={appt.technicianId?._id || appt.technicianId || ""}
                              onChange={(e) => handleAssign(appt._id, e.target.value)}
                              disabled={assigning === appt._id}
                              className="w-full appearance-none bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all pr-10 cursor-pointer"
                           >
                              <option value="">Choose Specialist</option>
                              {technicians.map((tech) => (
                                <option key={tech._id} value={tech._id}>{tech.name}</option>
                              ))}
                           </select>
                           <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/select:text-blue-500 transition-colors" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {status === "COMPLETED" && invoice ? (
                              <button 
                                onClick={() => navigate(`/invoices/${invoice._id}`)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${invoice.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"}`}
                              >
                                 {invoice.paymentStatus} <ExternalLink size={12} />
                              </button>
                           ) : status === "COMPLETED" && !invoice ? (
                              <button
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                                onClick={async () => {
                                  try {
                                    await createInvoice({ vehicleId: appt.vehicleId?._id, totalAmount: 500, paymentStatus: "PENDING" });
                                    setSuccess("Digital invoice emitted.");
                                    const invoiceRes = await getUserInvoices();
                                    setInvoices(invoiceRes);
                                  } catch (err) { setError("Invoice emission failed."); }
                                }}
                              >
                                Generate
                              </button>
                           ) : (
                              <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-200">
                                 <Clock size={16} />
                              </div>
                           )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;