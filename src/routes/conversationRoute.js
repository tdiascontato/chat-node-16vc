import { Router } from "express";
import { authenticate } from "../middleware/auth";
import prisma from "../prisma";

const router = Router();

router.get("/:conversation_id", authenticate, async (req, res) => {
	const data = await prisma.message.findMany({
		where: { conversationId },
	});

	res.json(data);
});

router.post("/:conversation_id/connect", authenticate, (req, res) => {
	res.json({
		status: "WebSocket connected",
		conversation_id: req.params.conversation_id,
	});
});

export default router;
