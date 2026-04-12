import Vehicle from "../models/Vehicle.js";

// Add a new vehicle
export const addVehicle = async (req, res) => {
	try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required." });
        }
		const { vehicleNumber, model, fuelType, purchaseYear } = req.body;
		if (!vehicleNumber || !model || !fuelType || !purchaseYear) {
			return res.status(400).json({ message: "All fields are required." });
		}
		const vehicle = new Vehicle({
			userId: req.user._id,
			vehicleNumber,
			model,
			fuelType,
			purchaseYear,
			imageUrl: req.file ? req.file.path : null,
		});
		await vehicle.save();
		res.status(201).json({ message: "Vehicle added successfully.", vehicle });
	} catch (error) {
		console.error("Add Vehicle Error:", error);
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};


// Get all vehicles for authenticated user
export const getUserVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find({ userId: req.user._id });
		res.status(200).json(vehicles);
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};

// Delete a vehicle by id (must belong to user)
export const deleteVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const vehicle = await Vehicle.findOneAndDelete({ _id: id, userId: req.user._id });
		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found or unauthorized." });
		}
		res.status(200).json({ message: "Vehicle deleted successfully." });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};