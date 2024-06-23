const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config({ path: './.env.local' });
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to database
connectDB();
 
const app = express();
app.use(cors());

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
