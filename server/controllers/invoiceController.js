import Invoice from "../models/Invoice.js";
import Vehicle from "../models/Vehicle.js";
import { sendEmail } from "../utils/emailService.js";
import { getCustomerDataByVehicle } from "../utils/userUtils.js";

// Create a new invoice
export const createInvoice = async (req, res) => {
	try {
		const { vehicleId, totalAmount, paymentStatus } = req.body;
		if (!vehicleId || totalAmount == null) {
			return res.status(400).json({ message: "vehicleId and totalAmount are required." });
		}
		const invoice = new Invoice({
			vehicleId,
			totalAmount,
			paymentStatus,
		});
		await invoice.save();
		res.status(201).json({ message: "Invoice created.", invoice });
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};

// Get all invoices for the logged-in user
export const getInvoices = async (req, res) => {
	try {
		const { vehicleId } = req.query;
		let filter = {};
		
		if (req.user.role === "Customer") {
			const vehicles = await Vehicle.find({ userId: req.user._id });
			const vehicleIds = vehicles.map(v => v._id);
			filter.vehicleId = { $in: vehicleIds };
		} else if (vehicleId) {
			filter.vehicleId = vehicleId;
		}

		const invoices = await Invoice.find(filter).populate("vehicleId").sort({ createdAt: -1 });
		res.status(200).json(invoices);
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};


// Update payment status
export const updatePaymentStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { paymentStatus } = req.body;
		const invoice = await Invoice.findByIdAndUpdate(
			id,
			{ paymentStatus },
			{ new: true }
		);
		if (!invoice) {
			return res.status(404).json({ message: "Invoice not found." });
		}
		res.status(200).json({ message: "Payment status updated.", invoice });

        // --- ASYNC EMAIL NOTIFICATION ---
        if (paymentStatus === "PAID") {
            (async () => {
                try {
                    const customer = await getCustomerDataByVehicle(invoice.vehicleId);
                    if (!customer) return;

                    await sendEmail(
                        customer.email,
                        `Payment Received - ${customer.model}`,
                        `Hi ${customer.name},\n\nThank you for choosing our service! We have successfully received your payment for the ${customer.model} service.\n\nAmount: $${invoice.totalAmount}\nStatus: Paid\n\nYou can view your payment history and download the full receipt from your dashboard.`
                    );
                } catch (err) {
                    console.error("Deferred Payment Email Error:", err.message);
                }
            })();
        }
	} catch (error) {
		res.status(500).json({ message: "Server error.", error: error.message });
	}
};