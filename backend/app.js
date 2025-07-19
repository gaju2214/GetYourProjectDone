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

// ✅ Place CORS and body parser at the top
const allowedOrigins = [
  'http://localhost:5000',
  'https://qjv19kc1-5000.inc1.devtunnels.ms',
  'https://getyourprojectdone-backend.onrender.com',
  'http://localhost:5173', // If your frontend runs on Vite default port
  'https://yourfrontenddomain.com' // Add your actual frontend domain if different
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed from this origin: ' + origin), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// ✅ Route mounts
// ✅ Mount the routes
app.use('/api', categoryRoutes);
app.use(express.json()); // This is required to parse JSON bodies!
app.use('/api/categories', categoryRoutes);


app.use('/api/subcategories', subcategoryRoutes);


// Test body parser
app.post('/test', (req, res) => {
  console.log('Test body:', req.body);
  res.json(req.body);
});
app.use('/api/projects', projectRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

//const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test
app.post('/test', (req, res) => {
  console.log('Test body:', req.body);
  res.json(req.body);
});

app.get('/', (req, res) => res.send('Server is running 🚀'));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
