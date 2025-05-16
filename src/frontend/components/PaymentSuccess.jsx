import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#28a745' }}>Payment Successful!</h2>
      <p>Your payment has been processed successfully.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Return to Home
      </button>
    </div>
  );
};

export default PaymentSuccess; 