import Appointment from "../models/Appointment.js";
import ServiceRecord from "../models/ServiceRecord.js";
import Vehicle from "../models/Vehicle.js";
import Invoice from "../models/Invoice.js";
import calculateServiceCost from "../utils/calculateServiceCost.js";
import { sendEmail } from "../utils/emailService.js";
import { getCustomerDataByVehicle } from "../utils/userUtils.js";

// Add a new service record
export const addServiceRecord = async (req, res) => {
	try {
		const { vehicleId, technicianId, appointmentId, repairDetails, serviceStatus } = req.body;
		if (!vehicleId || !technicianId || !appointmentId) {
			return res.status(400).json({ message: "vehicleId, technicianId and appointmentId are required." });
		}
		const record = new ServiceRecord({
			vehicleId,
			technicianId,
			appointmentId,
			repairDetails,
			serviceStatus,
		});
		await record.save();

		// Update matching appointment status
		await Appointment.findByIdAndUpdate(appointmentId, { status: serviceStatus || "IN_PROGRESS" });

		res.status(201).json({ message: "Service record added and appointment status updated.", record });

        // --- ASYNC EMAIL NOTIFICATION ---
        (async () => {
            try {
                const customer = await getCustomerDataByVehicle(vehicleId);
                if (customer) {
                    await sendEmail(
                        customer.email,
                        `Service Started - ${customer.model}`,
                        `Hi ${customer.name},\n\nWe have started working on your ${customer.model}.\n\nInitial Details: ${repairDetails || "Service initiated."}\nStatus: ${serviceStatus || "IN_PROGRESS"}`
                    );
                }
            } catch (err) {
                console.error("Deferred Service Add Email Error:", err.message);
            }
        })();
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
		await Appointment.findByIdAndUpdate(record.appointmentId, apptUpdate);



		res.status(200).json({ message: "Service status and appointment updated.", record });

        // --- ASYNC EMAIL NOTIFICATIONS ---
        (async () => {
            try {
                const customer = await getCustomerDataByVehicle(record.vehicleId);
                if (!customer) return;

				if (serviceStatus === "COMPLETED") {
					// Send Service Completed Email
					await sendEmail(
						customer.email,
						`Service Completed - ${customer.model}`,
						`Hi ${customer.name},\n\nGreat news! Your ${customer.model} has been serviced and is now ready for pickup.\n\nRepair Details: ${repairDetails || "Completed successfully."}`
					);
                } else if (serviceStatus || repairDetails) {
                    // Send Status Update Email
                    await sendEmail(
                        customer.email,
                        `Service Update - ${customer.model}`,
                        `Hi ${customer.name},\n\nThere is a new update on your ${customer.model} service.\n\nStatus: ${serviceStatus || record.serviceStatus}\nDetails: ${repairDetails || record.repairDetails || "Ongoing"}`
                    );
                }
            } catch (err) {
                console.error("Deferred Service Update Email Error:", err.message);
            }
        })();
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};