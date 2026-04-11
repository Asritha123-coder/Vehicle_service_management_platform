import express from "express";
import { addVehicle, getUserVehicles, deleteVehicle } from "../controllers/vehicleController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /add
// @desc    Add a new vehicle (protected)
router.post("/add", authMiddleware, addVehicle);

// @route   GET /my
// @desc    Get all vehicles for authenticated user (protected)
router.get("/my", authMiddleware, getUserVehicles);

// @route   DELETE /:id
// @desc    Delete a vehicle by id (protected)
router.delete("/:id", authMiddleware, deleteVehicle);

export default router;