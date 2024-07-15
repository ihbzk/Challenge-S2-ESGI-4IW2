const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config({ path: './.env.local' });

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const paymentRoutes = require('./routes/payment.routes'); // Importer les routes de paiement
const widgetRoutes = require('./routes/widget.routes');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to database
connectDB();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:8000', // Remplacez par l'URL de votre frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.listen("" + process.env.PORT_BACKEND, () => {
  console.log(`Server is running on port ${"" + process.env.PORT_BACKEND}`);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/api/payments', paymentRoutes); // Ajouter les routes de paiement
app.use('/', widgetRoutes);
