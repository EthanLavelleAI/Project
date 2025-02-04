class SettingsManager {
    constructor() {
        if (!this.checkAccess()) {
            window.location.href = 'home.html';
            return;
        }
        
        this.initializeNavigation();
        this.loadSavedSettings();
        this.bindEvents();
        this.initializeModals();
        this.setupFormValidation();
        this.refreshEmployeeList();
    }

    checkAccess() {
        const employeeRole = localStorage.getItem('employeeRole');
        return employeeRole === 'Manager';
    }

    initializeNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                this.showSection(item.dataset.section);
                this.saveLastActiveSection(item.dataset.section);
            });
        });

        // Restore last active section
        const lastSection = localStorage.getItem('lastActiveSection') || 'general';
        this.showSection(lastSection);
        document.querySelector(`[data-section="${lastSection}"]`)?.classList.add('active');
    }

    showSection(sectionId) {
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            selectedSection.style.display = 'block';
            
            // Trigger animation
            selectedSection.style.opacity = '0';
            setTimeout(() => {
                selectedSection.style.opacity = '1';
            }, 50);
        }
    }

    bindEvents() {
        // Add Employee Button
        const addEmployeeBtn = document.querySelector('.add-btn');
        if (addEmployeeBtn) {
            addEmployeeBtn.addEventListener('click', () => this.showAddEmployeeModal());
        }

        // Save buttons
        document.querySelectorAll('.action-btn.primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveSettings();
                this.showSaveSuccess();
            });
        });

        // Form inputs
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('change', () => {
                this.saveSettings();
            });
        });
    }

    initializeModals() {
        if (!document.getElementById('settingsModal')) {
            const modalTemplate = `
                <div class="modal" id="settingsModal">
                    <div class="modal-content">
                        <!-- Content will be dynamically inserted -->
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalTemplate);
        }
    }

    showAddEmployeeModal() {
        const modal = document.getElementById('settingsModal');
        modal.querySelector('.modal-content').innerHTML = `
            <h3>Add New Employee</h3>
            <form id="employeeForm">
                <div class="form-group">
                    <label for="empName">Name</label>
                    <input type="text" id="empName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="empRole">Role</label>
                    <select id="empRole" name="role" required>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                        <option value="Kitchen">Kitchen</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="empPin">PIN</label>
                    <input type="password" id="empPin" name="pin" pattern="[0-9]{4}" 
                           required maxlength="4" inputmode="numeric" 
                           placeholder="Enter 4-digit PIN">
                </div>
                <div class="form-group">
                    <label for="empStatus">Status</label>
                    <select id="empStatus" name="status" required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div class="action-buttons">
                    <button type="submit" class="action-btn primary">Add Employee</button>
                    <button type="button" class="action-btn secondary" onclick="document.getElementById('settingsModal').style.display='none'">Cancel</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'block';

        // Handle form submission
        const form = modal.querySelector('#employeeForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const employeeData = Object.fromEntries(formData);
            this.addEmployee(employeeData);
            modal.style.display = 'none';
        });
    }

    addEmployee(employeeData) {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        
        // Validate PIN
        if (!/^\d{4}$/.test(employeeData.pin)) {
            alert('PIN must be exactly 4 digits');
            return;
        }

        // Check for duplicate names
        if (employees.some(emp => emp.name === employeeData.name)) {
            alert('An employee with this name already exists');
            return;
        }

        employees.push(employeeData);
        localStorage.setItem('employees', JSON.stringify(employees));
        this.refreshEmployeeList();
        this.showSaveSuccess();
    }

    refreshEmployeeList() {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const tbody = document.querySelector('.users-table tbody');
        
        if (tbody) {
            tbody.innerHTML = employees.map(emp => `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.role}</td>
                    <td>****</td>
                    <td><span class="status ${emp.status}">${emp.status}</span></td>
                    <td>
                        <button class="action-btn" onclick="settingsManager.editEmployee('${emp.name}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="settingsManager.deleteEmployee('${emp.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    editEmployee(name) {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const employee = employees.find(emp => emp.name === name);
        
        if (employee) {
            const modal = document.getElementById('settingsModal');
            modal.querySelector('.modal-content').innerHTML = `
                <h3>Edit Employee</h3>
                <form id="editEmployeeForm">
                    <div class="form-group">
                        <label for="empName">Name</label>
                        <input type="text" id="empName" name="name" value="${employee.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="empRole">Role</label>
                        <select id="empRole" name="role" required>
                            <option value="Manager" ${employee.role === 'Manager' ? 'selected' : ''}>Manager</option>
                            <option value="Staff" ${employee.role === 'Staff' ? 'selected' : ''}>Staff</option>
                            <option value="Kitchen" ${employee.role === 'Kitchen' ? 'selected' : ''}>Kitchen</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="empPin">PIN</label>
                        <input type="password" id="empPin" name="pin" pattern="[0-9]{4}" 
                               maxlength="4" inputmode="numeric" 
                               placeholder="Enter new PIN (leave blank to keep current)">
                    </div>
                    <div class="form-group">
                        <label for="empStatus">Status</label>
                        <select id="empStatus" name="status" required>
                            <option value="active" ${employee.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${employee.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <div class="action-buttons">
                        <button type="submit" class="action-btn primary">Save Changes</button>
                        <button type="button" class="action-btn secondary" onclick="document.getElementById('settingsModal').style.display='none'">Cancel</button>
                    </div>
                </form>
            `;
            
            modal.style.display = 'block';

            // Handle form submission
            const form = modal.querySelector('#editEmployeeForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // If PIN is empty, keep the old PIN
                if (!data.pin) {
                    data.pin = employee.pin;
                }
                
                this.updateEmployee(name, data);
                modal.style.display = 'none';
            });
        }
    }

    updateEmployee(oldName, newData) {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const index = employees.findIndex(emp => emp.name === oldName);
        
        if (index !== -1) {
            // Validate PIN if changed
            if (newData.pin !== employees[index].pin && !/^\d{4}$/.test(newData.pin)) {
                alert('PIN must be exactly 4 digits');
                return;
            }

            // Check for duplicate names if name is changed
            if (newData.name !== oldName && employees.some(emp => emp.name === newData.name)) {
                alert('An employee with this name already exists');
                return;
            }

            employees[index] = newData;
            localStorage.setItem('employees', JSON.stringify(employees));
            this.refreshEmployeeList();
            this.showSaveSuccess();
        }
    }

    deleteEmployee(name) {
        if (confirm(`Are you sure you want to delete employee: ${name}?`)) {
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const updatedEmployees = employees.filter(emp => emp.name !== name);
            localStorage.setItem('employees', JSON.stringify(updatedEmployees));
            this.refreshEmployeeList();
            this.showSaveSuccess();
        }
    }

    saveSettings() {
        const settings = {};
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.name) {
                settings[input.name] = input.type === 'checkbox' ? input.checked : input.value;
            }
        });
        
        localStorage.setItem('eposSettings', JSON.stringify(settings));
    }

    loadSavedSettings() {
        // Load general settings
        const savedSettings = JSON.parse(localStorage.getItem('eposSettings') || '{}');
        
        // Apply saved settings to form elements
        Object.entries(savedSettings).forEach(([key, value]) => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });

        // Initialize toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.saveSettings();
                this.showSaveSuccess();
            });
        });
    }

    showSaveSuccess() {
        const toast = document.createElement('div');
        toast.className = 'settings-toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Settings saved successfully';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 2000);
        }, 100);
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (form.checkValidity()) {
                    this.saveSettings();
                    this.showSaveSuccess();
                } else {
                    form.reportValidity();
                }
            });
        });
    }
}

// Initialize settings when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});