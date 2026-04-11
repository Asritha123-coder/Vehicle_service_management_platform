import express from "express";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

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
import ServiceRecord from "../models/ServiceRecord.js";
import Invoice from "../models/Invoice.js";

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin", "service_center"),
  async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("vehicleId")
        .populate("technicianId")
        .sort({ appointmentDate: -1 });

      const result = await Promise.all(
        appointments.map(async (appt) => {
          let customerName = "";
          if (appt.vehicleId && appt.vehicleId.userId) {
            const user = await User.findById(appt.vehicleId.userId);
            customerName = user ? user.name : "";
          }

          // Get latest service record for this appointment (by vehicle and technician)
          const serviceRecord = await ServiceRecord.findOne({
            vehicleId: appt.vehicleId?._id,
            technicianId: appt.technicianId?._id || appt.technicianId
          }).sort({ createdAt: -1 });

          // Get latest invoice for this vehicle
          const invoice = await Invoice.findOne({
            vehicleId: appt.vehicleId?._id
          }).sort({ createdAt: -1 });

          return {
            ...appt.toObject(),
            customerName,
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