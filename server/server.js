import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import serviceRecordRoutes from "./routes/serviceRecordRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



const app = express();

// middleware

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/service-record", serviceRecordRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  family: 4, // 🔥 THIS LINE FIXES MANY ERRORS
})
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

import { sendEmail } from "./utils/emailService.js";

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/api/test-email", async (req, res) => {
    try {
        await sendEmail(
            process.env.EMAIL, // Send to self
            "Test Email - Vehicle Service",
            "Nodemailer is working correctly! 🚀"
        );
        res.status(200).send("Email sent successfully. Check your inbox and server logs.");
    } catch (error) {
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});