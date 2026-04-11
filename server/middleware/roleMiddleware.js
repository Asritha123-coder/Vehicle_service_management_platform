const roleMiddleware = (...allowedRoles) => {
	return (req, res, next) => {
		try {
			if (!req.user || !allowedRoles.includes(req.user.role)) {
				return res.status(403).json({ message: "Forbidden: insufficient permissions" });
			}
			next();
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	};
};

export default roleMiddleware;