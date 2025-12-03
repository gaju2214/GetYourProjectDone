const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Add global error handlers to prevent auto-exit
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit immediately, log the error and continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately, log the error and continue
});

const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const projectRoutes = require("./routes/projectRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const cookieParser = require("cookie-parser");
const authenticateUser = require("./middleware/auth");
const sequelize = require("./config/db");
const shiprocketRoutes = require("./routes/shiprocketRoutes");
const userRoutes = require('./routes/authRoutes'); // or wherever your routes are

const userinfo = require('./routes/userinfo');
const discountRoutes = require('./routes/discountRoutes');
const sitemapRoutes = require('./routes/sitemap');

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://192.168.31.24:5173",
  "https://www.getyourprojectdone.in",
  "https://getyourprojectdone.in",
  "https://getyourprojectdone.up.railway.app",
  "https://getyourprojectdone-backend.up.railway.app",
  "https://master.getyourprojectdone.in",
  "https://reauth.getyourprojectdone.in",
  "https://gypdcontroller-production.up.railway.app"
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error("CORS not allowed from this origin: " + origin),
          false
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(passport.initialize());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes); // ✅ Razorpay payment route
app.use("/uploads", express.static("uploads"));
app.use("/api/shiprocket", shiprocketRoutes);
// app.use("/api/orders", orderRoutes);
 app.use("/api/orders", orderRoutes);
app.use('/api', userRoutes); // This makes your routes accessible at /api/users/search
app.use('/', sitemapRoutes);


app.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "This is protected", user: req.user });
});

// Existing middlewares and routes
app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);

app.use('/api/userinfos', userinfo);

// Root Route
app.get("/", (req, res) => res.send("Server is running 🚀"));

// Global error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  console.error('❌ API Error:', err);
  console.error('Stack:', err.stack);
  
  // Send error response instead of crashing
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Sync database with better error handling
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synced successfully"))
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
    console.error("Database sync failed but server will continue running...");
  });

// Server Start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ Port ${PORT} requires elevated privileges`);
      break;
    case 'EADDRINUSE':
      console.error(`❌ Port ${PORT} is already in use`);
      break;
    default:
      console.error('❌ Server error:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
