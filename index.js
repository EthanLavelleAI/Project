document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    new EPOSSystem();
});

class EPOSSystem {
    constructor() {
        // Initialize lastOrderNumber in localStorage if it doesn't exist
        if (!localStorage.getItem('lastOrderNumber')) {
            localStorage.setItem('lastOrderNumber', '0');
        }
        
        // Check for saved pending order
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
            this.currentOrder = JSON.parse(pendingOrder);
            // Enable cancel button if there are items
            const cancelButton = document.querySelector('.btn.cancel');
            if (this.currentOrder.items.length > 0) {
                cancelButton.disabled = false;
                cancelButton.style.opacity = '1';
                cancelButton.style.cursor = 'pointer';
            }
        } else {
            this.currentOrder = {
                items: [],
                orderNumber: this.generateOrderNumber()
            };
        }
        
        this.products = [
            { 
                id: 'special1', 
                name: 'Meal Deal', 
                category: 'Special Offers',
                isSpecialOffer: true,
                sizes: [
                    { size: 'Burger + Fries + Drink', price: 9.99 }
                ],
                customization: {
                    "Burger Options": {
                        type: "radio",
                        options: ["Beef", "Chicken", "Veggie"],
                        required: true
                    },
                    "Toppings": {
                        type: "checkbox",
                        options: ["Lettuce", "Tomato", "Cheese", "Bacon", "Onions"],
                        maxSelections: 5
                    },
                    "Drink Choice": {
                        type: "select",
                        options: ["Cola", "Sprite", "Fanta", "Water"],
                        required: true
                    },
                    "Special Instructions": {
                        type: "text",
                        placeholder: "Any special requests?"
                    }
                }
            },
            { 
                id: 'special2', 
                name: '2 for 1 Pizza', 
                category: 'Special Offers',
                isSpecialOffer: true,
                sizes: [
                    { size: 'Medium', price: 12.99 },
                    { size: 'Large', price: 14.99 }
                ]
            },
            { 
                id: 'special3', 
                name: 'Family Bundle', 
                category: 'Special Offers',
                isSpecialOffer: true,
                sizes: [
                    { size: '2 Large Pizzas + 2 Sides', price: 24.99 }
                ]
            },
            { 
                id: 1, 
                name: 'Burger', 
                category: 'Food',
                sizes: [
                    { size: 'Regular', price: 8.99 },
                    { size: 'Large', price: 10.99 }
                ]
            },
            { 
                id: 2, 
                name: 'Pizza', 
                category: 'Food',
                sizes: [
                    { size: 'Small', price: 10.99 },
                    { size: 'Medium', price: 12.99 },
                    { size: 'Large', price: 14.99 }
                ]
            },
            { 
                id: 3, 
                name: 'Fish & Chips', 
                category: 'Food',
                sizes: [
                    { size: 'Regular', price: 9.99 },
                    { size: 'Large', price: 11.99 }
                ]
            },
            { 
                id: 4, 
                name: 'Chicken Wings', 
                category: 'Food',
                sizes: [
                    { size: '6 Pieces', price: 6.99 },
                    { size: '12 Pieces', price: 12.99 }
                ]
            },
            { 
                id: 5, 
                name: 'Pasta', 
                category: 'Food',
                sizes: [
                    { size: 'Regular', price: 8.99 },
                    { size: 'Large', price: 10.99 }
                ]
            },
            { 
                id: 6, 
                name: 'Nachos', 
                category: 'Food',
                sizes: [
                    { size: 'Regular', price: 7.99 },
                    { size: 'Large', price: 9.99 }
                ]
            },
            { 
                id: 7, 
                name: 'Hot Dog', 
                category: 'Food',
                sizes: [
                    { size: 'Regular', price: 6.99 },
                    { size: 'XL', price: 8.99 }
                ]
            },
            { 
                id: 8, 
                name: 'Salad', 
                category: 'Food',
                sizes: [
                    { size: 'Side', price: 4.99 },
                    { size: 'Main', price: 8.99 }
                ]
            },
            { 
                id: 9, 
                name: 'Cola', 
                category: 'Drinks',
                sizes: [
                    { size: 'Small', price: 2.99 },
                    { size: 'Medium', price: 3.49 },
                    { size: 'Large', price: 3.99 }
                ]
            },
            { 
                id: 10, 
                name: 'Coffee', 
                category: 'Drinks',
                sizes: [
                    { size: 'Small', price: 3.49 },
                    { size: 'Regular', price: 3.99 },
                    { size: 'Large', price: 4.49 }
                ]
            },
            { 
                id: 11, 
                name: 'Tea', 
                category: 'Drinks',
                sizes: [
                    { size: 'Regular', price: 2.99 },
                    { size: 'Large', price: 3.49 }
                ]
            },
            { 
                id: 12, 
                name: 'Milkshake', 
                category: 'Drinks',
                sizes: [
                    { size: 'Regular', price: 4.49 },
                    { size: 'Large', price: 5.49 }
                ]
            },
            { 
                id: 13, 
                name: 'Fresh Juice', 
                category: 'Drinks',
                sizes: [
                    { size: 'Regular', price: 3.99 },
                    { size: 'Large', price: 4.99 }
                ]
            },
            { 
                id: 14, 
                name: 'Lemonade', 
                category: 'Drinks',
                sizes: [
                    { size: 'Regular', price: 3.49 },
                    { size: 'Large', price: 4.49 }
                ]
            },
            { 
                id: 15, 
                name: 'Iced Tea', 
                category: 'Drinks',
                sizes: [
                    { size: 'Regular', price: 3.49 },
                    { size: 'Large', price: 4.49 }
                ]
            },
            { 
                id: 16, 
                name: 'Hot Chocolate', 
                category: 'Drinks',
                sizes: [
                    { size: 'Regular', price: 3.99 },
                    { size: 'Large', price: 4.99 }
                ]
            },
            { 
                id: 17, 
                name: 'Beer', 
                category: 'Alcohol',
                sizes: [
                    { size: 'Half Pint', price: 3.50 },
                    { size: 'Pint', price: 4.50 }
                ]
            },
            { 
                id: 18, 
                name: 'Wine', 
                category: 'Alcohol',
                sizes: [
                    { size: '125ml', price: 4.99 },
                    { size: '175ml', price: 5.99 },
                    { size: '250ml', price: 6.99 }
                ]
            },
            { 
                id: 19, 
                name: 'Cider', 
                category: 'Alcohol',
                sizes: [
                    { size: 'Half Pint', price: 3.50 },
                    { size: 'Pint', price: 4.50 }
                ]
            },
            { 
                id: 20, 
                name: 'Gin & Tonic', 
                category: 'Alcohol',
                sizes: [
                    { size: 'Single', price: 5.99 },
                    { size: 'Double', price: 7.99 }
                ]
            },
            { 
                id: 21, 
                name: 'Vodka & Mixer', 
                category: 'Alcohol',
                sizes: [
                    { size: 'Single', price: 5.99 },
                    { size: 'Double', price: 7.99 }
                ]
            },
            { 
                id: 22, 
                name: 'Rum & Coke', 
                category: 'Alcohol',
                sizes: [
                    { size: 'Single', price: 5.99 },
                    { size: 'Double', price: 7.99 }
                ]
            },
            { 
                id: 23, 
                name: 'Prosecco', 
                category: 'Alcohol',
                sizes: [
                    { size: '125ml', price: 6.99 },
                    { size: 'Bottle', price: 24.99 }
                ]
            },
            { 
                id: 24, 
                name: 'Cocktail', 
                category: 'Alcohol',
                sizes: [
                    { size: 'Regular', price: 7.99 },
                    { size: 'Large', price: 9.99 }
                ]
            },
            { 
                id: 25, 
                name: 'Ice Cream', 
                category: 'Desserts',
                sizes: [
                    { size: '2 Scoops', price: 4.99 },
                    { size: '3 Scoops', price: 6.49 }
                ]
            },
            { 
                id: 26, 
                name: 'Cake', 
                category: 'Desserts',
                sizes: [
                    { size: 'Slice', price: 5.99 }
                ]
            },
            { 
                id: 27, 
                name: 'Cheesecake', 
                category: 'Desserts',
                sizes: [
                    { size: 'Slice', price: 6.49 }
                ]
            },
            { 
                id: 28, 
                name: 'Brownie', 
                category: 'Desserts',
                sizes: [
                    { size: 'Regular', price: 4.99 },
                    { size: 'With Ice Cream', price: 6.49 }
                ]
            },
            { 
                id: 29, 
                name: 'Apple Pie', 
                category: 'Desserts',
                sizes: [
                    { size: 'Slice', price: 5.49 },
                    { size: 'With Cream', price: 6.49 }
                ]
            },
            { 
                id: 30, 
                name: 'Tiramisu', 
                category: 'Desserts',
                sizes: [
                    { size: 'Regular', price: 6.49 }
                ]
            },
            { 
                id: 31, 
                name: 'Sundae', 
                category: 'Desserts',
                sizes: [
                    { size: 'Regular', price: 5.99 },
                    { size: 'Large', price: 7.99 }
                ]
            },
            { 
                id: 32, 
                name: 'Waffles', 
                category: 'Desserts',
                sizes: [
                    { size: 'Plain', price: 4.99 },
                    { size: 'With Toppings', price: 6.99 }
                ]
            }
        ];
        
