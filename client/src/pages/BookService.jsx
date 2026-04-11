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
			setTimeout(() => navigate("/payments"), 2000);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to book appointment");
		}
	};

	if (loading) return <div className="main-content">Loading...</div>;

	return (
		<div className="main-content">
			<div className="max-w-2xl mx-auto">
				<header className="mb-8">
					<h1 className="text-3xl font-bold">Book a Service</h1>
					<p className="text-muted">Schedule a maintenance or repair for your vehicle.</p>
				</header>

				<form onSubmit={handleSubmit} className="glass-card p-8">
					<div className="input-group">
						<label>Select Vehicle</label>
						<select
							value={formData.vehicleId}
							onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
							required
						>
							<option value="">Choose a vehicle</option>
							{vehicles.map((v) => (
								<option key={v._id} value={v._id}>
									{v.model} - {v.vehicleNumber}
								</option>
							))}
						</select>
					</div>

					<div className="input-group">
						<label>Service Type</label>
						<select
							value={formData.serviceType}
							onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
							required
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

					<div className="input-group">
						<label>Preferred Date</label>
						<input
							type="datetime-local"
							value={formData.appointmentDate}
							onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
							required
							min={new Date().toISOString().slice(0, 16)}
						/>
					</div>

					{error && <div className="mb-4 text-red-400 text-sm font-medium">{error}</div>}
					{success && <div className="mb-4 text-green-400 text-sm font-medium">{success}</div>}

					<div className="flex gap-4">
						<button type="submit" className="btn-primary flex-1">Confirm Booking</button>
						<button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BookService;