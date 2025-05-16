import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentButton = ({ amount, orderId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Initiating payment...', { amount, orderId });
      
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          currency: 'USD'
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }

      console.log('Payment initiation response:', data);

      if (data.success) {
        console.log('Redirecting to checkout page...');
        navigate(`/checkout/${data.paymentId}`);
      } else {
        console.error('Payment initiation failed:', data.error);
        setError(data.error || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="payment-button"
        style={{
          padding: '12px 24px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
        }}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#fff3f3',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PaymentButton; 