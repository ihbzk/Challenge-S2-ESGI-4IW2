const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment('your-client-id', 'your-client-secret');
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };
