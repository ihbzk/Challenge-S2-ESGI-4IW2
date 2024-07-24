const Stripe = require('stripe');
const dotenv = require('dotenv').config({ path: './.env.local' });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;