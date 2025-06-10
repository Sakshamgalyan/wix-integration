document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if we have payment details
        const paymentDetailsString = localStorage.getItem('paymentDetails');
        if (!paymentDetailsString) {
            console.error('No payment details found');
            window.location.replace('checkout.html');
            return;
        }

        // Parse payment details
        const paymentDetails = JSON.parse(paymentDetailsString);
        console.log('Payment details:', paymentDetails);

        // Update confirmation details
        const orderId = document.getElementById('order-id');
        const amount = document.getElementById('order-amount');

        if (orderId) {
            orderId.textContent = paymentDetails.orderId || 'Order ID not found';
        }
        
        if (amount) {
            amount.textContent = paymentDetails.amount || 'Amount not found';
        }

        // Clear localStorage
        localStorage.removeItem('paymentDetails');

        // Handle return button
        const returnButton = document.querySelector('.return-button');
        if (returnButton) {
            returnButton.onclick = (e) => {
                e.preventDefault();
                const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
                const checkoutUrl = `${window.location.origin}${currentDir}/checkout.html`;
                window.location.replace(checkoutUrl);
            };
        }
    } catch (error) {
        console.error('Error in confirmation page:', error);
        alert('An error occurred. Redirecting back to checkout...');
        window.location.replace('checkout.html');
    }
});