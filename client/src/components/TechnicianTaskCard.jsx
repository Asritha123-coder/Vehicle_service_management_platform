import React, { useState } from "react";
import { 
  Car, 
  Wrench, 
  Clock, 
  CheckCircle, 
  Play, 
  Save, 
  PlusCircle,
  FileText,
  AlertCircle
} from "lucide-react";

const TechnicianTaskCard = ({ appointment, onUpdate, onStatusChange }) => {
  const [repairDetails, setRepairDetails] = useState(appointment.repairDetails || "");
  const [replacedParts, setReplacedParts] = useState(appointment.replacedParts || "");
  const [status, setStatus] = useState(appointment.status || "ASSIGNED");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await onUpdate(appointment._id, { repairDetails, replacedParts });
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    await onStatusChange(appointment._id, { repairDetails, replacedParts, status: newStatus });
    setStatus(newStatus);
    setLoading(false);
  };

  const getStatusConfig = (s) => {
    switch(s) {
      case 'IN_PROGRESS': return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Clock size={14} className="animate-spin" /> };
      case 'COMPLETED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle size={14} /> };
      default: return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertCircle size={14} /> };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
      <div className="absolute top-0 right-0 p-8 text-slate-600/10 group-hover:text-slate-600/20 transition-colors pointer-events-none">
        <Wrench size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors">
              <Car size={32} className="text-slate-600 group-hover:text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                {appointment.vehicleModel || appointment.vehicleId?.model || "Standard Vehicle"}
              </p>
              <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mt-1">
                {appointment.vehicleNumber || appointment.vehicleId?.vehicleNumber || "NO PLATE"}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border} ${config.color} text-[10px] font-black uppercase tracking-widest`}>
                {config.icon}
                {status?.replace('_', ' ')}
             </div>
             <p className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest">
               <Wrench size={14} /> {appointment.serviceType}
             </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                <FileText size={14} /> Repair Observations
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                value={repairDetails}
                onChange={e => setRepairDetails(e.target.value)}
                rows={3}
                placeholder="What observations have you made? Specify the issues fixed..."
              />
           </div>
           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                <PlusCircle size={14} /> Replaced Components
              </label>
              <input
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                value={replacedParts}
                onChange={e => setReplacedParts(e.target.value)}
                placeholder="List parts used (e.g. Oil Filter, Brake Pads)"
              />
              <p className="text-[10px] font-bold text-slate-600 uppercase italic">Separate multiple items with commas.</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <Save size={16} /> Save Progress
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>

          <button
            onClick={() => handleStatusChange("IN_PROGRESS")}
            disabled={loading || status === "IN_PROGRESS" || status === "COMPLETED"}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-40"
          >
            <Play size={16} /> Start Service
          </button>

          <button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading || status === "COMPLETED"}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-40"
          >
            <CheckCircle size={16} /> Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianTaskCard;
