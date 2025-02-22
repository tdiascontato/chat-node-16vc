import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { conversation_id, sender_id, message } = req.body;
    const io = req.app.get('io');

    const newMessage = await prisma.message.create({
      data: {
        text: message,
        sender: { connect: { uid: sender_id } },
        conversation: { connect: { id: parseInt(conversation_id) } }
      },
      include: { sender: true }
    });

    io.to(conversation_id).emit('newMessage', {
      sender_id: newMessage.sender.uid,
      message: newMessage.text,
      timestamp: newMessage.createdAt
    });

    res.json({
      message_id: newMessage.id,
      message: newMessage.text,
      timestamp: newMessage.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

export default router;