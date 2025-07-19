const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5000',
  'https://qjv19kc1-5000.inc1.devtunnels.ms',
  'https://getyourprojectdone.onrender.com',
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
app.use(express.json()); // required for req.body
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const subcategoryRoutes = require('./routes/subcategoryRoutes'); // Adjust path as needed

app.use('/api/subcategories', subcategoryRoutes);


// Test body parser
app.post('/test', (req, res) => {
  console.log('Test body:', req.body);
  res.json(req.body);
});
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);
app.use('/uploads', express.static('uploads'));

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

//const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Server is running 🚀'));

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
