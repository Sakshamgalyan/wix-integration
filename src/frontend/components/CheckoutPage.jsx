import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}`);
        const data = await response.json();
        setPaymentDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  const handleConfirmPayment = async () => {
    try {
      const response = await fetch(`/api/payments/capture/${paymentId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to success page
        navigate('/payment-success');
      } else {
        // Redirect to failure page
        navigate('/payment-failed');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      navigate('/payment-failed');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Confirm Your Payment</h2>
      {paymentDetails && (
        <div className="payment-details">
          <p>Amount: ${paymentDetails.amount}</p>
          <p>Order ID: {paymentDetails.orderId}</p>
          <button
            onClick={handleConfirmPayment}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px',
            }}
          >
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage; 