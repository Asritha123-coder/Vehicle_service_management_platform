import express from "express";
import { createInvoice, getInvoices, updatePaymentStatus } from "../controllers/invoiceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /create
// @desc    Create invoice after service completion (protected)
router.post("/create", authMiddleware, createInvoice);

// @route   GET /
// @desc    Get all invoices (protected)
router.get("/", authMiddleware, getInvoices);

// @route   PATCH /:id/status
// @desc    Update payment status (protected)
router.patch("/:id/status", authMiddleware, updatePaymentStatus);

export default router;