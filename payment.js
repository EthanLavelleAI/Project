class PaymentSystem {
    constructor() {
        this.orderData = JSON.parse(localStorage.getItem('currentOrder'));
        this.selectedPaymentMethod = null;
        this.isEmployeeDiscount = false;
        this.initializeUI();
        this.bindEvents();
    }

    initializeUI() {
        // Set order number
        document.querySelector('.order-number').textContent = this.orderData.orderNumber;

        // Render order items with customizations
        const orderItems = document.querySelector('.order-items');
        orderItems.innerHTML = this.orderData.items.map(item => `
            <div class="order-item">
                <div class="order-item-details">
                    <div class="item-main">
                        <span>${item.name} (${item.selectedSize}) x${item.quantity}</span>
                        <span>£${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    ${item.customizations ? `
                        <div class="item-customizations">
                            ${item.customizations.ingredients?.length > 0 ? `
                                <div class="customization-details">
                                    <strong>Selected Items:</strong> 
                                    ${item.customizations.ingredients.join(', ')}
                                </div>
                            ` : ''}
                            ${item.customizations.specialInstructions ? `
                                <div class="customization-notes">
                                    <strong>Special Instructions:</strong> 
                                    ${item.customizations.specialInstructions}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.2;
        const total = this.isEmployeeDiscount ? 0 : (subtotal + tax);

        document.querySelector('.subtotal .amount').textContent = 
            this.isEmployeeDiscount ? '£0.00' : `£${subtotal.toFixed(2)}`;
        document.querySelector('.tax .amount').textContent = 
            this.isEmployeeDiscount ? '£0.00' : `£${tax.toFixed(2)}`;
        document.querySelector('.total .amount').textContent = `£${total.toFixed(2)}`;
    }

    bindEvents() {
        // Payment method selection
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedPaymentMethod = btn.dataset.method;
                
                // Handle employee discount selection
                this.isEmployeeDiscount = btn.classList.contains('employee-btn');
                this.updateTotals();
                
                if (this.selectedPaymentMethod === 'cash' && !this.isEmployeeDiscount) {
                    // Save current order before redirecting
                    localStorage.setItem('pendingOrder', JSON.stringify(this.orderData));
                    window.location.href = 'cash-payment.html';
                    return;
                }
                
                document.querySelector('.complete-payment').disabled = false;
            });
        });

        // Back button - Save order state before going back
        document.querySelector('.cancel').addEventListener('click', () => {
            localStorage.setItem('pendingOrder', JSON.stringify(this.orderData));
            window.location.href = 'home.html';
        });

        // Complete payment button
        document.querySelector('.complete-payment').addEventListener('click', () => {
            if (this.selectedPaymentMethod) {
                this.processPayment();
            }
        });
    }

    processPayment() {
        const modal = document.getElementById('confirmationModal');
        const messageElement = modal.querySelector('.modal-message');
        const modalButtons = modal.querySelector('.modal-buttons');
        
        // Show processing message
        modalButtons.style.display = 'none';
        messageElement.textContent = this.isEmployeeDiscount ? 
            'Processing employee discount...' : 
            `Processing ${this.selectedPaymentMethod} payment...`;
        modal.style.display = 'flex';
        
        // After 2 seconds, show success message
        setTimeout(() => {
            messageElement.textContent = this.isEmployeeDiscount ? 
                'Employee discount applied successfully!' : 
                `Payment approved using ${this.selectedPaymentMethod}!`;
            
            // After 2 more seconds, clear all order data and redirect
            setTimeout(() => {
                localStorage.removeItem('currentOrder');
                localStorage.removeItem('pendingOrder');
                window.location.href = 'home.html';
            }, 2000);
        }, 2000);
    }
}

// Initialize payment system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PaymentSystem();
}); 