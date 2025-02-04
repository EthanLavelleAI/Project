// Initialize default employees if none exist
function initializeDefaultEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    
    // Only initialize if no employees exist
    if (employees.length === 0) {
        const defaultEmployees = [
            {
                name: 'Manager',
                role: 'Manager',
                pin: '1111',
                status: 'active'
            },
            {
                name: 'Staff',
                role: 'Staff',
                pin: '2155',
                status: 'active'
            }
        ];
        
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
        console.log('Default employees initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Initialize default employees
    initializeDefaultEmployees();

    // Check if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
        return;
    }

    const pinInput = document.getElementById('pinInput');
    const dots = document.querySelectorAll('.dot');
    const buttons = document.querySelectorAll('.pin-button');
    const errorDisplay = document.querySelector('.pin-error');
    let currentPin = '';

    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < currentPin.length);
        });
    };

    const clearPin = () => {
        currentPin = '';
        pinInput.value = '';
        updateDots();
        errorDisplay.textContent = '';
    };

    const checkPin = () => {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const employee = employees.find(emp => emp.pin === currentPin && emp.status === 'active');

        if (employee) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('employeeName', employee.name);
            localStorage.setItem('employeeRole', employee.role);
            window.location.href = 'index.html';
        } else {
            errorDisplay.textContent = 'Incorrect PIN';
            setTimeout(() => {
                clearPin();
            }, 200);
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('clear')) {
                clearPin();
            } else if (button.classList.contains('enter')) {
                if (currentPin.length === 4) {
                    checkPin();
                }
            } else if (currentPin.length < 4) {
                currentPin += button.textContent;
                pinInput.value = currentPin;
                updateDots();
            }
        });
    });

    // Allow keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' && currentPin.length < 4) {
            currentPin += e.key;
            pinInput.value = currentPin;
            updateDots();
        } else if (e.key === 'Enter' && currentPin.length === 4) {
            checkPin();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            clearPin();
        }
    });
}); 