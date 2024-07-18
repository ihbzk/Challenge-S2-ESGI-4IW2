const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config({ path: './.env.local' });
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const paymentRoutes = require('./routes/payment.routes');
const paypalRoutes = require('./routes/paypal.routes');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to database
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:8000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.listen("" + process.env.PORT_BACKEND, () => {
  console.log(`Server is running on port ${"" + process.env.PORT_BACKEND}`);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie
// app.use(cookieParser());

// Routes
app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/paypal', paypalRoutes);
