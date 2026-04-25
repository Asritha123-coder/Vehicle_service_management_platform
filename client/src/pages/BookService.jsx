import React, { useState, useEffect } from "react";
import { getUserVehicles } from "../services/vehicleService";
import { bookAppointment } from "../services/appointmentService";
import { useNavigate } from "react-router-dom";

const BookService = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    appointmentDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getUserVehicles();
        setVehicles(data);
      } catch (err) {
        setError("Failed to fetch vehicles. Please add a vehicle first.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await bookAppointment(formData);
      setSuccess("Appointment booked successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 mb-3">
            Book a Service
          </h1>
          <p className="text-slate-500 text-base font-medium">
            Schedule a maintenance or repair for your vehicle
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 space-y-7"
        >
          {/* Vehicle */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select Vehicle
            </label>

            <select
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData({ ...formData, vehicleId: e.target.value })
              }
              required
              className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choose a vehicle</option>

              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.model} - {v.vehicleNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Service Type
            </label>

            <select
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({ ...formData, serviceType: e.target.value })
              }
              required
              className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select service type</option>
              <option value="General Maintenance">General Maintenance</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Brake Repair">Brake Repair</option>
              <option value="Engine Tuning">Engine Tuning</option>
              <option value="Tire Replacement">Tire Replacement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Preferred Date & Time
            </label>

            <input
              type="datetime-local"
              value={formData.appointmentDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appointmentDate: e.target.value,
                })
              }
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-medium px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-sm font-medium px-4 py-3 rounded-xl text-center">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
            >
              Confirm Booking
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-4 rounded-2xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookService;