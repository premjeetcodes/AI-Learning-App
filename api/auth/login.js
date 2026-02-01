const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('../../backend/models/User');

async function ensureDb() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Missing required environment variables: MONGO_URI and/or JWT_SECRET' });
  }

  try {
    await ensureDb();
  } catch (err) {
    console.error('DB connection error:', err.message || err);
    return res.status(500).json({ message: 'Database connection failed. Check MONGO_URI.' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await require('bcryptjs').compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
