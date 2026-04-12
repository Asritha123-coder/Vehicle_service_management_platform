import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

/**
 * Fetches the customer's email associated with a specific vehicle.
 * @param {string} vehicleId - The ID of the vehicle.
 * @returns {Promise<string|null>} - The user's email or null if not found.
 */
export const getCustomerEmailByVehicle = async (vehicleId) => {
    try {
        const vehicle = await Vehicle.findById(vehicleId).populate("userId");
        if (vehicle && vehicle.userId) {
            return vehicle.userId.email;
        }
        return null;
    } catch (error) {
        console.error("Error in getCustomerEmailByVehicle:", error.message);
        return null;
    }
};

/**
 * Helper to get customer data including name (useful for personalized emails)
 */
export const getCustomerDataByVehicle = async (vehicleId) => {
    try {
        const vehicle = await Vehicle.findById(vehicleId).populate("userId");
        if (vehicle && vehicle.userId) {
            return {
                email: vehicle.userId.email,
                name: vehicle.userId.name,
                model: vehicle.model
            };
        }
        return null;
    } catch (error) {
        console.error("Error in getCustomerDataByVehicle:", error.message);
        return null;
    }
};
