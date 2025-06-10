function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element with selector "${selector}" not found`);
        return null;
    }
    return element;
}

const API_URL = 'http://localhost:3000';
const API_KEY = '93a7fcb2-daf5-46ee-a00f-f6fd272fc522';

// Initialize payment amount and order ID
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId') || 'TEST-' + Math.random().toString(36).substr(2, 9);
const amount = urlParams.get('amount') || '2500';

// Update display values
document.getElementById('order-id').textContent = `Order ID: ${orderId}`;
document.getElementById('order-amount').textContent = `Amount: ₹${(parseInt(amount)/100).toFixed(2)}`;

// Card type detection patterns
const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/
};

function detectCardType(number) {
    for (const [type, pattern] of Object.entries(cardPatterns)) {
        if (pattern.test(number)) {
            return type;
        }
    }
    return 'unknown';
}

function updateCardPreview(field, value) {
    switch(field) {
        case 'number':
            document.getElementById('card-preview-number').textContent = 
                value.padEnd(16, '*').match(/.{1,4}/g).join(' ');
            const cardType = detectCardType(value);
            document.getElementById('card-type').textContent = cardType.toUpperCase();
            document.getElementById('card-icon').style.backgroundImage = 
                `url('assets/${cardType}.png')`;
            break;
        case 'name':
            document.getElementById('card-preview-name').textContent = 
                value.toUpperCase() || 'CARD HOLDER';
            break;
        case 'expiry':
            document.getElementById('card-preview-expiry').textContent = 
                value || 'MM/YY';
            break;
    }
}

function validateCard() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;
    
    let isValid = true;
    
    // Validate card number using Luhn algorithm
    if (!validateLuhn(cardNumber) || !/^\d{15,16}$/.test(cardNumber)) {
        document.getElementById('card-number-error').textContent = 'Invalid card number';
        document.getElementById('card-number').parentElement.classList.add('error');
        isValid = false;
    } else {
        document.getElementById('card-number-error').textContent = '';
        document.getElementById('card-number').parentElement.classList.remove('error');
        document.getElementById('card-number').parentElement.classList.add('valid');
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        document.getElementById('card-expiry-error').textContent = 'Invalid format (MM/YY)';
        document.getElementById('card-expiry').parentElement.classList.add('error');
        isValid = false;
    } else {
        const [month, year] = expiry.split('/');
        const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expDate < new Date()) {
            document.getElementById('card-expiry-error').textContent = 'Card expired';
            isValid = false;
        } else {
            document.getElementById('card-expiry-error').textContent = '';
            document.getElementById('card-expiry').parentElement.classList.remove('error');
            document.getElementById('card-expiry').parentElement.classList.add('valid');
        }
    }
    if (!/^\d{3,4}$/.test(cvv)) {
        document.getElementById('card-cvv-error').textContent = 'Invalid CVV';
        document.getElementById('card-cvv').parentElement.classList.add('error');
        isValid = false;
    } else {
        document.getElementById('card-cvv-error').textContent = '';
        document.getElementById('card-cvv').parentElement.classList.remove('error');
        document.getElementById('card-cvv').parentElement.classList.add('valid');
    }
    return isValid;
}

function validateLuhn(number) {
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

// Payment method switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const targetMethod = button.getAttribute('data-method');
        const targetContent = document.getElementById(`${targetMethod}-payment`);
        
        // Remove active class and fade out current content
        document.querySelectorAll('.payment-method-content').forEach(content => {
            content.style.opacity = '0';
            setTimeout(() => content.style.display = 'none', 300);
        });
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        
        // Add active class and fade in new content
        button.classList.add('active');
        setTimeout(() => {
            targetContent.style.display = 'block';
            setTimeout(() => targetContent.style.opacity = '1', 50);
        }, 300);
    });
});

// Smooth tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active classes
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.payment-method-content').forEach(content => {
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.display = 'none';
                content.classList.remove('active');
            }, 300);
        });

        // Add active class to clicked tab
        button.classList.add('active');
        
        // Show selected content with animation
        const targetId = button.getAttribute('data-method');
        const targetContent = document.getElementById(`${targetId}-payment`);
        setTimeout(() => {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
            requestAnimationFrame(() => {
                targetContent.style.opacity = '1';
            });
        }, 300);
    });
});

// UPI ID validation
document.getElementById('upi-id').addEventListener('input', (e) => {
    const upiId = e.target.value;
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    
    if (!upiRegex.test(upiId)) {
        document.getElementById('upi-id-error').textContent = 'Invalid UPI ID format';
    } else {
        document.getElementById('upi-id-error').textContent = '';
    }
});

// Handle UPI app selection
document.querySelectorAll('.upi-app-button').forEach(button => {
    button.addEventListener('click', () => {
        const app = button.getAttribute('data-app');
        // Remove selected class from all buttons
        document.querySelectorAll('.upi-app-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        // Add selected class to clicked button
        button.classList.add('selected');
        // Clear error message when an app is selected
        document.getElementById('upi-app-error').textContent = '';
    });
});

// Handle form submissions
document.getElementById('netbanking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bank = document.getElementById('bank-select').value;
    try {
        const paymentId = `pay_${Date.now()}`;
        
        // Add a radio button group to switch between UPI ID and UPI Apps
        document.querySelectorAll('.upi-app-button').forEach(button => {
            button.addEventListener('click', () => {
                // Hide UPI ID input when app is selected
                document.getElementById('upi-id').value = '';
                document.getElementById('upi-id').style.display = 'none';
                document.getElementById('upi-id-error').textContent = '';
            });
        });

        // Modify UPI form submit handler
        document.getElementById('upi-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const selectedApp = document.querySelector('.upi-app-button.selected');
            if (!selectedApp && !document.getElementById('upi-id').value) {
                document.getElementById('upi-app-error').textContent = 'Please select a UPI app or enter UPI ID';
                return;
            }

            // If an app is selected, proceed without requiring UPI ID
            if (selectedApp) {
                const upiApp = selectedApp.getAttribute('data-app');
                // Clear any previous UPI ID since we're using an app
                document.getElementById('upi-id').value = '';
                document.getElementById('upi-id-error').textContent = '';
            }

            // Only validate UPI ID if it's visible
            const upiId = document.getElementById('upi-id').value;
            const upiIdVisible = document.getElementById('upi-id').style.display !== 'none';
            
            if (upiIdVisible) {
                const upiRegex = /^[\w.-]+@[\w.-]+$/;
                if (!upiRegex.test(upiId)) {
                    document.getElementById('upi-id-error').textContent = 'Invalid UPI ID format';
                    return;
                }
            }
            
            // Rest of your existing UPI payment processing code...
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Net banking payment initiated successfully!');
            window.location.href = urlParams.get('successUrl') || '/';
        } else {
            throw new Error('Net banking payment failed');
        }
        } catch (error) {
        console.error('Net banking payment error:', error);
        alert('Payment failed. Please try again.');
        window.location.href = './cancel.html';
    }
});

document.getElementById('wallet-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const wallet = document.querySelector('input[name="wallet"]:checked').value;
    try {
        const paymentId = `pay_${Date.now()}`;
        
        const response = await fetch(`${API_URL}/api/payments/wallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                paymentId,
                orderId,
                amount: Number(amount),
                wallet: wallet
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Wallet payment initiated successfully!');
            window.location.href = urlParams.get('successUrl') || '/';
        } else {
            throw new Error('Wallet payment failed');
        }
    } catch (error) {
        console.error('Wallet payment error:', error);
        alert('Payment failed. Please try again.');
        window.location.href = './cancel.html';
    }
});

