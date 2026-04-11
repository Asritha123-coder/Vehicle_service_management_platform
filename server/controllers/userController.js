import User from "../models/User.js";

// Get all technicians
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: "technician" }).select("_id name email");
    res.status(200).json(technicians);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
