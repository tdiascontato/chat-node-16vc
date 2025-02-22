import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const conversations = await prisma.conversation.findMany({
      where: { user: { uid: userId } },
      include: { messages: true }
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar conversas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        messages: {
          include: { sender: { select: { uid: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    const formattedMessages = conversation.messages.map(msg => ({
      sender_id: msg.sender.uid,
      message: msg.text,
      timestamp: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

router.post('/:id/connect', (req, res) => {
  res.json({
    status: 'WebSocket connected',
    conversation_id: req.params.id
  });
});

export default router;