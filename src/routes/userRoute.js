// src\routes\userRoute.js
import { Router } from 'express';
import UserModel from '../models/userModel.js';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/', (req, res) => {
  try {
    const users = UserModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const user = UserModel.getById(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/',
  [
    body('uid').notEmpty().withMessage('UID is required'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const result = UserModel.create(req.body);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put(
  '/:id',
  [
    body('uid').notEmpty().withMessage('UID is required'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const result = UserModel.update(req.params.id, req.body);
      result.changes > 0
        ? res.json({ message: 'User updated' })
        : res.status(404).json({ error: 'User not found' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete('/:id', (req, res) => {
  try {
    const result = UserModel.delete(req.params.id);
    result.changes > 0
      ? res.json({ message: 'User deleted' })
      : res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;