        this.selectedTable = null;
        this.checkUserAccess();
        this.initializeUI();
        this.initializeEventListeners();
        this.updateCancelButtonState();
    }

    checkUserAccess() {
        // Get employee role from localStorage
        const employeeRole = localStorage.getItem('employeeRole');
        const settingsBtn = document.querySelector('.settings-btn');
        
        // Hide settings button if user is not a manager
        if (employeeRole !== 'Manager') {
            if (settingsBtn) {
                settingsBtn.style.display = 'none';
            }
        }
    }

    generateOrderNumber() {
        try {
            // Get the last order number from localStorage and increment it
            let lastNumber = parseInt(localStorage.getItem('lastOrderNumber') || '0');
            if (isNaN(lastNumber)) lastNumber = 0;
            
            // Increment the number (no reset at 100)
            let newNumber = lastNumber + 1;
            
            // Store the new number back in localStorage
            localStorage.setItem('lastOrderNumber', newNumber.toString());
            
            // Format the number with leading zeros if less than 100
            return newNumber < 100 ? newNumber.toString().padStart(2, '0') : newNumber.toString();
        } catch (error) {
            console.error('Error generating order number:', error);
            // Fallback to a timestamp-based number if something goes wrong
            return Date.now().toString().slice(-8);
        }
    }

    // Optional: Add a method to reset the order number (for testing or at the start of day)
    static resetOrderNumber() {
        localStorage.setItem('lastOrderNumber', '0');
    }

    initializeUI() {
        this.renderProducts('Food');
        this.updateOrderDisplay();
        document.querySelector('.order-number').textContent = `#${this.currentOrder.orderNumber}`;
        
        // Display employee name and role
        const employeeName = localStorage.getItem('employeeName');
        const employeeRole = localStorage.getItem('employeeRole');
        if (employeeName) {
            document.querySelector('.employee-name').textContent = 
                `Logged in as: ${employeeName} (${employeeRole})`;
        }
    }

    initializeEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProducts(e.target.textContent);
            });
        });

        // Action buttons
        document.querySelector('.cancel').addEventListener('click', () => this.cancelOrder());
        document.querySelector('.pay').addEventListener('click', () => this.showTableSelectionModal());

        // Add logout button handler with order check
        document.querySelector('.logout').addEventListener('click', () => {
            if (this.currentOrder.items.length > 0) {
                const modal = document.getElementById('confirmationModal');
                const modalContent = modal.querySelector('.modal-content');
                
                modalContent.innerHTML = `
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-exclamation-triangle"></i>
                            Active Order
                        </h2>
                    </div>
                    <div class="modal-body">
                        <p>You cannot log out with an active order. Please complete or cancel the current order first.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn modal-confirm">OK</button>
                    </div>
                `;

                modal.style.display = 'flex';

                // Handle OK button
                const confirmBtn = modal.querySelector('.modal-confirm');
                confirmBtn.onclick = () => {
                    modal.style.display = 'none';
                };
                
                return;
            }

            // If no active order, proceed with logout
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });

        // Add settings button handler
        document.querySelector('.settings-btn').addEventListener('click', () => {
            // If there's an active order, require manager PIN
            if (this.currentOrder.items.length > 0) {
                const modal = document.getElementById('confirmationModal');
                const modalContent = modal.querySelector('.modal-content');
                
                modalContent.innerHTML = `
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-shield-alt"></i>
                            Manager Authorization
                        </h2>
                    </div>
                    <div class="modal-body">
                        <p>Manager PIN required to access settings during active order.</p>
                        <div class="pin-input-container">
                            <input type="password" 
                                id="managerPin" 
                                maxlength="4" 
                                pattern="[0-9]*" 
                                inputmode="numeric"
                                placeholder="Enter PIN"
                                autocomplete="off">
                        </div>
                        <div class="error-message" style="color: #e74c3c; display: none;">
                            Incorrect PIN. Please try again.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn modal-cancel">Cancel</button>
                        <button class="btn modal-confirm">Confirm</button>
                    </div>
                `;

                modal.style.display = 'flex';

                // Focus the PIN input
                const pinInput = modal.querySelector('#managerPin');
                pinInput.focus();

                // Handle PIN submission
                const confirmBtn = modal.querySelector('.modal-confirm');
                const errorMessage = modal.querySelector('.error-message');
                
                const checkManagerPin = () => {
                    const enteredPin = pinInput.value;
                    if (enteredPin === '1111') { // Manager PIN
                        modal.style.display = 'none';
                        window.location.href = 'settings.html';
                    } else {
                        errorMessage.style.display = 'block';
                        pinInput.value = '';
                        pinInput.focus();
                    }
                };

                confirmBtn.onclick = checkManagerPin;

                // Handle Enter key
                pinInput.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        checkManagerPin();
                    }
                    // Hide error message when typing
                    errorMessage.style.display = 'none';
                });

                // Handle cancel
                modal.querySelector('.modal-cancel').onclick = () => {
                    modal.style.display = 'none';
                };
                
                return;
            }

            // If no active order, proceed to settings page directly
            window.location.href = 'settings.html';
        });

        // Table selection event listeners
        document.querySelector('.table-grid').addEventListener('click', (e) => this.handleTableSelection(e));
        document.querySelector('#tableSelectionModal .modal-confirm').addEventListener('click', () => this.handleTableConfirmation());
        document.querySelector('#tableSelectionModal .modal-cancel').addEventListener('click', () => {
            document.getElementById('tableSelectionModal').style.display = 'none';
        });
        document.querySelectorAll('#tableSelectionModal .close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('tableSelectionModal').style.display = 'none';
            });
        });
    }

    renderProducts(category) {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '';

        const filteredProducts = this.products.filter(p => p.category === category);

        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = `product-item ${product.isSpecialOffer ? 'special-offer' : ''}`;
            
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <div class="product-prices">
                    ${product.sizes.map(size => 
                        `<div class="price-tag">
                            ${size.size}: £${size.price.toFixed(2)}
                        </div>`
                    ).join('')}
                </div>
            `;
            
            productElement.addEventListener('click', () => {
                // For special offers, add directly to order without customization
                if (product.isSpecialOffer) {
                    this.addToOrder({
                        ...product,
                        selectedSize: product.sizes[0].size,
                        price: product.sizes[0].price
                    });
                    return;
                }

                // For regular items, show customization if available
                if (product.customization) {
                    this.showCustomizationModal(product);
                } else {
                    this.addToOrder({
                        ...product,
                        selectedSize: product.sizes[0].size,
                        price: product.sizes[0].price
                    });
                }
            });

            productsGrid.appendChild(productElement);
        });
    }

    filterProducts(category) {
        this.renderProducts(category);
    }

    addToOrder(product) {
        // If it's a special offer, add directly to order without customization
        if (product.isSpecialOffer) {
            const newItem = {
                ...product,
                tempId: Date.now(),
                selectedSize: product.sizes[0].size,
                price: product.sizes[0].price,
                quantity: 1
            };
            this.currentOrder.items.push(newItem);
            this.updateOrderDisplay();
            this.showToast(`Added ${product.name} (${product.selectedSize})`);
            this.updateCancelButtonState();
            return;
        }

        // For non-special offers, show customization if available
        if (product.customization) {
            this.showCustomizationModal(product);
        } else {
            const newItem = {
                ...product,
                tempId: Date.now(),
                selectedSize: product.sizes[0].size,
                price: product.sizes[0].price,
                quantity: 1
            };
            this.currentOrder.items.push(newItem);
            this.updateOrderDisplay();
            this.showToast(`Added ${product.name} (${product.selectedSize})`);
            this.updateCancelButtonState();
        }
    }

    updateOrderDisplay() {
        const orderItems = document.querySelector('.order-items');
        orderItems.innerHTML = '';
        
        this.currentOrder.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            
            // Get modifications for display
            const modifications = item.ingredients?.map(ingId => {
                for (const group of this.getIngredientsForItem(item)) {
                    const found = group.items.find(i => i.id === ingId);
                    if (found) return found;
                }
            }).filter(Boolean) || [];

            itemElement.innerHTML = `
                <div class="order-item-details">
                    <div class="order-item-main">
                        <div class="item-info">
                            <span class="item-name">${item.name} - ${item.selectedSize} x${item.quantity}</span>
                            ${modifications.length > 0 ? `
                                <div class="item-modifications">
                                    ${modifications.map(mod => `
                                        <span class="modification-item">
                                            + ${mod.name}${mod.price ? ` (+£${mod.price.toFixed(2)})` : ''}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="item-controls">
                            <button class="edit-btn" data-index="${index}" title="Edit">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="remove-item" data-index="${index}" title="Remove">×</button>
                        </div>
                    </div>
                </div>
            `;

            // Add edit button handler
            const editBtn = itemElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const modal = document.getElementById('editItemModal');
                if (!modal) {
                    console.error('Edit modal not found');
                    return;
                }

                const modalTitle = modal.querySelector('.modal-title');
                const sizeButtons = modal.querySelector('#sizeButtons');
                const quantityInput = modal.querySelector('#editQuantity');
                const ingredientsSection = modal.querySelector('.ingredients-section');

                modalTitle.textContent = `Edit ${item.name}`;

                // Set up size buttons
                sizeButtons.innerHTML = item.sizes.map(size => `
                    <button class="size-btn ${size.size === item.selectedSize ? 'selected' : ''}" 
                        data-size="${size.size}"
                        data-price="${size.price}">
                        ${size.size} - £${size.price.toFixed(2)}
                    </button>
                `).join('');

                // Add click handlers to size buttons
                sizeButtons.querySelectorAll('.size-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        sizeButtons.querySelectorAll('.size-btn').forEach(b => 
                            b.classList.remove('selected'));
                        btn.classList.add('selected');
                    });
                });

                // Set up quantity
                quantityInput.value = item.quantity || 1;

                // Set up ingredients if available
                const ingredients = this.getIngredientsForItem(item);
                if (ingredients.length > 0) {
                    ingredientsSection.style.display = 'block';
                    const ingredientsList = modal.querySelector('#ingredientsList');
                    ingredientsList.innerHTML = `
                        <div class="ingredients-container">
                            ${ingredients.map(group => `
                                <div class="ingredient-section">
                                    <div class="section-header">
                                        <h4>${group.name}</h4>
                                    </div>
                                    <div class="ingredients-grid">
                                        ${group.items.map(ing => `
                                            <div class="ingredient-item">
                                                <label>
                                                    <input type="checkbox" 
                                                        value="${ing.id}"
                                                        ${item.ingredients?.includes(ing.id) ? 'checked' : ''}>
                                                    ${ing.name}
                                                    <span class="ingredient-price">
                                                        ${ing.price === 0 ? 'Free' : `+£${ing.price.toFixed(2)}`}
                                                    </span>
                                                </label>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    ingredientsSection.style.display = 'none';
                }

                // Add click handlers for ingredient buttons
                ingredientsList.querySelectorAll('.ingredient-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        btn.classList.toggle('selected');
                    });
                });

                // Handle quantity buttons
                const minusBtn = modal.querySelector('.minus');
                const plusBtn = modal.querySelector('.plus');

                minusBtn.onclick = () => {
                    if (quantityInput.value > 1) quantityInput.value--;
                };

                plusBtn.onclick = () => {
                    if (quantityInput.value < 99) quantityInput.value++;
                };

                // Handle save
                const confirmBtn = modal.querySelector('.modal-confirm');
                confirmBtn.onclick = () => {
                    const selectedSizeBtn = modal.querySelector('.size-btn.selected');
                    item.selectedSize = selectedSizeBtn.dataset.size;
                    item.price = parseFloat(selectedSizeBtn.dataset.price);
                    item.quantity = parseInt(quantityInput.value);
                    
                    // Save selected ingredients
                    const selectedIngredients = Array.from(
                        modal.querySelectorAll('.ingredient-btn.selected')
                    ).map(btn => btn.dataset.id);
                    item.ingredients = selectedIngredients;
                    
                    this.updateOrderDisplay();
                    modal.style.display = 'none';
                };

                // Handle cancel
                const cancelBtn = modal.querySelector('.modal-cancel');
                cancelBtn.onclick = () => {
                    modal.style.display = 'none';
                };

                // Show modal
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
            });

            // Add remove button handler
            const removeBtn = itemElement.querySelector('.remove-item');
            removeBtn.addEventListener('click', () => {
                this.removeFromOrder(index);
            });

            orderItems.appendChild(itemElement);
        });

        // Update totals including modifications
        let subtotal = this.currentOrder.items.reduce((sum, item) => {
            const basePrice = item.price * item.quantity;
            const extraCost = (item.ingredients?.reduce((ingSum, ingId) => {
                for (const group of this.getIngredientsForItem(item)) {
                    const found = group.items.find(i => i.id === ingId);
                    if (found) return ingSum + (found.price || 0);
                }
                return ingSum;
            }, 0) || 0) * item.quantity;
            return sum + basePrice + extraCost;
        }, 0);

        let tax = subtotal * 0.2;
        let total = subtotal + tax;

        document.querySelector('.subtotal .amount').textContent = `£${subtotal.toFixed(2)}`;
        document.querySelector('.tax .amount').textContent = `£${tax.toFixed(2)}`;
        document.querySelector('.total .amount').textContent = `£${total.toFixed(2)}`;
    }

    removeFromOrder(index) {
        const removedItem = this.currentOrder.items[index];
        this.currentOrder.items.splice(index, 1);
        this.updateOrderDisplay();
        this.updateCancelButtonState();
        this.showToast(`Removed ${removedItem.name}`, 'remove');
    }

    cancelOrder() {
        // Only proceed if there are items in the order
        if (this.currentOrder.items.length === 0) {
            return;
        }

        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    Cancel Order
                </h2>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to cancel this order?</p>
                <p>This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn modal-cancel">No, Keep Order</button>
                <button class="btn modal-confirm">Yes, Cancel Order</button>
            </div>
        `;

        modal.style.display = 'flex';

        // Handle confirmation
        const confirmBtn = modal.querySelector('.modal-confirm');
        confirmBtn.onclick = () => {
            // Clear items but keep the same order number
            this.currentOrder.items = [];
            
            // Clear pending order from localStorage
            localStorage.removeItem('pendingOrder');
            
            this.updateOrderDisplay();
            this.updateCancelButtonState();
            
            modal.style.display = 'none';
            
            // Show confirmation toast
            this.showToast('Order cancelled successfully', 'warning');
        };

        // Handle cancel
        const cancelBtn = modal.querySelector('.modal-cancel');
        cancelBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    showConfirmationModal(message, onConfirm) {
        const modal = document.getElementById('confirmationModal');
        const messageElement = modal.querySelector('.modal-message');
        const confirmButton = modal.querySelector('.modal-confirm');
        const cancelButton = modal.querySelector('.modal-cancel');
        
        messageElement.textContent = message;
        modal.style.display = 'flex';

        // Remove any existing event listeners
        const newConfirmButton = confirmButton.cloneNode(true);
        const newCancelButton = cancelButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
        cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);

        // Add new event listeners
        newConfirmButton.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onConfirm) onConfirm();
        });

        newCancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    processPayment() {
        if (this.currentOrder.items.length === 0) {
            const modal = document.getElementById('confirmationModal');
            const modalContent = modal.querySelector('.modal-content');
            
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="fas fa-exclamation-triangle"></i>
                        No Items Selected
                    </h2>
                </div>
                <div class="modal-body">
                    <p>Please add items to the order before proceeding to payment.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn modal-confirm">OK</button>
                </div>
            `;

            modal.style.display = 'flex';

            // Handle OK button
            const confirmBtn = modal.querySelector('.modal-confirm');
            confirmBtn.onclick = () => {
                modal.style.display = 'none';
            };
            return;
        }

        // Check if all items have valid quantities
        const invalidItems = this.currentOrder.items.filter(item => 
            !item.quantity || item.quantity < 1 || item.quantity > 99
        );

        if (invalidItems.length > 0) {
            const modal = document.getElementById('confirmationModal');
            const modalContent = modal.querySelector('.modal-content');
            
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="fas fa-exclamation-triangle"></i>
                        Invalid Quantities
                    </h2>
                </div>
                <div class="modal-body">
                    <p>Please enter valid quantities (1-99) for all items.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn modal-confirm">OK</button>
                </div>
            `;

            modal.style.display = 'flex';

            // Handle OK button
            const confirmBtn = modal.querySelector('.modal-confirm');
            confirmBtn.onclick = () => {
                modal.style.display = 'none';
            };
            return;
        }

        // Show payment confirmation modal
        this.showPaymentConfirmation();
    }

    calculateTotal() {
        const subtotal = this.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.2;
        return subtotal + tax;
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('employeeNumber');
        window.location.href = 'login.html';
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageElement = toast.querySelector('.toast-message');
        const iconElement = toast.querySelector('.toast-icon');
        const titleElement = toast.querySelector('.toast-title');
        
        // Set message and type
        messageElement.textContent = message;
        toast.className = 'toast ' + type;
        
        // Update icon and title based on type
        switch(type) {
            case 'success':
                iconElement.className = 'fas fa-check-circle toast-icon';
                titleElement.textContent = 'Item Added';
                break;
            case 'remove':
                iconElement.className = 'fas fa-times-circle toast-icon';
                titleElement.textContent = 'Item Removed';
                break;
            case 'warning':
                iconElement.className = 'fas fa-exclamation-circle toast-icon';
                titleElement.textContent = 'Order Cancelled';
                break;
        }
        
        // Show toast
        toast.style.display = 'flex';
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Add click handler for close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.onclick = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        };
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            if (toast.classList.contains('show')) {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 300);
            }
        }, 3000);
    }

    // Add new method to handle cancel button state
    updateCancelButtonState() {
        const cancelBtn = document.querySelector('.cancel');
        if (this.currentOrder.items.length > 0) {
            cancelBtn.removeAttribute('disabled');
            cancelBtn.style.opacity = '1';
            cancelBtn.style.cursor = 'pointer';
        } else {
            cancelBtn.setAttribute('disabled', 'true');
            cancelBtn.style.opacity = '0.5';
            cancelBtn.style.cursor = 'not-allowed';
        }
    }

    showCustomizationModal(item, index) {
        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Get customization options based on item category
        const options = this.getCustomizationOptions(item.category);
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">Customize ${item.name}</h2>
                <button class="close-modal">×</button>
            </div>
            <div class="customization-options">
                ${options.map(group => `
                    <div class="option-group">
                        <h4>${group.name}</h4>
                        <div class="option-items">
                            ${group.items.map(option => `
                                <div class="option-item">
                                    <input type="checkbox" 
                                        id="${option.id}" 
                                        ${item.customizations?.includes(option.id) ? 'checked' : ''}>
                                    <label for="${option.id}">${option.name}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="modal-buttons">
                <button class="btn modal-confirm">Save Changes</button>
            </div>
        `;
        
        modal.style.display = 'flex';
        
        // Handle save changes
        const confirmButton = modal.querySelector('.modal-confirm');
        confirmButton.addEventListener('click', () => {
            const selectedOptions = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.id);
            
            this.currentOrder.items[index].customizations = selectedOptions;
            this.updateOrderDisplay();
            modal.style.display = 'none';
        });
        
        // Handle close (X) button
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    getCustomizationOptions(category) {
        // Define customization options based on category
        const options = {
            'Food': [
                {
                    name: 'Toppings',
                    items: [
                        { id: 'cheese', name: 'Extra Cheese' },
                        { id: 'bacon', name: 'Bacon' },
                        { id: 'lettuce', name: 'Lettuce' },
                        { id: 'tomato', name: 'Tomato' },
                        { id: 'onion', name: 'Onions' },
                        { id: 'pickles', name: 'Pickles' }
                    ]
                },
                {
                    name: 'Sauces',
                    items: [
                        { id: 'ketchup', name: 'Ketchup' },
                        { id: 'mayo', name: 'Mayonnaise' },
                        { id: 'mustard', name: 'Mustard' },
                        { id: 'bbq', name: 'BBQ Sauce' }
                    ]
                }
            ],
            'Drinks': [
                {
                    name: 'Additions',
                    items: [
                        { id: 'ice', name: 'Ice' },
                        { id: 'lemon', name: 'Lemon' },
                        { id: 'lime', name: 'Lime' }
                    ]
                }
            ]
        };
        
        return options[category] || [];
    }

    getIngredientsForItem(item) {
        const ingredientsByItem = {
            'Burger': [
                {
                    name: 'Toppings',
                    items: [
                        { id: 'cheese', name: 'Extra Cheese', price: 0.50 },
                        { id: 'bacon', name: 'Bacon', price: 1.00 },
                        { id: 'lettuce', name: 'Lettuce', price: 0.00 },
                        { id: 'tomato', name: 'Tomato', price: 0.00 },
                        { id: 'onion', name: 'Onions', price: 0.00 },
                        { id: 'pickles', name: 'Pickles', price: 0.00 }
                    ]
                },
                {
                    name: 'Sauces',
                    items: [
                        { id: 'ketchup', name: 'Ketchup', price: 0.00 },
                        { id: 'mayo', name: 'Mayonnaise', price: 0.00 },
                        { id: 'mustard', name: 'Mustard', price: 0.00 },
                        { id: 'bbq', name: 'BBQ Sauce', price: 0.00 }
                    ]
                }
            ],
            'Pizza': [
                {
                    name: 'Extra Toppings',
                    items: [
                        { id: 'extra_cheese', name: 'Extra Cheese', price: 1.00 },
                        { id: 'pepperoni', name: 'Pepperoni', price: 1.50 },
                        { id: 'mushrooms', name: 'Mushrooms', price: 1.00 },
                        { id: 'olives', name: 'Olives', price: 1.00 },
                        { id: 'peppers', name: 'Peppers', price: 1.00 },
                        { id: 'onions', name: 'Onions', price: 1.00 }
                    ]
                }
            ],
            'Hot Dog': [
                {
                    name: 'Toppings',
                    items: [
                        { id: 'onions', name: 'Fried Onions', price: 0.00 },
                        { id: 'cheese', name: 'Cheese', price: 0.50 },
                        { id: 'bacon', name: 'Bacon Bits', price: 0.50 }
                    ]
                },
                {
                    name: 'Sauces',
                    items: [
                        { id: 'ketchup', name: 'Ketchup', price: 0.00 },
                        { id: 'mustard', name: 'Mustard', price: 0.00 },
                        { id: 'mayo', name: 'Mayonnaise', price: 0.00 }
                    ]
                }
            ],
            'Coffee': [
                {
                    name: 'Extras',
                    items: [
                        { id: 'extra_shot', name: 'Extra Shot', price: 0.50 },
                        { id: 'whipped_cream', name: 'Whipped Cream', price: 0.50 },
                        { id: 'caramel', name: 'Caramel Syrup', price: 0.30 },
                        { id: 'vanilla', name: 'Vanilla Syrup', price: 0.30 }
                    ]
                },
                {
                    name: 'Milk Options',
                    items: [
                        { id: 'whole_milk', name: 'Whole Milk', price: 0.00 },
                        { id: 'skimmed_milk', name: 'Skimmed Milk', price: 0.00 },
                        { id: 'oat_milk', name: 'Oat Milk', price: 0.50 },
                        { id: 'almond_milk', name: 'Almond Milk', price: 0.50 }
                    ]
                }
            ],
            'Ice Cream': [
                {
                    name: 'Toppings',
                    items: [
                        { id: 'chocolate_sauce', name: 'Chocolate Sauce', price: 0.50 },
                        { id: 'caramel_sauce', name: 'Caramel Sauce', price: 0.50 },
                        { id: 'whipped_cream', name: 'Whipped Cream', price: 0.50 },
                        { id: 'nuts', name: 'Chopped Nuts', price: 0.50 },
                        { id: 'sprinkles', name: 'Sprinkles', price: 0.30 }
                    ]
                }
            ],
            'Sundae': [
                {
                    name: 'Toppings',
                    items: [
                        { id: 'chocolate_sauce', name: 'Extra Chocolate Sauce', price: 0.50 },
                        { id: 'caramel_sauce', name: 'Caramel Sauce', price: 0.50 },
                        { id: 'whipped_cream', name: 'Extra Whipped Cream', price: 0.50 },
                        { id: 'nuts', name: 'Chopped Nuts', price: 0.50 },
                        { id: 'cherry', name: 'Extra Cherry', price: 0.30 }
                    ]
                }
            ]
        };

        return ingredientsByItem[item.name] || [];
    }

    showPaymentConfirmation() {
        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Calculate totals including modifications
        let subtotal = this.currentOrder.items.reduce((sum, item) => {
            const basePrice = item.price * item.quantity;
            const extraCost = (item.ingredients?.reduce((ingSum, ingId) => {
                for (const group of this.getIngredientsForItem(item)) {
                    const found = group.items.find(i => i.id === ingId);
                    if (found) return ingSum + (found.price || 0);
                }
                return ingSum;
            }, 0) || 0) * item.quantity;
            return sum + basePrice + extraCost;
        }, 0);

        let tax = subtotal * 0.2;
        let total = subtotal + tax;

        modalContent.innerHTML = `
            <h2 class="modal-title">Order Summary #${this.currentOrder.orderNumber}</h2>
            <div class="modal-body">
                <div class="order-summary">
                    ${this.currentOrder.items.map(item => {
                        const modifications = item.ingredients?.map(ingId => {
                            for (const group of this.getIngredientsForItem(item)) {
                                const found = group.items.find(i => i.id === ingId);
                                if (found) return found;
                            }
                        }).filter(Boolean) || [];

                        const itemExtraCost = modifications.reduce((sum, mod) => sum + (mod.price || 0), 0) * item.quantity;
                        const itemTotal = (item.price * item.quantity) + itemExtraCost;

                        return `
                            <div class="order-summary-item">
                                <div class="item-main">
                                    <span>${item.name} (${item.selectedSize}) x${item.quantity}</span>
                                    <span>£${itemTotal.toFixed(2)}</span>
                                </div>
                                ${modifications.length > 0 ? `
                                    <div class="item-modifications">
                                        ${modifications.map(mod => `
                                            <div class="modification">
                                                + ${mod.name}${mod.price ? ` (+£${mod.price.toFixed(2)})` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="order-totals">
                    <div class="subtotal">
                        <span>Subtotal:</span>
                        <span>£${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="tax">
                        <span>Tax (20%):</span>
                        <span>£${tax.toFixed(2)}</span>
                    </div>
                    <div class="total">
                        <span>Total:</span>
                        <span>£${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div class="payment-methods">
                <button class="btn payment-btn cash">
                    <i class="fas fa-money-bill-wave"></i>
                    Cash
                </button>
                <button class="btn payment-btn card">
                    <i class="fas fa-credit-card"></i>
                    Card
                </button>
                <button class="btn payment-btn refund">
                    <i class="fas fa-undo"></i>
                    Refund
                </button>
            </div>
            <div class="modal-buttons">
                <button class="btn modal-cancel">Back</button>
            </div>
        `;

        modal.style.display = 'flex';

        // Handle payment method selection
        const cashBtn = modal.querySelector('.payment-btn.cash');
        const cardBtn = modal.querySelector('.payment-btn.card');
        const refundBtn = modal.querySelector('.payment-btn.refund');
        const backBtn = modal.querySelector('.modal-cancel');

        cashBtn.addEventListener('click', () => this.processCashPayment(total));
        cardBtn.addEventListener('click', () => this.processCardPayment(total));
        refundBtn.addEventListener('click', () => this.showRefundModal());
        backBtn.addEventListener('click', () => modal.style.display = 'none');
    }

    showRefundModal() {
        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-undo"></i>
                    Process Refund
                </h2>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Order Number</label>
                    <input type="text" id="refundOrderNumber" placeholder="Enter order number" required>
                </div>
                <div class="form-group">
                    <label>Refund Reason</label>
                    <select id="refundReason" required>
                        <option value="">Select a reason</option>
                        <option value="wrong-order">Wrong Order</option>
                        <option value="quality-issue">Quality Issue</option>
                        <option value="customer-dissatisfied">Customer Dissatisfied</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group" id="otherReasonGroup" style="display: none;">
                    <label>Specify Reason</label>
                    <textarea id="otherReason" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Refund Amount</label>
                    <div class="price-input">
                        <input type="number" id="refundAmount" step="0.01" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Manager Authorization</label>
                    <input type="password" id="managerPin" 
                        pattern="[0-9]{4}" maxlength="4" 
                        placeholder="Enter manager PIN" required>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn modal-cancel">Cancel</button>
                <button class="btn modal-confirm">Process Refund</button>
            </div>
        `;

        // Show/hide other reason field
        const reasonSelect = modal.querySelector('#refundReason');
        const otherReasonGroup = modal.querySelector('#otherReasonGroup');
        reasonSelect.addEventListener('change', (e) => {
            otherReasonGroup.style.display = e.target.value === 'other' ? 'block' : 'none';
        });

        // Handle refund submission
        const confirmBtn = modal.querySelector('.modal-confirm');
        confirmBtn.addEventListener('click', () => {
            const orderNumber = modal.querySelector('#refundOrderNumber').value;
            const reason = modal.querySelector('#refundReason').value;
            const otherReason = modal.querySelector('#otherReason').value;
            const amount = modal.querySelector('#refundAmount').value;
            const managerPin = modal.querySelector('#managerPin').value;

            if (this.processRefund(orderNumber, reason, otherReason, amount, managerPin)) {
                this.showToast('Refund processed successfully', 'success');
                modal.style.display = 'none';
            }
        });

        // Handle cancel
        const cancelBtn = modal.querySelector('.modal-cancel');
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            this.showPaymentConfirmation(); // Go back to payment confirmation
        });
    }

    processRefund(orderNumber, reason, otherReason, amount, managerPin) {
        // Verify manager PIN
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const isManager = employees.some(emp => 
            emp.pin === managerPin && 
            emp.role === 'Manager' && 
            emp.status === 'active'
        );

        if (!isManager) {
            this.showToast('Invalid manager PIN', 'error');
            return false;
        }

        // Store refund record
        const refunds = JSON.parse(localStorage.getItem('refunds') || '[]');
        refunds.push({
            orderNumber,
            reason: reason === 'other' ? otherReason : reason,
            amount: parseFloat(amount),
            timestamp: new Date().toISOString(),
            authorizedBy: employees.find(emp => emp.pin === managerPin).name
        });
        localStorage.setItem('refunds', JSON.stringify(refunds));

        return true;
    }

    processCashPayment(total) {
        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');

        // Calculate common cash amounts above total
        const roundedTotal = Math.ceil(total);
        const suggestedAmounts = [
            roundedTotal,
            Math.ceil(total / 5) * 5,
            Math.ceil(total / 10) * 10,
            Math.ceil(total / 20) * 20,
            Math.ceil(total / 50) * 50
        ].filter((amount, index, self) => 
            amount >= total && self.indexOf(amount) === index
        ).slice(0, 5);

        modalContent.innerHTML = `
            <h2 class="modal-title">Cash Payment</h2>
            <div class="modal-body">
                <div class="cash-payment">
                    <div class="cash-payment-left">
                        <div class="amount-due">
                            <span>Amount Due:</span>
                            <span>£${total.toFixed(2)}</span>
                        </div>
                        <div class="quick-amounts">
                            ${suggestedAmounts.map(amount => `
                                <button class="quick-amount-btn" data-amount="${amount}">
                                    £${amount.toFixed(2)}
                                </button>
                            `).join('')}
                        </div>
                        <div class="change-amount" style="display: none;">
                            <span>Change Due:</span>
                            <span>£0.00</span>
                        </div>
                    </div>
                    <div class="cash-payment-right">
                        <div class="cash-input-group">
                            <span class="currency-symbol">£</span>
                            <input type="number" 
                                   id="cash-amount" 
                                   step="0.01" 
                                   min="${total.toFixed(2)}" 
                                   value="${total.toFixed(2)}"
                                   inputmode="decimal"
                                   pattern="[0-9]*">
                            <button class="clear-input-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="numpad">
                            ${[1,2,3,4,5,6,7,8,9].map(num => `
                                <button class="numpad-btn" data-value="${num}">${num}</button>
                            `).join('')}
                            <button class="numpad-btn" data-value="00">00</button>
                            <button class="numpad-btn" data-value="0">0</button>
                            <button class="numpad-btn" data-value=".">.</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn modal-cancel">Back</button>
                <button class="btn modal-confirm" disabled>Complete Payment</button>
            </div>
        `;

        const cashInput = modal.querySelector('#cash-amount');
        const changeAmount = modal.querySelector('.change-amount');
        const confirmBtn = modal.querySelector('.modal-confirm');
        const backBtn = modal.querySelector('.modal-cancel');
        const clearBtn = modal.querySelector('.clear-input-btn');
        const numpadBtns = modal.querySelectorAll('.numpad-btn');
        const quickAmountBtns = modal.querySelectorAll('.quick-amount-btn');

        const updateChange = (value) => {
            const cashReceived = parseFloat(value) || 0;
            const change = cashReceived - total;
            
            if (change >= 0) {
                changeAmount.style.display = 'flex';
                changeAmount.querySelector('span:last-child').textContent = `£${change.toFixed(2)}`;
                confirmBtn.disabled = false;
            } else {
                changeAmount.style.display = 'none';
                confirmBtn.disabled = true;
            }
        };

        // Handle quick amount buttons
        quickAmountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseFloat(btn.dataset.amount);
                cashInput.value = amount.toFixed(2);
                updateChange(amount);
            });
        });

        // Handle numpad buttons
        numpadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                const currentValue = cashInput.value;
                
                if (value === '.' && currentValue.includes('.')) return;
                
                if (currentValue === '0' && value !== '.') {
                    cashInput.value = value;
                } else {
                    cashInput.value = currentValue + value;
                }
                
                updateChange(cashInput.value);
            });
        });

        // Handle clear button
        clearBtn.addEventListener('click', () => {
            cashInput.value = '0';
            updateChange(0);
        });

        // Handle input changes
        cashInput.addEventListener('input', () => {
            updateChange(cashInput.value);
        });

        // Handle payment completion
        confirmBtn.addEventListener('click', () => {
            this.completePayment('cash');
        });

        backBtn.addEventListener('click', () => {
            this.showPaymentConfirmation();
        });
    }

    processCardPayment(total) {
        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
            <h2 class="modal-title">Card Payment</h2>
            <div class="modal-body">
                <div class="card-payment">
                    <div class="amount-due">
                        <span>Amount to Pay:</span>
                        <span>£${total.toFixed(2)}</span>
                    </div>
                    <div class="card-instructions">
                        <p>Please insert or tap your card on the card reader.</p>
                        <div class="card-animation">
                            <i class="fas fa-credit-card"></i>
                            <i class="fas fa-wifi"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn modal-cancel">Cancel</button>
                <button class="btn modal-confirm">Complete Payment</button>
            </div>
        `;

        const confirmBtn = modal.querySelector('.modal-confirm');
        const cancelBtn = modal.querySelector('.modal-cancel');

        // Handle payment completion
        confirmBtn.addEventListener('click', () => {
            this.completePayment('card');
        });

        cancelBtn.addEventListener('click', () => {
            this.showPaymentConfirmation();
        });
    }

    completePayment(method) {
        const modal = document.getElementById('confirmationModal');
        const modalContent = modal.querySelector('.modal-content');

        // Show success message
        modalContent.innerHTML = `
            <h2 class="modal-title">Payment Complete</h2>
            <div class="modal-body">
                <div class="payment-success">
                    <i class="fas fa-check-circle"></i>
                    <p>Payment successful!</p>
                    <p>Order #${this.currentOrder.orderNumber} has been completed.</p>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn modal-confirm">Done</button>
            </div>
        `;

        const doneBtn = modal.querySelector('.modal-confirm');
        doneBtn.addEventListener('click', () => {
            // Clear the current order
            this.currentOrder = {
                items: [],
                orderNumber: this.generateOrderNumber()
            };
            
            // Clear pending order from localStorage
            localStorage.removeItem('pendingOrder');
            
            // Update the UI
            this.updateOrderDisplay();
            this.updateCancelButtonState();
            
            // Close the modal
            modal.style.display = 'none';
            
            // Show success toast
            this.showToast('Payment completed successfully', 'success');
        });
    }

    showTableSelectionModal() {
        const modal = document.getElementById('tableSelectionModal');
        modal.style.display = 'block';
        
        // Reset previously selected table
        const selectedBtn = modal.querySelector('.table-btn.selected');
        if (selectedBtn) {
            selectedBtn.classList.remove('selected');
        }
        this.selectedTable = null;
    }

    handleTableSelection(event) {
        if (!event.target.classList.contains('table-btn')) return;
        
        // Remove previous selection
        const buttons = document.querySelectorAll('.table-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        event.target.classList.add('selected');
        this.selectedTable = event.target.dataset.table;
    }

    handleTableConfirmation() {
        if (!this.selectedTable) {
            this.showToast('Please select a table first', 'error');
            return;
        }
        
        // Store the selected table
        this.currentOrder.tableNumber = this.selectedTable;
        
        // Close table selection modal and proceed to payment
        document.getElementById('tableSelectionModal').style.display = 'none';
        this.processPayment();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    new EPOSSystem();
});

// Dark mode functionality
function initTheme() {
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);
    
    // Theme toggle event listener
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
