import React, { useState } from "react";
import { addVehicle } from "../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { Car, Fuel, Calendar, Disc, ArrowLeft, Plus, Image as ImageIcon, Upload, X } from "lucide-react";

const AddVehicle = () => {
	const [vehicleNumber, setVehicleNumber] = useState("");
	const [model, setModel] = useState("");
	const [fuelType, setFuelType] = useState("");
	const [purchaseYear, setPurchaseYear] = useState("");
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setError("File size should be less than 5MB");
				return;
			}
			setImage(file);
			setPreview(URL.createObjectURL(file));
			setError("");
		}
	};

	const removeImage = () => {
		setImage(null);
		setPreview(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setError("");

		try {
			const formData = new FormData();
			formData.append("vehicleNumber", vehicleNumber);
			formData.append("model", model);
			formData.append("fuelType", fuelType);
			formData.append("purchaseYear", purchaseYear);
			if (image) {
				formData.append("image", image);
			}

			await addVehicle(formData);
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
					<div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 left-0 -m-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>

					{/* Image Upload Section */}
					<div className="mb-8">
						<label className="flex items-center gap-2 mb-4">
							<ImageIcon size={16} className="text-primary" />
							Vehicle Image
						</label>
						
						<div className="flex flex-col items-center justify-center">
							{preview ? (
								<div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 group">
									<img src={preview} alt="Vehicle Preview" className="w-full h-full object-cover" />
									<button
										type="button"
										onClick={removeImage}
										className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
									>
										<X size={20} />
									</button>
								</div>
							) : (
								<label className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
									<div className="p-4 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
										<Upload size={32} className="text-muted group-hover:text-primary" />
									</div>
									<div className="text-center">
										<p className="font-semibold text-lg">Click to upload vehicle photo</p>
										<p className="text-sm text-muted">PNG, JPG or JPEG (Max 5MB)</p>
									</div>
									<input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
								</label>
							)}
						</div>
					</div>

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
						className="btn-primary w-full py-4 text-lg shadow-glow mt-2"
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