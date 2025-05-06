import { createPayment } from 'paysecure_url';
import { logger } from '../utils/logger.js';

export async function post(req) {
    const {orderId, amount, currency} = req.body;

    if(!orderId || !amount || !currency){
        throw new Error("Missing Required Fields");
    }

    try {
        const payment = await createPayment({
            orderId,
            amount,
            currency,
            callBackUrl: "paysecure_callbackUrl"
        });

        logger.info(`Payment Created for ${orderId}: ${payment.id}`);

        return {
            body: {
                paymentId: payment.id,
                status: payment.redirect_url,
            },
        };
    } catch (error) {
        logger.error(`CreatePayment Failed: ${error.message}`);
        throw new Error('Payment Initiation Failed');
    }
}

module.exports = { post };