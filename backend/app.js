const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
  "http://192.168.31.24:5173",
  "https://www.getyourprojectdone.in",
  "https://getyourprojectdone.in",
  "https://qjv19kc1-5000.inc1.devtunnels.ms",
  "https://getyourprojectdone.onrender.com",
  "https://getyourprojectdone-frontend.onrender.com",
  "https://getyourprojectdone.up.railway.app",
  "https://getyourprojectdone-backend.up.railway.app",
  "https://master.getyourprojectdone.in",
  "https://reauth.getyourprojectdone.in",
   "http://localhost:3000",
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

// Sync database
sequelize.sync({ force: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Error syncing database:", err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
