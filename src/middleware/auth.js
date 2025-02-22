import "dotenv/config";
import { verify } from "jsonwebtoken";

export const authenticate = (req, res, next) => {
	const authHeader = req.headers.authorization;

	const [authType, token] = authHeader.split(" ");

	if (!authHeader || !authType !== "Bearer") {
		return res.status(401).json({ error: "Unauthorized" });
	}

	verify(token, process.env.JWT_SECRET, (err, _) => {
		if (err) return res.status(403).json({ error: "Invalid Token" });
	});

	next();
};
