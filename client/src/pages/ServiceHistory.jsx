import React, { useEffect, useState } from "react";
import { getServiceHistory } from "../services/serviceRecordService";
import { getUserInvoices } from "../services/invoiceService";

const ServiceHistory = () => {
  const [history, setHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [data, invs] = await Promise.all([
          getServiceHistory(),
          getUserInvoices(),
        ]);

        setHistory(data);
        setInvoices(invs);
      } catch (err) {
        setError("Failed to load service history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Service History
          </h1>
          <p className="text-slate-700">
            Track all maintenance and repairs done for your vehicles
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-500 px-5 py-4 rounded-2xl font-medium text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-10 text-center">
            <p className="text-slate-700 italic">
              No service records found. Book your first service today!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {history.map((record) => {
              const inv = invoices.find(
                (inv) =>
                  inv.vehicleId?._id === record.vehicleId?._id ||
                  inv.vehicleId === record.vehicleId?._id
              );

              return (
                <div
                  key={record._id}
                  className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 md:p-8"
                >
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Section */}
                    <div className="md:col-span-2">
                      {/* Vehicle Info */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                          {record.vehicleId?.imageUrl ? (
                            <img
                              src={record.vehicleId.imageUrl}
                              alt={record.vehicleId.model}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl text-slate-600">🚗</span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {record.vehicleId?.model}
                          </h3>
                          <p className="text-sm font-semibold text-blue-500 tracking-widest uppercase">
                            {record.vehicleId?.vehicleNumber}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                        Service Date :{" "}
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>

                      {/* Details */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-xs font-bold text-slate-700 uppercase mb-2">
                          Repair Details
                        </p>
                        <p className="text-slate-700 leading-relaxed text-sm">
                          {record.repairDetails}
                        </p>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col justify-between gap-6">
                      {/* Status */}
                      <div>
                        <p className="text-xs text-slate-700 uppercase font-bold mb-2">
                          Service Status
                        </p>

                        <span
                          className={`inline-block px-4 py-2 rounded-xl text-xs font-bold text-white ${
                            record.serviceStatus === "COMPLETED"
                              ? "bg-green-500"
                              : record.serviceStatus === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {record.serviceStatus}
                        </span>
                      </div>

                      {/* Technician */}
                      <div>
                        <p className="text-xs text-slate-700 uppercase font-bold mb-2">
                          Assigned Technician
                        </p>
                        <p className="font-semibold text-slate-900">
                          {record.technicianId?.name || "Team Member"}
                        </p>
                      </div>

                      {/* Invoice Buttons */}
                      <div className="space-y-3">
                        {inv ? (
                          <>
                            <button
                              onClick={() =>
                                (window.location.href = `/invoices/${inv._id}`)
                              }
                              className={`w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                inv.paymentStatus === "PAID"
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : "bg-red-100 text-red-500 hover:bg-red-200"
                              }`}
                            >
                              {inv.paymentStatus === "PAID"
                                ? "View Receipt"
                                : "Pay Invoice"}
                            </button>

                            {inv.paymentStatus === "PENDING" && (
                              <button
                                onClick={() =>
                                  (window.location.href = `/pay/${inv._id}`)
                                }
                                className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
                              >
                                Checkout Now
                              </button>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-slate-600 italic">
                            Processing Invoice...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;