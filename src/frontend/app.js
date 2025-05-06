import { registerPaymentMethod } from 'wix-payment-provider';
import { PaymentConfigPanel } from './paymentConfigPanel';

registerPaymentMethod({
    id: 'paysecure_gateway',
    name: 'PaySecure Gateway',
    configPanel: PaymentConfigPanel,
})