import React, { useEffect, useState } from "react";
import { getTechnicianAppointments } from "../services/appointmentService";
import { addServiceRecord, updateServiceStatus, getServiceHistory } from "../services/serviceRecordService";
import TechnicianTaskCard from "../components/TechnicianTaskCard";

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
        
        // Apply frontend filter if specified (e.g., for "In Progress" view)
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


  // Persist repair details and replaced parts
  const handleUpdate = async (appointmentId, { repairDetails, replacedParts }) => {
    try {
      // Find if a ServiceRecord exists for this appointment
      const appointment = tasks.find(t => t._id === appointmentId);
      const record = serviceRecords.find(r =>
        r.vehicleId?._id === appointment.vehicleId?._id &&
        r.technicianId?._id === (appointment.technicianId?._id || appointment.technicianId)
      );
      let recordId = record?._id;
      if (!recordId) {
        // Create ServiceRecord if not exists
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

  // Change status (IN_PROGRESS or COMPLETED)
  const handleStatusChange = async (appointmentId, { repairDetails, replacedParts, status }) => {
    try {
      // Find if a ServiceRecord exists for this appointment
      const appointment = tasks.find(t => t._id === appointmentId);
      const record = serviceRecords.find(r =>
        r.vehicleId?._id === appointment.vehicleId?._id &&
        r.technicianId?._id === (appointment.technicianId?._id || appointment.technicianId)
      );
      let recordId = record?._id;
      if (!recordId) {
        // Create ServiceRecord if not exists
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

      // Refresh list: if status is COMPLETED, it should disappear from active dashboard
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{filter === 'IN_PROGRESS' ? 'Active Tasks' : 'Technician Dashboard'}</h1>
      <p className="text-slate-400 font-medium mb-6">
        {filter === 'IN_PROGRESS' ? 'Manage your current in-progress services.' : 'View and manage your assigned tasks.'}
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">No {filter === 'IN_PROGRESS' ? 'tasks in progress' : 'assigned tasks'}.</div>
      ) : (
        <div className="space-y-4">
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
  );
};

export default TechnicianDashboard;