// src/config/stripe.js
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51PbKHAIwDc1XOowApOKe84DrgML4UJLMhM6fcvQbLBaOttZ6LE5fdkX2sSsvcifPwb4Y3KHjnWEKcqERU7ANowlq00CUl7B3ac');
module.exports = stripe;
