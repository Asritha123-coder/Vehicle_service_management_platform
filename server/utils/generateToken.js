import jwt from "jsonwebtoken";

const generateToken = (userId) => {
	return jwt.sign(
		{ userId },
		process.env.JWT_SECRET || "secretkey",
		{ expiresIn: "1d" }
	);
};

export default generateToken;