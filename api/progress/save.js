const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ProgressModel = require('../../backend/models/Progress');

async function ensureDb() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
}

function getToken(req) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth) return null;
  return auth.replace('Bearer ', '') || auth;
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
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { days } = req.body;
    await ProgressModel.findOneAndUpdate({ userId: decoded.id }, { days }, { upsert: true });
    res.json({ success: true });
  } catch (err) {
    console.error('Save progress error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
