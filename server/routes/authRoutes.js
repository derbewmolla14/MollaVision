import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createToken, publicUser } from '../utils/auth.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { message: 'Too many authentication attempts' } });

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6 || password !== confirmPassword) {
      return res.status(400).json({ message: 'Name, valid email, matching passwords, and a password of at least 6 characters are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    res.cookie('token', createToken(user._id.toString(), user.role), cookieOptions());
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.cookie('token', createToken(user._id.toString(), user.role), cookieOptions());
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', authLimiter, async (req, res, next) => {
  const genericResponse = {
    message: 'If an account exists for that email, a password reset link has been sent.',
  };

  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(200).json(genericResponse);
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(200).json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    try {
      await sendPasswordResetEmail({ recipient: user.email, resetUrl: `${clientUrl}/reset-password/${rawToken}` });
    } catch (emailError) {
      user.passwordResetTokenHash = null;
      user.passwordResetExpires = null;
      await user.save();
      console.error(`Password reset email failed: ${emailError.message}`);
      return res.status(200).json(genericResponse);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password/:token', authLimiter, async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 6 || password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords must match and contain at least 6 characters.' });
    }

    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpires: { $gt: new Date() } }).select('+passwordResetTokenHash +passwordResetExpires');
    if (!user) return res.status(400).json({ message: 'This password reset link is invalid or expired.' });

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;