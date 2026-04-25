import React, { useEffect, useState } from "react";
import { getServiceHistory } from "../services/serviceRecordService";

const TechnicianHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const allRecords = await getServiceHistory();

        setHistory(
          allRecords.filter(
            (record) => record.serviceStatus === "COMPLETED"
          )
        );
      } catch (err) {
        setError("Failed to load technician history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            Completed Jobs
          </h1>
          <p className="text-slate-500">
            All services you have completed as a technician
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-500 px-5 py-4 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Empty */}
        {history.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-10 text-center">
            <p className="text-slate-500 italic">
              No completed jobs found.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {history.map((record) => (
              <div
                key={record._id}
                className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 md:p-8"
              >
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Section */}
                  <div className="md:col-span-2">
                    {/* Vehicle */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                        🚗
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {record.vehicleId?.model}
                        </h3>
                        <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest">
                          {record.vehicleId?.vehicleNumber}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                      Completed Date :{" "}
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>

                    {/* Details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Repair Details
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {record.repairDetails}
                      </p>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col justify-between gap-6">
                    {/* Status */}
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                        Status
                      </p>

                      <span className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-500">
                        COMPLETED
                      </span>
                    </div>

                    {/* Customer */}
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                        Customer
                      </p>

                      <p className="font-semibold text-slate-800">
                        {record.vehicleId?.userId?.name || "-"}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="bg-green-50 text-green-600 rounded-2xl px-4 py-3 text-sm font-semibold text-center">
                      Successfully Finished
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianHistory;