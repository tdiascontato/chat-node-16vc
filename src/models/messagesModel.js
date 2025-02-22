import { db } from "../database/database";

export const MessagesModel = {
	async getByConversationId(conversationId) {
		return await db.message.findMany({
			where: { conversationId },
		});
	},
};
