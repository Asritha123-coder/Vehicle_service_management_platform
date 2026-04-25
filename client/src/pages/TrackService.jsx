import React, { useEffect, useState } from "react";
import { getUserAppointments } from "../services/appointmentService";

const TrackService = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getUserAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch tracking data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getProgress = (status) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "ASSIGNED":
        return 25;
      case "IN_PROGRESS":
        return 60;
      case "COMPLETED":
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const activeAppointments = appointments.filter(
    (a) => a.status !== "COMPLETED"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-800 mb-3">
            Track Service
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time status of your active service appointments
          </p>
        </div>

        {/* Empty State */}
        {activeAppointments.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-12 text-center">
            <p className="text-slate-500 text-lg">
              No active services tracking. Completed services are in history.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeAppointments.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8"
              >
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                  {/* Vehicle Info */}
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {app.vehicleId?.imageUrl ? (
                        <img
                          src={app.vehicleId.imageUrl}
                          alt={app.vehicleId.model}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-slate-800">
                        {app.vehicleId?.model}
                      </h2>

                      <p className="text-blue-500 font-bold text-xs tracking-widest uppercase">
                        {app.serviceType}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-left lg:text-right">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
                      Current Status
                    </p>

                    <span
                      className={`px-5 py-2 rounded-xl text-xs font-bold text-white ${
                        app.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : app.status === "ASSIGNED"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">
                      Completion Progress
                    </span>

                    <span className="text-sm font-bold text-blue-500">
                      {getProgress(app.status)}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${getProgress(app.status)}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 transition-all duration-700"
                    ></div>
                  </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold uppercase tracking-wide">
                  <div
                    className={
                      app.status === "PENDING"
                        ? "text-blue-500"
                        : "text-slate-400"
                    }
                  >
                    Pending
                  </div>

                  <div
                    className={
                      app.status === "ASSIGNED"
                        ? "text-blue-500"
                        : "text-slate-400"
                    }
                  >
                    Assigned
                  </div>

                  <div
                    className={
                      app.status === "IN_PROGRESS"
                        ? "text-blue-500"
                        : "text-slate-400"
                    }
                  >
                    Ongoing
                  </div>

                  <div
                    className={
                      app.status === "COMPLETED"
                        ? "text-blue-500"
                        : "text-slate-400"
                    }
                  >
                    Ready
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

export default TrackService;