const crypto = require('crypto');
// const { json } = require('stream/consumers');

function validateRequest (req, res , next) {
    const apiKey = req.header('api-key');

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized'})
    }
    next();
}

function isValidsignature ( header, body, secret) {
    const signature = header['x-signature'];
    const excepted = crypto.createHmac('sha256', secret).update(json.stringify(body)).digest('hex');
    return signature === excepted;
}

module.exports = {
    validateRequest,
    isValidsignature
};