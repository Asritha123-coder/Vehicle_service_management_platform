import express from "express";
import { addServiceRecord, getServiceRecords, updateServiceStatus } from "../controllers/serviceRecordController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Add a new service record (technician or admin)
router.post("/add", authMiddleware, roleMiddleware("technician", "admin"), addServiceRecord);

// Get service records (protected)
router.get("/", authMiddleware, getServiceRecords);

// Update service status and repair details (technician only)
router.put("/update/:id", authMiddleware, roleMiddleware("technician"), updateServiceStatus);

export default router;