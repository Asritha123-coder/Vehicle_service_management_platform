import React, { useEffect, useState } from "react";
import { getUserInvoices, updatePaymentStatus } from "../services/invoiceService";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔍 Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getUserInvoices();
      setInvoices(data);
    } catch (err) {
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      await updatePaymentStatus(invoiceId, newStatus);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === invoiceId ? { ...inv, paymentStatus: newStatus } : inv
        )
      );
      setSuccess("Payment status updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  // ✅ Filtering Logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.vehicleId?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vehicleId?.vehicleNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || inv.paymentStatus === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(inv.createdAt).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading)
    return (
      <div className="p-10 text-center text-slate-600">
        Loading Invoices...
      </div>
    );

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
          <FileText className="text-primary" /> Invoice Management
        </h1>
        <p className="text-slate-600 mt-1">
          Track payments and financial records across the platform
        </p>
      </header>

      {/* Alerts */}
      {error && (
        <div className="badge badge-error mb-6 py-4 px-6 rounded-xl w-full">
          {error}
        </div>
      )}
      {success && (
        <div className="badge badge-success mb-6 py-4 px-6 rounded-xl w-full">
          {success}
        </div>
      )}

      {/* 🔍 Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by vehicle or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-full md:w-1/4"
        >
          <option value="ALL">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-full md:w-1/4"
        />
      </div>

      {/* Table */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-4 py-4">Vehicle Details</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv._id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-slate-900">
                        {inv.vehicleId?.model || "Unknown Vehicle"}
                      </div>
                      <div className="text-[10px] text-slate-600 uppercase">
                        {inv.vehicleId?.vehicleNumber || "N/A"}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-primary font-bold">
                      ${inv.totalAmount?.toFixed(2)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`badge text-[10px] ${
                          inv.paymentStatus === "PAID"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-600">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/invoices/${inv._id}`)
                          }
                          className="btn-secondary py-1 px-3 text-xs"
                        >
                          View Details
                        </button>

                        {inv.paymentStatus === "PENDING" ? (
                          <button
                            onClick={() =>
                              handleStatusUpdate(inv._id, "PAID")
                            }
                            className="btn-primary py-1 px-3 text-xs"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusUpdate(inv._id, "PENDING")
                            }
                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 py-1 px-3 text-xs rounded-lg transition"
                          >
                            Unmark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-slate-500"
                  >
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;