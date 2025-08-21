// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const { sequelize } = require('./models');
// const authRoutes = require('./routes/authRoutes');

// const app = express();

// const allowedOrigins = [
//   //localhost and development environments
//   'http://localhost:5000',
//   'http://localhost:5173', // If your frontend runs on Vite default port
//   'http://192.168.31.24:5173',
//   'https://qjv19kc1-5000.inc1.devtunnels.ms',

//   // Production environments Render
//   'https://getyourprojectdone.onrender.com',
//   'https://getyourprojectdone-frontend.onrender.com',

//   // Production environments Railway
//   'https://getyourprojectdone.up.railway.app',
//   'https://getyourprojectdone-backend.up.railway.app',
//   'https://www.getyourprojectdone.in',
//    // Add your actual frontend domain if different
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like curl or Postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error('CORS not allowed from this origin: ' + origin), false);
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json()); // required for req.body
// const categoryRoutes = require('./routes/categoryRoutes');
// app.use('/api/categories', categoryRoutes);

// const subcategoryRoutes = require('./routes/subcategoryRoutes'); // Adjust path as needed

// app.use('/api/subcategories', subcategoryRoutes);

// // Test body parser
// app.post('/test', (req, res) => {
//   console.log('Test body:', req.body);
//   res.json(req.body);
// });
// const projectRoutes = require('./routes/projectRoutes');
// app.use('/api/projects', projectRoutes);
// app.use('/uploads', express.static('uploads'));

// const cartRoutes = require('./routes/cartRoutes');
// app.use('/api/cart', cartRoutes);

// const orderRoutes = require('./routes/orderRoutes');
// app.use('/api/orders', orderRoutes);

// //const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => res.send('Server is running 🚀'));

// const PORT = process.env.PORT || 5000;
// sequelize.sync({ alter: true }).then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });

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
const cookieParser = require("cookie-parser");
const authenticateUser = require("./middleware/auth");
const sequelize = require("./config/db");

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
  "http://localhost:3000"
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
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "This is protected", user: req.user });
});

// existing middlewares and routes...
app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);
// Root Route
app.get("/", (req, res) => res.send("Server is running 🚀"));

// Server Start
const PORT = process.env.PORT || 5000;



// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database:', err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
