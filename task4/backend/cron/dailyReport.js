const cron = require("node-cron");
const Activity = require("../models/Activity");

// Clean up old data daily at midnight (India timezone: GMT+5:30)
cron.schedule("30 18 * * *", async () => {
  // This runs at 6:30 PM GMT which is 12:00 AM IST (midnight)
  console.log("Running daily cleanup at midnight IST...");
  
  try {
    // Calculate the start of today (midnight) in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istNow = new Date(now.getTime() + istOffset);
    const startOfTodayIST = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
    const startOfTodayGMT = new Date(startOfTodayIST.getTime() - istOffset);
    
    // Delete all activities before today
    const result = await Activity.deleteMany({
      date: { $lt: startOfTodayGMT }
    });
    
    console.log(`Daily cleanup completed. Deleted ${result.deletedCount} old activity records.`);
    
    // Optional: Log remaining activities count
    const remainingCount = await Activity.countDocuments();
    console.log(`Remaining activities count: ${remainingCount}`);
    
  } catch (error) {
    console.error("Error during daily cleanup:", error);
  }
});

// Alternative schedule for midnight UTC (if you want to use UTC instead)
// Uncomment the following if you prefer UTC timezone
/*
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cleanup at midnight UTC...");
  
  try {
    // Calculate the start of today (midnight UTC)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    // Delete all activities before today
    const result = await Activity.deleteMany({
      date: { $lt: startOfToday }
    });
    
    console.log(`Daily cleanup completed. Deleted ${result.deletedCount} old activity records.`);
    
  } catch (error) {
    console.error("Error during daily cleanup:", error);
  }
});
*/

// Optional: Generate daily reports (keeping the original functionality)
cron.schedule("0 21 * * *", async () => {
  // 9PM daily for reports
  console.log("Generating Daily Report...");
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayActivities = await Activity.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (todayActivities.length > 0) {
      console.log(`Today's activity summary:`);
      console.log(`Total records: ${todayActivities.length}`);
      
      // Aggregate by website
      const websiteStats = {};
      todayActivities.forEach(activity => {
        if (websiteStats[activity.website]) {
          websiteStats[activity.website] += activity.timeSpent;
        } else {
          websiteStats[activity.website] = activity.timeSpent;
        }
      });
      
      console.log("Website time stats:", websiteStats);
      // Here you could send emails, save reports, etc.
    } else {
      console.log("No activities recorded today.");
    }
    
  } catch (error) {
    console.error("Error generating daily report:", error);
  }
});
