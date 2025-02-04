class CashPayment {
    constructor() {
        this.orderData = JSON.parse(localStorage.getItem('currentOrder'));
        this.totalAmount = 0;
        this.initializeUI();
        this.bindEvents();
    }

    initializeUI() {
        // Set order number
        document.querySelector('.order-number').textContent = this.orderData.orderNumber;

        // Render order items
        const orderItems = document.querySelector('.order-items');
        orderItems.innerHTML = this.orderData.items.map(item => `
            <div class="order-item">
                <span>${item.name} (${item.selectedSize}) x${item.quantity}</span>
                <span>£${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        // Calculate and display totals
        const subtotal = this.orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.2;
        this.totalAmount = subtotal + tax;

        document.querySelector('.subtotal .amount').textContent = `£${subtotal.toFixed(2)}`;
        document.querySelector('.tax .amount').textContent = `£${tax.toFixed(2)}`;
        document.querySelector('.total .amount').textContent = `£${this.totalAmount.toFixed(2)}`;
    }

    bindEvents() {
        // Cash amount input handler
        const cashInput = document.getElementById('cashAmount');
        cashInput.addEventListener('input', (e) => {
            this.calculateChange(parseFloat(e.target.value) || 0);
        });

        // Quick amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseFloat(btn.dataset.amount);
                cashInput.value = amount;
                this.calculateChange(amount);
            });
        });

        // Back button
        document.querySelector('.back').addEventListener('click', () => {
            window.location.href = 'payment.html';
        });

        // Complete payment button
        document.querySelector('.complete-payment').addEventListener('click', () => {
            this.processPayment();
        });
    }

    calculateChange(cashAmount) {
        const changeAmount = cashAmount - this.totalAmount;
        const changeDisplay = document.querySelector('.change-amount');
        const completePaymentBtn = document.querySelector('.complete-payment');

        if (changeAmount >= 0) {
            changeDisplay.textContent = `£${changeAmount.toFixed(2)}`;
            changeDisplay.style.color = '#007bff';
            completePaymentBtn.disabled = false;
        } else {
            changeDisplay.textContent = 'Insufficient amount';
            changeDisplay.style.color = '#dc3545';
            completePaymentBtn.disabled = true;
        }
    }

    processPayment() {
        const cashAmount = parseFloat(document.getElementById('cashAmount').value);
        const change = cashAmount - this.totalAmount;
        
        // Show processing message without buttons
        const modal = document.getElementById('confirmationModal');
        const modalButtons = modal.querySelector('.modal-buttons');
        modalButtons.style.display = 'none';
        
        this.showConfirmationModal(
            'Processing payment...',
            () => {} // Empty callback as we don't need button functionality
        );
        
        // After 2 seconds, show success message
        setTimeout(() => {
            this.showConfirmationModal(
                `Payment Successful!\nCash received: £${cashAmount.toFixed(2)}\nChange given: £${change.toFixed(2)}`,
                () => {}
            );
            
            // After 2 more seconds, redirect to home
            setTimeout(() => {
                modal.style.display = 'none';
                modalButtons.style.display = 'flex'; // Reset buttons display for future use
                
                localStorage.removeItem('currentOrder');
                localStorage.removeItem('pendingOrder');
                window.location.href = 'home.html';
            }, 2000);
        }, 2000);
    }

    showConfirmationModal(message, onConfirm) {
        const modal = document.getElementById('confirmationModal');
        const messageElement = modal.querySelector('.modal-message');
        
        messageElement.textContent = message;
        modal.style.display = 'flex';
    }
}

// Initialize cash payment system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CashPayment();
}); 