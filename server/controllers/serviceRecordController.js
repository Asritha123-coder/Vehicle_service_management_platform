import Appointment from "../models/Appointment.js";
import ServiceRecord from "../models/ServiceRecord.js";
import Vehicle from "../models/Vehicle.js";
import Invoice from "../models/Invoice.js";
import calculateServiceCost from "../utils/calculateServiceCost.js";

// Add a new service record
export const addServiceRecord = async (req, res) => {
	try {
		const { vehicleId, technicianId, repairDetails, serviceStatus } = req.body;
		if (!vehicleId || !technicianId) {
			return res.status(400).json({ message: "vehicleId and technicianId are required." });
		}
		const record = new ServiceRecord({
			vehicleId,
			technicianId,
			repairDetails,
			serviceStatus,
		});
		await record.save();

		// Update matching appointment status
		await Appointment.findOneAndUpdate(
			{ vehicleId, technicianId, status: { $ne: "COMPLETED" } },
			{ status: serviceStatus || "IN_PROGRESS" }
		);

		res.status(201).json({ message: "Service record added and appointment status updated.", record });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};

// Get all service records for the current user (if customer)
export const getServiceRecords = async (req, res) => {
	try {
		const { vehicleId, technicianId } = req.query;
		let filter = {};
		
        if (req.user.role === "Customer") {
            const vehicles = await Vehicle.find({ userId: req.user._id });
            const vehicleIds = vehicles.map(v => v._id);
            filter.vehicleId = { $in: vehicleIds };
        } else {
            if (vehicleId) filter.vehicleId = vehicleId;
            if (technicianId) filter.technicianId = technicianId;
        }

		const records = await ServiceRecord.find(filter)
			.populate("vehicleId")
			.populate("technicianId")
            .sort({ createdAt: -1 });
            
		res.status(200).json(records);
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};



// Update service status and repair details, and mark appointment status
export const updateServiceStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { serviceStatus, repairDetails, replacedParts } = req.body;
		// Update service record
		const record = await ServiceRecord.findByIdAndUpdate(
			id,
			{ serviceStatus, repairDetails, replacedParts },
			{ new: true }
		);
		if (!record) {
			return res.status(404).json({ message: "Service record not found." });
		}
		// Also update appointment status and repair details
		const apptUpdate = {
			status: serviceStatus || undefined,
			repairDetails: repairDetails || undefined,
			replacedParts: replacedParts || undefined
		};
		// Remove undefined fields
		Object.keys(apptUpdate).forEach(key => apptUpdate[key] === undefined && delete apptUpdate[key]);
		await Appointment.findOneAndUpdate(
			{ vehicleId: record.vehicleId, technicianId: record.technicianId },
			apptUpdate
		);

		// If service is completed, create an invoice if not already exists
		if (serviceStatus === "COMPLETED") {
			// Simulate cost calculation (replace with real logic if needed)
			let totalAmount = 500; // Default simulated cost
			try {
				if (typeof calculateServiceCost === "function") {
					totalAmount = await calculateServiceCost(record);
				}
			} catch (e) {}

			// Check if invoice already exists for this service/vehicle (avoid duplicates)
			const existingInvoice = await Invoice.findOne({ vehicleId: record.vehicleId }).sort({ createdAt: -1 });
			if (!existingInvoice || existingInvoice.paymentStatus === "Paid") {
				const invoice = new Invoice({
					vehicleId: record.vehicleId,
					totalAmount,
					paymentStatus: "PENDING"
				});
				await invoice.save();
			}
		}

		res.status(200).json({ message: "Service status, appointment, and invoice updated.", record });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};