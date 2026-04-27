// Service price mapping
const SERVICE_PRICES = {
	"General Maintenance": 1500,
	"Oil Change": 800,
	"Brake Repair": 2500,
	"Engine Tuning": 3500,
	"Tire Replacement": 5000,
	"Other": 1000,
};

/**
 * Calculates service cost based on record or appointment details.
 * @param {Object} record - The service record or appointment object containing serviceType.
 * @returns {Number} The calculated cost.
 */
export default function calculateServiceCost(record) {
	if (!record || !record.serviceType) {
		return 500; // Default fallback
	}

	return SERVICE_PRICES[record.serviceType] || 500;
}