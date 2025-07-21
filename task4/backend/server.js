require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activity");
const connectDB = require("./config/db");

connectDB();

// Configure passport
require("./config/passport")(passport);

// Express setup
const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "chrome-extension://",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Productivity Tracker API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);

// Cron Job
require("./cron/dailyReport");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
