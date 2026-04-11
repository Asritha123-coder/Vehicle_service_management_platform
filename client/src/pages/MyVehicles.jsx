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
                <div className="glass-card p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 mb-6">
                        <Car size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Vehicles Registered</h3>
                    <p className="text-slate-500 mb-8 max-w-sm">Add your first vehicle to start booking service appointments and tracking history.</p>
                    <button 
                        onClick={() => navigate("/customer/vehicles/add")}
                        className="btn-primary py-3 px-8"
                    >
                        Get Started
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                        <div key={v._id} className="glass-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                            {/* Accent Decoration */}
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Car size={80} className="-rotate-12 translate-x-4 -translate-y-4" />
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-primary/20 rounded-xl text-primary">
                                        <Car size={24} />
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(v._id)}
                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Vehicle"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">{v.model}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                                {v.vehicleNumber}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Fuel size={14} className="text-primary" />
                                            <span className="text-xs font-medium">{v.fuelType}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={14} className="text-primary" />
                                            <span className="text-xs font-medium">{v.purchaseYear}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate("/customer/appointments", { state: { vehicleId: v._id } })}
                                    className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition-all group-hover:shadow-glow"
                                >
                                    Book Service <ArrowRight size={14} />
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
