// Minimal illustrative example (not production-ready)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
// assume a simple "db" wrapper (pseudo)
const db = require('./db'); // your own DB module

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = '7d';

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!email || !password || !name) return res.json({ success:false, message:'Missing fields' });
  const existing = await db.getUserByEmail(email);
  if (existing) return res.json({ success:false, message:'Email already in use' });

  const hash = await bcrypt.hash(password, 12);
  const user = await db.createUser({ name, email, password_hash: hash, phone, is_verified: false });
  // option: send verification email with token
  return res.json({ success:true, message:'User created' });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getUserByEmail(email);
  if (!user) return res.json({ success:false, message:'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.json({ success:false, message:'Invalid credentials' });

  // Issue JWT in HttpOnly cookie
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  return res.json({ success:true });
});

// Protected route example
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success:false });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) { return res.status(401).json({ success:false }); }
};

app.get('/api/user/me', authMiddleware, async (req, res) => {
  const user = await db.getUserById(req.userId);
  if (!user) return res.status(404).json({ success:false });
  res.json({ success:true, user: { id:user.id, name:user.name, email:user.email } });
});