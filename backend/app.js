const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ✅ Define allowed frontend origins
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://qjv19kc1-5000.inc1.devtunnels.ms',
  'https://getyourprojectdone-backend.onrender.com',
  'https://yourfrontenddomain.com' // Replace this with your actual frontend domain if any
];

// ✅ Setup CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware for parsing JSON bodies
app.use(express.json());

// ✅ API Route Mounts
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

// ✅ Health check route
app.get('/', (req, res) => res.send('Server is running 🚀'));

// ✅ Start the server after DB sync
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
