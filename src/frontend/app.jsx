import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentButton from './components/PaymentButton';
import CheckoutPage from './components/CheckoutPage';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div style={{ padding: '20px' }}>
                        <h1>Payment Demo</h1>
                        <PaymentButton amount={99.99} orderId="ORDER123" />
                    </div>
                } />
                <Route path="/checkout/:paymentId" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
            </Routes>
        </Router>
    );
};

export default App;