import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assignTechnician } from "../services/appointmentService";
import api from "../services/api";
import { getUserInvoices, createInvoice } from "../services/invoiceService";

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
        const apptRes = await api.get("/appointment/all");
        setAppointments(apptRes.data);

        const techRes = await api.get("/user/technicians");
        setTechnicians(techRes.data);

        const invoiceRes = await getUserInvoices();
        setInvoices(invoiceRes);
      } catch (err) {
        setError("Failed to load data.");
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
          appt._id === appointmentId
            ? { ...appt, technicianId }
            : appt
        )
      );

      setSuccess("Technician assigned successfully!");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError("Failed to assign technician.");
    } finally {
      setAssigning("");
    }
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">
        Service Center Dashboard
      </h1>
      <p className="text-slate-400 mb-6">
        Manage bookings and assign technicians
      </p>

      {/* ALERTS */}
      {error && (
        <div className="badge badge-error mb-4 inline-block">
          {error}
        </div>
      )}

      {success && (
        <div className="badge badge-success mb-4 inline-block">
          {success}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="glass-card p-6 text-center text-slate-400">
          No appointments found
        </div>
      ) : (
        <div className="glass-card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="text-xs uppercase font-bold text-slate-300 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Repair</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Assign</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {appointments.map((appt) => {
                const invoice = invoices.find(
                  (inv) => inv.vehicleId?._id === appt.vehicleId?._id
                );
                return (
                  <tr
                    key={appt._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    {/* Vehicle */}
                    <td className="px-4 py-3">
                      {appt.vehicleId?.model || "-"} (
                      {appt.vehicleId?.vehicleNumber || "-"})
                    </td>
                    {/* Customer */}
                    <td className="px-4 py-3">
                      {appt.customerName || "-"}
                    </td>
                    {/* Service */}
                    <td className="px-4 py-3">
                      {appt.serviceType || "-"}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3">
                      {appt.appointmentDate
                        ? new Date(appt.appointmentDate).toLocaleDateString()
                        : "-"}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          (appt.serviceStatus || appt.status) === "COMPLETED"
                            ? "badge-success"
                            : (appt.serviceStatus || appt.status) === "IN_PROGRESS"
                            ? "badge-info"
                            : "badge-warning"
                        }`}
                      >
                        {appt.serviceStatus || appt.status}
                      </span>
                    </td>
                    {/* Technician */}
                    <td className="px-4 py-3">
                      {appt.technicianId?.name || "Unassigned"}
                    </td>
                    {/* Repair */}
                    <td className="px-4 py-3">
                      {appt.repairDetails || "-"}
                    </td>
                    {/* Invoice */}
                    <td className="px-4 py-3">
                      {(appt.serviceStatus || appt.status) === "COMPLETED" && invoice ? (
                        <span
                          className={`badge cursor-pointer ${
                            invoice.paymentStatus === "PAID"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                          onClick={() => navigate(`/invoices/${invoice._id}`)}
                          title="View Invoice"
                        >
                          {invoice.paymentStatus}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    {/* Assign */}
                    <td className="px-4 py-3">
                      <select
                        value={appt.technicianId?._id || appt.technicianId || ""}
                        onChange={(e) =>
                          handleAssign(
                            appt._id,
                            e.target.value
                          )
                        }
                        disabled={assigning === appt._id}
                      >
                        <option value="">Assign</option>
                        {technicians.map((tech) => (
                          <option key={tech._id} value={tech._id}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      {(appt.serviceStatus || appt.status) === "COMPLETED" && !invoice && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={async () => {
                            try {
                              const created = await createInvoice({
                                vehicleId: appt.vehicleId?._id,
                                totalAmount: 500, // Replace with real calculation if needed
                                paymentStatus: "PENDING"
                              });
                              setSuccess("Invoice generated!");
                              // Refresh invoices
                              const invoiceRes = await getUserInvoices();
                              setInvoices(invoiceRes);
                              // Route to invoices page (or specific invoice if you have that route)
                              setTimeout(() => navigate("/invoices"), 1000);
                            } catch (err) {
                              setError("Failed to generate invoice.");
                            }
                          }}
                        >
                          Generate Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceCenterDashboard;