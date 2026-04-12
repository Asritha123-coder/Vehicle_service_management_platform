import React, { useEffect, useState } from "react";
import { getUserVehicles, deleteVehicle } from "../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { Car, Fuel, Calendar, Disc, Plus, Trash2, ArrowRight } from "lucide-react";

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
            setVehicles(prev => prev.filter(v => v._id !== id));
            setSuccess("Vehicle removed successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to delete vehicle.");
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Loading your garage...</div>;

    return (
        <div className="main-content text-white">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2">My Vehicles</h1>
                    <p className="text-slate-400">View and manage your registered garage</p>
                </div>
                <button 
                    onClick={() => navigate("/customer/vehicles/add")}
                    className="btn-primary py-3 px-6 shadow-glow flex items-center gap-2"
                >
                    <Plus size={20} />
                    Register New Vehicle
                </button>
            </header>

            {error && <div className="badge badge-error mb-6 py-4 px-6 rounded-xl w-full flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError("")}>✕</button>
            </div>}
            {success && <div className="badge badge-success mb-6 py-4 px-6 rounded-xl w-full flex items-center justify-between">
                <span>{success}</span>
            </div>}

            {vehicles.length === 0 ? (
                <div className="bg-slate-900 border border-white/5 p-12 text-center rounded-3xl flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 mb-6 font-bold">
                        <Car size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Vehicles Registered</h3>
                    <p className="text-slate-500 mb-8 max-w-sm text-sm">Add your first vehicle to start booking service appointments and tracking history.</p>
                    <button 
                        onClick={() => navigate("/customer/vehicles/add")}
                        className="btn-primary py-3 px-8 text-sm"
                    >
                        Get Started
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((v) => (
                        <div key={v._id} className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-xl">
                            {/* Vehicle Image / Placeholder */}
                            <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                                {v.imageUrl ? (
                                    <img 
                                        src={v.imageUrl} 
                                        alt={v.model} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
                                        <Car size={64} className="opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                                        {v.fuelType}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{v.model}</h3>
                                        <p className="text-xs font-mono font-bold text-primary tracking-widest uppercase">{v.vehicleNumber}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(v._id)}
                                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                        title="Remove Vehicle"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Fuel size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">Fuel</p>
                                            <p className="text-sm font-semibold text-slate-200 leading-none">{v.fuelType}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                            <Calendar size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">Year</p>
                                            <p className="text-sm font-semibold text-slate-200 leading-none">{v.purchaseYear}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate("/customer/appointments", { state: { vehicleId: v._id } })}
                                    className="w-full py-4 rounded-2xl bg-primary text-white flex items-center justify-center gap-3 text-sm font-bold transition-all hover:bg-primary-hover hover:shadow-glow shadow-lg"
                                >
                                    Book Service Appointment <ArrowRight size={18} />
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
