import React, { useEffect, useState } from "react";
import { getUserVehicles, deleteVehicle } from "../services/vehicleService";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Fuel,
  Calendar,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getUserVehicles();
      setVehicles(data);
    } catch (err) {
      setError("Failed to load your vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?")) return;

    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      setSuccess("Vehicle removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete vehicle.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg font-semibold">
        Loading your garage...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-800 mb-2">
              My Vehicles
            </h1>
            <p className="text-slate-500 font-medium">
              View and manage your registered garage
            </p>
          </div>

          <button
            onClick={() => navigate("/customer/vehicles/add")}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 hover:scale-105 text-white font-bold px-7 py-4 rounded-2xl shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Register New Vehicle
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-5 bg-red-100 text-red-600 px-5 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-100 text-green-600 px-5 py-3 rounded-xl font-medium">
            {success}
          </div>
        )}
      </div>

      {/* No Vehicles */}
      {vehicles.length === 0 ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
            <Car size={42} />
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-2">
            No Vehicles Registered
          </h2>

          <p className="text-slate-500 mb-7">
            Add your first vehicle to book services and manage records.
          </p>

          <button
            onClick={() => navigate("/customer/vehicles/add")}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
          >
            Get Started
          </button>
        </div>
      ) : (
        /* Vehicles Grid */
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 bg-slate-100">
                {v.imageUrl ? (
                  <img
                    src={v.imageUrl}
                    alt={v.model}
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car size={70} className="text-slate-500" />
                  </div>
                )}

                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-bold uppercase shadow">
                  {v.fuelType}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Top */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">
                      {v.model}
                    </h3>
                    <p className="text-blue-500 font-bold tracking-widest text-sm">
                      {v.vehicleNumber}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(v._id)}
                    className="text-slate-600 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel size={15} className="text-blue-600" />
                      <span className="text-xs font-bold text-blue-500 uppercase">
                        Fuel
                      </span>
                    </div>
                    <p className="font-semibold text-slate-700">
                      {v.fuelType}
                    </p>
                  </div>

                  <div className="bg-pink-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={15} className="text-pink-600" />
                      <span className="text-xs font-bold text-pink-500 uppercase">
                        Year
                      </span>
                    </div>
                    <p className="font-semibold text-slate-700">
                      {v.purchaseYear}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate("/customer/appointments", {
                      state: { vehicleId: v._id },
                    })
                  }
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all"
                >
                  Book Service Appointment
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVehicles;