class EditModal {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            await this.loadModalHTML();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize edit modal:', error);
        }
    }

    async loadModalHTML() {
        const response = await fetch('edit-modal.html');
        const html = await response.text();
        document.getElementById('editModalContainer').innerHTML = html;
    }

    async show(item, onSave) {
        if (!this.initialized) {
            await this.init();
        }

        const modal = document.getElementById('editModal');
        if (!modal) {
            console.error('Edit modal not found');
            return;
        }

        const modalTitle = modal.querySelector('.modal-title');
        const sizeSelect = modal.querySelector('#editSize');
        const quantityInput = modal.querySelector('#editQuantity');

        modalTitle.textContent = `Edit ${item.name}`;

        // Set up size options
        sizeSelect.innerHTML = item.sizes.map(size => `
            <option value="${size.size}" 
                data-price="${size.price}"
                ${size.size === item.selectedSize ? 'selected' : ''}>
                ${size.size} - £${size.price.toFixed(2)}
            </option>
        `).join('');

        // Set up quantity
        quantityInput.value = item.quantity || 1;

        // Handle quantity buttons
        const minusBtn = modal.querySelector('.minus');
        const plusBtn = modal.querySelector('.plus');

        minusBtn.onclick = () => {
            if (quantityInput.value > 1) quantityInput.value--;
        };

        plusBtn.onclick = () => {
            if (quantityInput.value < 99) quantityInput.value++;
        };

        // Handle save and cancel
        const confirmBtn = modal.querySelector('.modal-confirm');
        const cancelBtn = modal.querySelector('.modal-cancel');

        const handleSave = () => {
            const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
            const updates = {
                selectedSize: sizeSelect.value,
                price: parseFloat(selectedOption.dataset.price),
                quantity: parseInt(quantityInput.value)
            };
            onSave(updates);
            modal.style.display = 'none';
        };

        const handleCancel = () => {
            modal.style.display = 'none';
        };

        confirmBtn.onclick = handleSave;
        cancelBtn.onclick = handleCancel;

        modal.style.display = 'flex';
    }
}

export default EditModal; 