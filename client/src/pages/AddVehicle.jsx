import React, { useState } from "react";
import { addVehicle } from "../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { Car, Fuel, Calendar, Disc, ArrowLeft, Plus } from "lucide-react";

const AddVehicle = () => {
	const [vehicleNumber, setVehicleNumber] = useState("");
	const [model, setModel] = useState("");
	const [fuelType, setFuelType] = useState("");
	const [purchaseYear, setPurchaseYear] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setError("");
		try {
			await addVehicle({ vehicleNumber, model, fuelType, purchaseYear });
			setMessage("Vehicle added successfully!");
			setTimeout(() => navigate("/customer/vehicles"), 1500);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to add vehicle");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="main-content">
			<div className="max-w-2xl mx-auto">
				<button 
					onClick={() => navigate(-1)} 
					className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-6 group"
				>
					<ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
					Back to Dashboard
				</button>

				<header className="mb-10">
					<h1 className="text-4xl font-extrabold mb-2">Register New Vehicle</h1>
					<p className="text-muted text-lg">Add your vehicle details to start booking services.</p>
				</header>

				<form onSubmit={handleSubmit} className="glass-card p-10 relative overflow-hidden">
					{/* Decorative background element */}
					<div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 left-0 -m-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="input-group">
							<label className="flex items-center gap-2">
								<Disc size={16} className="text-primary" />
								Vehicle Number
							</label>
							<input
								type="text"
								placeholder="e.g. MH 12 AB 1234"
								value={vehicleNumber}
								onChange={(e) => setVehicleNumber(e.target.value)}
								required
								className="font-mono"
							/>
						</div>

						<div className="input-group">
							<label className="flex items-center gap-2">
								<Car size={16} className="text-primary" />
								Vehicle Model
							</label>
							<input
								type="text"
								placeholder="e.g. Tesla Model 3"
								value={model}
								onChange={(e) => setModel(e.target.value)}
								required
							/>
						</div>

						<div className="input-group">
							<label className="flex items-center gap-2">
								<Fuel size={16} className="text-primary" />
								Fuel Type
							</label>
							<select
								value={fuelType}
								onChange={(e) => setFuelType(e.target.value)}
								required
							>
								<option value="">Select Engine Type</option>
								<option value="Petrol">Petrol</option>
								<option value="Diesel">Diesel</option>
								<option value="Electric">Electric</option>
								<option value="Hybrid">Hybrid</option>
								<option value="CNG">CNG</option>
								<option value="LPG">LPG</option>
							</select>
						</div>

						<div className="input-group">
							<label className="flex items-center gap-2">
								<Calendar size={16} className="text-primary" />
								Purchase Year
							</label>
							<input
								type="number"
								value={purchaseYear}
								onChange={(e) => setPurchaseYear(e.target.value)}
								required
								min="1900"
								max={new Date().getFullYear()}
								placeholder="YYYY"
							/>
						</div>
					</div>

					<div className="mt-4">
						{message && (
							<div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6 flex items-center gap-3">
								<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
								{message}
							</div>
						)}
						{error && (
							<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
								{error}
							</div>
						)}
					</div>

					<button 
						type="submit" 
						disabled={loading}
						className="btn-primary w-full py-4 text-lg shadow-glow"
					>
						{loading ? "Registering..." : (
							<>
								<Plus size={20} />
								Register Vehicle
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddVehicle;