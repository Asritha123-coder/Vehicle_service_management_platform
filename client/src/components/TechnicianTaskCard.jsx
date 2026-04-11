import React, { useState } from "react";


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

  return (
    <div className="glass-card p-6 mb-4">
      <div className="mb-2">
        <span className="font-bold">Vehicle:</span> {appointment.vehicleId?.model} ({appointment.vehicleId?.vehicleNumber})
      </div>
      <div className="mb-2">
        <span className="font-bold">Service Type:</span> {appointment.serviceType}
      </div>
      <div className="mb-2">
        <span className="font-bold">Appointment Date:</span> {new Date(appointment.appointmentDate).toLocaleDateString()}
      </div>
      <div className="mb-2">
        <span className="font-bold text-white">Status:</span> 
        <span className={`badge ml-2 ${
          status === 'IN_PROGRESS' ? 'badge-info' : 
          status === 'ASSIGNED' ? 'badge-warning' : 'badge-success'
        }`}>
          {status}
        </span>
      </div>
      <div className="mb-2 mt-4">
        <label className="font-bold text-slate-300">Repair Details:</label>
        <textarea
          className="input w-full mt-1 bg-white/5 border-white/10 text-white"
          value={repairDetails}
          onChange={e => setRepairDetails(e.target.value)}
          rows={2}
          placeholder="What's being fixed?"
        />
      </div>
      <div className="mb-2">
        <label className="font-bold text-slate-300">Replaced Parts:</label>
        <input
          className="input w-full mt-1 bg-white/5 border-white/10 text-white"
          value={replacedParts}
          onChange={e => setReplacedParts(e.target.value)}
          placeholder="Specify parts used..."
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button
          className="btn btn-primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          Update Record
        </button>
        <button
          className="btn btn-info"
          onClick={() => handleStatusChange("IN_PROGRESS")}
          disabled={loading || status === "IN_PROGRESS" || status === "COMPLETED"}
        >
          Start Service
        </button>
        <button
          className="btn btn-success"
          onClick={() => handleStatusChange("COMPLETED")}
          disabled={loading || status === "COMPLETED"}
        >
          Mark as Done
        </button>
      </div>
    </div>
  );
};

export default TechnicianTaskCard;
