// Common JavaScript functions for the Hospital Management System

// Update current time in the header
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleString();
    }
}

// Highlight active navigation link
function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '-';
    return timeString.substring(0, 5); // HH:MM format
}

// Show loading state on buttons
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Loading...';
    button.disabled = true;
    
    return function hideLoading() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 5000 });
    toast.show();
    
    // Remove from DOM after hiding
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Confirmation dialog
async function confirmAction(message, callback) {
    const confirmed = await window.confirmAction({
        title: 'Confirm Action',
        message: message,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed && callback) {
        callback();
    }
    
    return confirmed;
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Highlight active navigation link
    highlightActiveNavLink();
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in-up');
        }, index * 100);
    });
});

// Mobile sidebar toggle (for responsive design)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// Add mobile menu button if needed
if (window.innerWidth <= 768) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'btn btn-primary d-md-none mb-3';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
        mobileMenuBtn.addEventListener('click', toggleSidebar);
        mainContent.insertBefore(mobileMenuBtn, mainContent.firstChild);
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('show');
        }
    }
});
