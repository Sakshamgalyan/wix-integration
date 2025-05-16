import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Create test data
const orderId = `order_${Date.now()}`;
const amount = 49.99;
const currency = 'USD';
const idempotencyKey = uuidv4();

// Wix API configuration
const WIX_API_URL = 'http://localhost:3000';

// Start the test
console.log('======= WIX PAYMENT INTEGRATION TEST ========');
console.log('Testing with Wix API URL:', WIX_API_URL);

// Create a new payment
async function runTests() {
  try {
    // 1. Create payment
    console.log('\n1. Creating payment...');
    const createResponse = await axios.post(`${WIX_API_URL}/payments/create`, {
      amount,
      currency,
      orderId,
      customerInfo: {
        email: 'test@example.com'
      },
      metadata: {
        test: true
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': idempotencyKey
      }
    });
    
    const paymentId = createResponse.data.paymentId;
    console.log('Payment created with ID:', paymentId);
    
    // 2. Check payment status
    console.log('\n2. Checking payment status...');
    const statusResponse = await axios.get(`${WIX_API_URL}/payments/${paymentId}/status`);
    console.log('Payment status:', statusResponse.data.status);
    
    // 3. Capture payment
    console.log('\n3. Capturing payment...');
    const captureResponse = await axios.post(`${WIX_API_URL}/payments/${paymentId}/capture`, {
      amount
    });
    console.log('Capture response:', captureResponse.data);
    
    // 4. Process a partial refund
    console.log('\n4. Processing partial refund...');
    const refundResponse = await axios.post(`${WIX_API_URL}/payments/${paymentId}/refund`, {
      amount: amount / 2,
      reason: 'Customer requested partial refund'
    });
    console.log('Refund response:', refundResponse.data);
    
    // 5. Check payment status again
    console.log('\n5. Checking payment status after refund...');
    const statusAfterRefundResponse = await axios.get(`${WIX_API_URL}/payments/${paymentId}/status`);
    console.log('Payment status after refund:', statusAfterRefundResponse.data.status);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

runTests(); 