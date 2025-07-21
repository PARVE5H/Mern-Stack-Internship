const express = require("express");
const Activity = require("../models/Activity");
const router = express.Router();

// POST activity (upsert for same user, website, and day)
router.post("/log", async (req, res) => {
  try {
    const { userId, website, timeSpent } = req.body;
    if (!userId || !website || !timeSpent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get start of today
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Upsert: find activity for user, website, and today
    const activity = await Activity.findOneAndUpdate(
      {
        userId,
        website,
        date: { $gte: startOfDay },
      },
      {
        $inc: { timeSpent: timeSpent },
        $set: { lastVisited: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, activity });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET today's activity (aggregation returns website, timeSpent, lastVisited)
router.get("/daily/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!req.isAuthenticated() || req.user.id !== userId) {
      return res
        .status(401)
        .json({ error: "User not authenticated or unauthorized" });
    }

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const activities = await Activity.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $group: {
          _id: "$website",
          timeSpent: { $sum: "$timeSpent" },
          lastVisited: { $max: "$lastVisited" },
        },
      },
      {
        $sort: { timeSpent: -1 },
      },
      {
        $project: {
          _id: 0,
          website: "$_id",
          timeSpent: 1,
          lastVisited: 1,
        },
      },
    ]);

    res.json(activities);
  } catch (error) {
    console.error("Error fetching daily activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
