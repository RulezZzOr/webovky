import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email a heslo jsou povinné.' });
  }

  try {
    const { rows } = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Neplatné přihlašovací údaje.' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Neplatné přihlašovací údaje.' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('Chybí JWT_SECRET v konfiguraci.');
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ message: 'Přihlášení se nezdařilo.' });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email } });
});

export default router;
