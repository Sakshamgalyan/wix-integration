require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const { validateRequest } = require('./utils/security');

const app = express();

app.use(bodyParser.json());
app.use(validateRequest);
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.path}`);
    next();
})

app.use('/payments', require('./payments'));
app.use('/webhooks', require('./gateway/paymentWebhook'));

app.use((err, req, res, next) => {
    logger.error(`Payment Error: ${err.message}`);
    res.status(500).json({ error: 'Payment processing failed' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));