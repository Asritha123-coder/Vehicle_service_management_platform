import React, { useEffect, useState } from "react";
import { getTechnicianAppointments } from "../services/appointmentService";
import { addServiceRecord, updateServiceStatus, getServiceHistory } from "../services/serviceRecordService";
import TechnicianTaskCard from "../components/TechnicianTaskCard";
import { 
  ClipboardList, 
  Activity, 
  History, 
  Settings,
  ShieldCheck,
  TrendingUp,
  Layout
} from "lucide-react";

const TechnicianDashboard = ({ filter }) => {
  const [tasks, setTasks] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [appointments, records] = await Promise.all([
          getTechnicianAppointments(),
          getServiceHistory()
        ]);
        
        let filteredAppointments = appointments;
        if (filter) {
           filteredAppointments = appointments.filter(a => a.status === filter);
        }

        setTasks(filteredAppointments);
        setServiceRecords(records);
      } catch (err) {
        setError("Failed to load assigned tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filter]);

  const handleUpdate = async (appointmentId, { repairDetails, replacedParts }) => {
    try {
      const appointment = tasks.find(t => t._id === appointmentId);
      const record = serviceRecords.find(r =>
        r.vehicleId?._id === appointment.vehicleId?._id &&
        r.technicianId?._id === (appointment.technicianId?._id || appointment.technicianId)
      );
      let recordId = record?._id;
      if (!recordId) {
        const newRecord = await addServiceRecord({
          vehicleId: appointment.vehicleId?._id || appointment.vehicleId,
          technicianId: appointment.technicianId?._id || appointment.technicianId,
          repairDetails,
          replacedParts,
          serviceStatus: "IN_PROGRESS"
        });
        recordId = newRecord.record._id;
        setServiceRecords(records => [...records, newRecord.record]);
      } else {
        await updateServiceStatus(recordId, { repairDetails, replacedParts });
      }
      setTasks(tasks => tasks.map(task =>
        task._id === appointmentId ? { ...task, repairDetails, replacedParts } : task
      ));
    } catch (err) {
      setError("Failed to update details.");
    }
  };

  const handleStatusChange = async (appointmentId, { repairDetails, replacedParts, status }) => {
    try {
      const appointment = tasks.find(t => t._id === appointmentId);
      const record = serviceRecords.find(r =>
        r.vehicleId?._id === appointment.vehicleId?._id &&
        r.technicianId?._id === (appointment.technicianId?._id || appointment.technicianId)
      );
      let recordId = record?._id;
      if (!recordId) {
        const newRecord = await addServiceRecord({
          vehicleId: appointment.vehicleId?._id || appointment.vehicleId,
          technicianId: appointment.technicianId?._id || appointment.technicianId,
          repairDetails,
          replacedParts,
          serviceStatus: status
        });
        recordId = newRecord.record._id;
        setServiceRecords(records => [...records, newRecord.record]);
      } else {
        await updateServiceStatus(recordId, { serviceStatus: status, repairDetails, replacedParts });
      }

      if (status === "COMPLETED") {
        setTasks(tasks => tasks.filter(task => task._id !== appointmentId));
      } else {
        setTasks(tasks => tasks.map(task =>
          task._id === appointmentId ? { ...task, repairDetails, replacedParts, status } : task
        ));
      }
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  return (
     <div className="animate-spring-up bg-white min-h-screen p-4 md:p-8 rounded-3xl shadow-xl">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-100/40">
            <ClipboardList className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
              {filter === 'IN_PROGRESS' ? 'Active ' : 'Assigned '}
              <span className="text-blue-600">ServiceHub</span>
            </h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">
              Technician Performance Protocol
            </p>
          </div>
        </div>
      </header>

      <div className="flex justify-end mb-8">
        <a
          href="/technician/profile"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-black shadow-lg hover:from-blue-600 hover:to-pink-600 transition-all"
        >
          <Settings size={18} /> My Profile
        </a>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Queue Total</p>
          <p className="text-2xl font-black text-blue-600 leading-none">{tasks.length}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Efficiency</p>
          <p className="text-2xl font-black text-emerald-600 leading-none">94%</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Uptime</p>
          <p className="text-2xl font-black text-blue-600 leading-none">100%</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Shift</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">Active</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {error && (
         <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
          <ShieldCheck size={20} /> {error}
         </div>
        )}

        {loading ? (
         <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
         </div>
        ) : tasks.length === 0 ? (
         <div className="bg-slate-50 border border-dashed border-slate-200 p-20 text-center rounded-[3rem]">
           <Activity className="mx-auto text-slate-300 mb-6" size={60} strokeWidth={1} />
           <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-sm">No Active Assignments</p>
           <p className="text-slate-400 text-xs font-bold mt-2">Stand by for upcoming service requests.</p>
         </div>
        ) : (
         <div className="grid grid-cols-1 gap-6">
          {tasks.map(task => (
            <TechnicianTaskCard
             key={task._id}
             appointment={task}
             onUpdate={handleUpdate}
             onStatusChange={handleStatusChange}
            />
          ))}
         </div>
        )}
      </div>
     </div>
  );
};

export default TechnicianDashboard;