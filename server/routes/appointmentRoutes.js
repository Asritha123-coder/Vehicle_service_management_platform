import express from "express";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js"; // Explicitly import Vehicle
import ServiceRecord from "../models/ServiceRecord.js";
import Invoice from "../models/Invoice.js";

import {
  bookAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  assignTechnician,
  getTechnicianAppointments
} from "../controllers/appointmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🔥 GET ALL APPOINTMENTS (Admin / Service Center)
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin", "service_center"),
  async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("vehicleId")
        .populate("technicianId")
        .sort({ appointmentDate: -1 })
        .lean(); // Use lean() for easier mapping

      const result = await Promise.all(
        appointments.map(async (appt) => {
          let customerName = "Unknown";
          // If vehicleId is populated, it should be an object
          const vehicle = appt.vehicleId;
          
          if (vehicle && vehicle.userId) {
            const user = await User.findById(vehicle.userId).lean();
            customerName = user ? user.name : "Unknown Member";
          }

          // Get latest service record
          const serviceRecord = await ServiceRecord.findOne({
            vehicleId: vehicle?._id || vehicle,
            technicianId: appt.technicianId?._id || appt.technicianId
          }).sort({ createdAt: -1 }).lean();

          // Get latest invoice
          const invoice = await Invoice.findOne({
            vehicleId: vehicle?._id || vehicle
          }).sort({ createdAt: -1 }).lean();

          return {
            ...appt,
            customerName,
            vehicleModel: vehicle?.model || "Standard Vehicle",
            vehicleNumber: vehicle?.vehicleNumber || "NO PLATE",
            repairDetails: serviceRecord?.repairDetails || "",
            serviceStatus: serviceRecord?.serviceStatus || appt.status,
            invoiceStatus: invoice?.paymentStatus || "-",
            invoiceAmount: invoice?.totalAmount || null
          };
        })
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);


// 👨‍🔧 TECHNICIAN → VIEW TASKS
router.get(
  "/technician",
  authMiddleware,
  roleMiddleware("technician"),
  getTechnicianAppointments
);


// 👑 ADMIN / STAFF → ASSIGN TECHNICIAN
router.put(
  "/assign/:id",
  authMiddleware,
  roleMiddleware("admin", "service_center"),
  assignTechnician
);


// 👤 CUSTOMER → BOOK APPOINTMENT
router.post(
  "/book",
  authMiddleware,
  roleMiddleware("customer"),
  bookAppointment
);


// 👤 CUSTOMER → VIEW OWN APPOINTMENTS
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("customer"),
  getUserAppointments
);


// 🔄 UPDATE STATUS (Technician / Admin)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("technician", "admin"),
  updateAppointmentStatus
);


export default router;