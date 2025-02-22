import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.params.id },
      select: {
        uid: true,
        name: true,
        email: true,
        profilePicture: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    
    res.json({
      user_id: user.uid,
      name: user.name,
      email: user.email,
      profile_picture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

export default router;