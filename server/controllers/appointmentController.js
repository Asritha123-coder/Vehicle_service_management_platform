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

        // Send Email Notification
        (async () => {
            try {
                const customer = await getCustomerDataByVehicle(appointment.vehicleId);
                if (customer) {
                    await sendEmail(
                        customer.email,
                        "Technician Assigned - Vehicle Service",
                        `A technician has been assigned to your ${appointment.serviceType} appointment. Status: ${appointment.status}`
                    );
                }
            } catch (err) {
                console.error("Deferred Assignment Email Error:", err.message);
            }
        })();
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};
import Appointment from "../models/Appointment.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailService.js";
import { getCustomerDataByVehicle } from "../utils/userUtils.js";

// Helper removed as we use userUtils.js

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

        // Send Email Notification
        (async () => {
            try {
                const customer = await getCustomerDataByVehicle(appointment.vehicleId);
                if (customer) {
                    await sendEmail(
                        customer.email,
                        "Appointment Booked - Vehicle Service",
                        `Your appointment for ${serviceType} has been successfully booked for ${new Date(appointmentDate).toLocaleString()}.`
                    );
                }
            } catch (err) {
                console.error("Deferred Booking Email Error:", err.message);
            }
        })();
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

        // Send Email Notification
        (async () => {
            try {
                const customer = await getCustomerDataByVehicle(appointment.vehicleId);
                if (customer) {
                    const subject = status === "COMPLETED" ? "Service Completed - Vehicle Service" : "Service Update - Vehicle Service";
                    const message = status === "COMPLETED" 
                        ? `Great news! Your ${appointment.serviceType} is completed and your vehicle is ready for pickup.`
                        : `Update: Your ${appointment.serviceType} service status has been updated to: ${status}.`;

                    await sendEmail(customer.email, subject, message);
                }
            } catch (err) {
                console.error("Deferred Status Update Email Error:", err.message);
            }
        })();
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};