document.getElementById('upi-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const upiId = document.getElementById('upi-id').value;
    const upiRegex = /^[\w.-]+@[\w.-]+$/;

    if (!upiRegex.test(upiId)) {
        document.getElementById('upi-id-error').textContent = 'Invalid UPI ID format';
        return;
    }

    const selectedApp = document.querySelector('.upi-app-button.selected');
    if (!selectedApp) {
        document.getElementById('upi-app-error').textContent = 'Please select a UPI app';
        return;
    }

    try {
        const paymentId = `pay_${Date.now()}`;
        const upiApp = selectedApp.getAttribute('data-app');
        
        const response = await fetch(`${API_URL}/api/payments/upi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                paymentId,
                orderId,
                amount: Number(amount),
                upiId: upiId,
                upiApp: upiApp
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('UPI payment initiated successfully!');
            window.location.href = urlParams.get('successUrl') || '/';
        } else {
            throw new Error('UPI payment failed');
        }
    } catch (error) {
        console.error('UPI payment error:', error);
        alert('Payment failed. Please try again.');
        window.location.href = './cancel.html';
    }
});

// Real-time input formatting and validation
document.getElementById('card-number').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    e.target.value = value.replace(/(\d{4})/g, '$1 ').trim();
    updateCardPreview('number', value);
    validateCard();
    animateCardPreview();24
});

document.getElementById('card-name').addEventListener('input', (e) => {
    updateCardPreview('name', e.target.value);
});

document.getElementById('card-expiry').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substr(0, 4);
    if (value.length > 2) {
        value = value.substr(0, 2) + '/' + value.substr(2);
    }
    e.target.value = value;
    updateCardPreview('expiry', value);
    validateCard();
});

document.getElementById('card-cvv').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substr(0, 4);
    e.target.value = value;
    validateCard();
});

document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateCard()) return;

    const paymentId = `pay_${Date.now()}`;
    
    try {
        const createResponse = await fetch(`${API_URL}/api/payments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                paymentId,
                orderId,
                amount: Number(amount),
                cardDetails: {
                    number: document.getElementById('card-number').value.replace(/\s/g, ''),
                    expiry: document.getElementById('card-expiry').value,
                    cvv: document.getElementById('card-cvv').value,
                    name: document.getElementById('card-name').value
                }
            })
        });

        const paymentResult = await createResponse.json();

        if (paymentResult.status === 'created') {
            const captureResponse = await fetch(`${API_URL}/api/payments/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({
                    paymentId,
                    amount: Number(amount)
                })
            });

            const captureResult = await captureResponse.json();

            if (captureResult.status === 'captured') {
                alert('Payment successful!');
                window.location.href = urlParams.get('successUrl') || '/';
            } else {
                throw new Error('Payment capture failed');
            }
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    }
});

document.getElementById('cancel-button').addEventListener('click', () => {
    const cancelUrl = urlParams.get('cancelUrl') || '/';
    window.location.href = cancelUrl;
});

// Payment handling code
document.addEventListener('DOMContentLoaded', () => {
    // Payment method switching
    const tabs = document.querySelectorAll('.tab-button');
    const paymentContents = document.querySelectorAll('.payment-method-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            paymentContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show selected payment content
            const selectedMethod = tab.getAttribute('data-method');
            const selectedContent = document.getElementById(`${selectedMethod}-payment`);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                setTimeout(() => selectedContent.classList.add('active'), 10);
            }
        });
    });

    // Form submission handling
    const forms = document.querySelectorAll('.payment-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payButton = form.querySelector('.pay-button');
            const buttonText = payButton.querySelector('span');
            const spinner = payButton.querySelector('.spinner');

            try {
                // Show loading state
                payButton.disabled = true;
                spinner.style.display = 'block';
                buttonText.textContent = 'Processing...';

                // Get order details
                const orderDetails = {
                    orderId: document.querySelector('#order-id').textContent,
                    amount: document.querySelector('#order-amount').textContent,
                    paymentMethod: form.id,
                    timestamp: new Date().toISOString()
                };

                // Store in localStorage
                localStorage.setItem('paymentDetails', JSON.stringify(orderDetails));

                // Simulate payment processing
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Update progress steps
                const paymentStep = document.querySelector('.progress-step.active');
                const confirmationStep = document.querySelector('.progress-step:last-child');
                
                if (paymentStep && confirmationStep) {
                    paymentStep.classList.remove('active');
                    paymentStep.classList.add('completed');
                    confirmationStep.classList.add('active');
                }

                // Direct redirection
                window.location.assign('./confirmation.html');

            } catch (error) {
                console.error('Payment failed:', error);
                payButton.style.backgroundColor = '#ef4444';
                buttonText.textContent = 'Payment Failed';
                spinner.style.display = 'none';
                payButton.disabled = false;
                alert('Payment failed. Please try again.');
            }
        });
    });

    // Handle cancel buttons
    document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel this payment?')) {
                window.history.back();
            }
        });
    });
});