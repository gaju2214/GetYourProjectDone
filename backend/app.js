const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // required for req.body
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

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

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Server is running 🚀'));

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
