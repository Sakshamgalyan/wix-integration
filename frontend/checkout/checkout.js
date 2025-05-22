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
        // Handle UPI app selection logic here
        console.log(`Selected UPI app: ${app}`);
    });
});

// Handle form submissions
document.getElementById('netbanking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bank = document.getElementById('bank-select').value;
    // Add your net banking payment logic here
});

document.getElementById('wallet-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const wallet = document.querySelector('input[name="wallet"]:checked').value;
    // Add your wallet payment logic here
});

document.getElementById('upi-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const upiId = document.getElementById('upi-id').value;
    // Add your UPI payment logic here
});

// Real-time input formatting and validation
document.getElementById('card-number').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    e.target.value = value.replace(/(\d{4})/g, '$1 ').trim();
    updateCardPreview('number', value);
    validateCard();
    animateCardPreview();
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
    // Initialize variables
    const API_URL = 'http://localhost:3000';
    const API_KEY = '93a7fcb2-daf5-46ee-a00f-f6fd272fc522';
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId') || 'TEST-' + Math.random().toString(36).substr(2, 9);
    const amount = urlParams.get('amount') || '2500';

    // Update display values
    document.getElementById('order-id').textContent = `Order ID: ${orderId}`;
    document.getElementById('order-amount').textContent = `Amount: ₹${(parseInt(amount)/100).toFixed(2)}`;

    // Payment method switching
    const paymentMethods = document.querySelectorAll('.tab-button');
    const paymentContents = document.querySelectorAll('.payment-method-content');

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            method.classList.add('active');

            // Hide all payment contents with fade out
            paymentContents.forEach(content => {
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.display = 'none';
                }, 300);
            });

            // Show selected payment content with fade in
            const selectedContent = document.getElementById(`${method.dataset.method}-payment`);
            setTimeout(() => {
                selectedContent.style.display = 'block';
                setTimeout(() => {
                    selectedContent.style.opacity = '1';
                }, 50);
            }, 300);
        });
    });

    // Card input handling
    const cardNumber = document.getElementById('card-number');
    const cardName = document.getElementById('card-name');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.substr(0, 16);
            e.target.value = value.replace(/(\d{4})/g, '$1 ').trim();
            
            // Update card preview
            document.getElementById('card-preview-number').textContent = 
                value.padEnd(16, '*').match(/.{1,4}/g).join(' ');
            
            // Detect and show card type
            const cardType = detectCardType(value);
            document.getElementById('card-type').textContent = cardType.toUpperCase();
        });
    }

    if (cardName) {
        cardName.addEventListener('input', (e) => {
            const value = e.target.value.toUpperCase();
            document.getElementById('card-preview-name').textContent = value || 'CARD HOLDER';
        });
    }

    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.substr(0, 4);
            if (value.length > 2) {
                value = value.substr(0, 2) + '/' + value.substr(2);
            }
            e.target.value = value;
            document.getElementById('card-preview-expiry').textContent = value || 'MM/YY';
        });
    }

    // Form submissions
    const forms = document.querySelectorAll('.payment-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <div class="spinner"></div>
                    <span>Processing...</span>
                `;

                // Simulate payment processing
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Show success state
                submitButton.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Payment Successful!</span>
                `;
                submitButton.classList.add('success');

                // Redirect after success
                setTimeout(() => {
                    const successUrl = urlParams.get('successUrl') || '/success.html';
                    window.location.href = `${successUrl}?orderId=${orderId}`;
                }, 1000);

            } catch (error) {
                // Show error state
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <i class="fas fa-times"></i>
                    <span>Payment Failed</span>
                `;
                submitButton.classList.add('error');
                console.error('Payment error:', error);
            }
        });
    });

    // Cancel payment
    const cancelButton = document.getElementById('cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel this payment?')) {
                const cancelUrl = urlParams.get('cancelUrl') || '/cancel.html';
                window.location.href = cancelUrl;
            }
        });
    }

    // Handle floating labels
    const formInputs = document.querySelectorAll('.form-group input');
    formInputs.forEach(input => {
        // Set initial state for pre-filled inputs
        if (input.value) {
            input.nextElementSibling.classList.add('float');
        }

        // Handle input events
        input.addEventListener('focus', () => {
            input.nextElementSibling.classList.add('float');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.nextElementSibling.classList.remove('float');
            }
        });
    });

    // Initialize form inputs
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        // Set initial state
        if (input.value) {
            input.parentElement.classList.add('filled');
        }

        // Add empty placeholder to prevent default placeholder
        input.setAttribute('placeholder', ' ');

        // Handle input events
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            if (!input.value) {
                input.parentElement.classList.remove('filled');
            }
        });

        input.addEventListener('input', () => {
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
    });

    // Add to your DOMContentLoaded event listener
    // Handle select elements
    const selects = document.querySelectorAll('.form-group select');
    selects.forEach(select => {
        select.addEventListener('change', () => {
            if (select.value) {
                select.classList.add('filled');
            } else {
                select.classList.remove('filled');
            }
        });
    });

    // Adjust main container height
    function adjustContainerHeight() {
        const mainContainer = document.querySelector('.main-container');
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        mainContainer.style.minHeight = `${windowHeight - headerHeight}px`;
    }

    // Call on load and resize
    adjustContainerHeight();
    window.addEventListener('resize', adjustContainerHeight);

    // Handle tab switching
    const tabs = document.querySelectorAll('.tab-button');
    const paymentForms = document.querySelectorAll('.payment-method-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all payment forms
            paymentForms.forEach(form => {
                form.style.opacity = '0';
                setTimeout(() => {
                    form.style.display = 'none';
                }, 300);
            });

            // Show selected payment form
            const selectedForm = document.getElementById(`${tab.dataset.method}-payment`);
            setTimeout(() => {
                selectedForm.style.display = 'block';
                requestAnimationFrame(() => {
                    selectedForm.style.opacity = '1';
                });
            }, 300);
        });
    });

    // Handle sticky left panel
    function updateStickyPanel() {
        const leftPanel = document.querySelector('.left-panel');
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const scrollTop = window.pageYOffset;

        if (window.innerWidth > 768) {
            leftPanel.style.top = `${Math.max(headerHeight + 20, scrollTop + 20)}px`;
        } else {
            leftPanel.style.top = '0';
        }
    }

    window.addEventListener('scroll', updateStickyPanel);
    window.addEventListener('resize', updateStickyPanel);
    updateStickyPanel();
});