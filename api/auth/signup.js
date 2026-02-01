const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UserModel = require('../../backend/models/User');
const ProgressModel = require('../../backend/models/Progress');

async function ensureDb() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  if (!process.env.MONGO_URI) {
    return res.status(500).json({ message: 'Missing required environment variable: MONGO_URI' });
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
    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, password: hash });
    await ProgressModel.create({ userId: user._id, days: [] });
    res.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
