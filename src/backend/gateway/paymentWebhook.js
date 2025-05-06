import { isValidsignature } from '../utils/security'
import { logger } from '../utils/logger';

export async function post (req) {
    const { event, data } =req.body;

    if ( !isValidsignature(req, headers, data)){
        throw new Error("Invalid Signature");
    }
    try {
        switch (event) {
            case 'payment_success':
                logger.info(`Payment Success`);
                break;

            case 'payment_failed':
                logger.info(`Payment Failed`);
                break;

            default:
                logger.info(`Unknown Event: ${event}`);
                break;
        }
        return {
            body: { success: true },
        }
    }catch (error) {
        logger.error(`Payment Webhook Error: ${error.message}`);
        throw new Error('Webhook Processing Failed');
    }
}

function isValidsignature(headers, data) {
    const signature = headers['signature'];
    const expectedSignature = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(JSON.stringify(data))
        .digest('hex');
    return signature === expectedSignature;
}

module.exports = { post };