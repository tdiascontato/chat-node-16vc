import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/:conversation_id", async (req, res) => {
	const data = await prisma.message.findMany({
		where: { conversationId },
	});

	res.json(data);
});

router.post("/:conversation_id/connect", (req, res) => {
	res.json({
		status: "WebSocket connected",
		conversation_id: req.params.conversation_id,
	});
});

export default router;
