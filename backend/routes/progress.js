const router = require("express").Router();
const Progress = require("../models/Progress");
const auth = require("../middleware/auth");

// LOAD PROGRESS
router.get("/load", auth, async (req, res) => {
  const data = await Progress.findOne({ userId: req.userId });
  res.json(data?.days || []);
});

// SAVE / SYNC PROGRESS
router.post("/save", auth, async (req, res) => {
  const { days } = req.body;

  await Progress.updateOne(
    { userId: req.userId },
    { days, updatedAt: new Date() },
    { upsert: true }
  );

  res.json({ success: true });
});

module.exports = router;
