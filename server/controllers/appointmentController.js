// Get all appointments assigned to the logged-in technician
export const getTechnicianAppointments = async (req, res) => {
	try {
		const technicianId = req.user._id;
		const appointments = await Appointment.find({ technicianId, status: { $ne: "COMPLETED" } });
		res.status(200).json(appointments);
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};
// Assign a technician to an appointment (admin/staff only)
export const assignTechnician = async (req, res) => {
	try {
		const { id } = req.params;
		const { technicianId } = req.body;
		if (!id || !technicianId) {
			return res.status(400).json({ message: "appointmentId (from URL) and technicianId are required." });
		}
		const appointment = await Appointment.findByIdAndUpdate(
			id,
			{ technicianId, status: "ASSIGNED" },
			{ new: true }
		);
		if (!appointment) {
			return res.status(404).json({ message: "Appointment not found." });
		}
		res.status(200).json({ message: "Technician assigned and status updated.", appointment });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};
import Appointment from "../models/Appointment.js";
import Vehicle from "../models/Vehicle.js";

// Book a new appointment
export const bookAppointment = async (req, res) => { 
	try {
		const { vehicleId, serviceType, appointmentDate } = req.body;
		if (!vehicleId || !serviceType || !appointmentDate) {
			return res.status(400).json({ message: "All fields are required." });
		}
		const appointment = new Appointment({
			vehicleId,
			serviceType,
			appointmentDate,
		});
		await appointment.save();
		res.status(201).json({ message: "Appointment booked successfully.", appointment });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};

// Get all appointments for the logged-in user's vehicles
export const getUserAppointments = async (req, res) => {
	try {
        const userId = req.user._id;
        // Find all vehicles belonging to the user
        const vehicles = await Vehicle.find({ userId });
        const vehicleIds = vehicles.map(v => v._id);

		const appointments = await Appointment.find({ vehicleId: { $in: vehicleIds } })
            .populate("vehicleId")
            .sort({ appointmentDate: -1 });
            
		res.status(200).json(appointments);
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};


// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const appointment = await Appointment.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		);
		if (!appointment) {
			return res.status(404).json({ message: "Appointment not found." });
		}
		res.status(200).json({ message: "Status updated.", appointment });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};