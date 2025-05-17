import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
	try {
		const authHeader = req.headers["authorization"];
		if (!authHeader) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "Token is missing" });
		}

		const { agentId, canSupport } = jwt.verify(
			token,
			process.env.TOKEN_SECRET
		);
		req.user = { agentId, canSupport };
		next();
	} catch (err) {
		console.error(err);

		if (err.name === "TokenExpiredError") {
			return res.status(403).json({ message: "Token expired" });
		}

		return res.status(403).json({ message: "Invalid token" });
	}
}

/* TO WORK ON
export function verifyAdmin(req, res, next) {
	try {
		if (req.user.agentRole !== "admin") {
			return res.status(403).json({ message: "Access denied: Admins only" });
		}
		next();
	} catch (err) {
		console.error(err);
	}
}
*/
