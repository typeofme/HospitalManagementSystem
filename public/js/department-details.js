// Department Details JavaScript Functions

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Event delegation for edit and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-department-btn')) {
            const button = e.target.closest('.edit-department-btn');
            const departmentId = button.getAttribute('data-department-id');
            editDepartment(departmentId);
        } else if (e.target.closest('.delete-department-btn')) {
            const button = e.target.closest('.delete-department-btn');
            const departmentId = button.getAttribute('data-department-id');
            deleteDepartment(departmentId);
        }
    });
}

// Edit department
function editDepartment(id) {
    // Redirect to departments page with edit mode
    window.location.href = `/departments?edit=${id}`;
}

// Delete department
async function deleteDepartment(id) {
    const confirmed = await confirmAction({
        title: 'Delete Department',
        message: 'Are you sure you want to delete this department? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/departments/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                window.location.href = '/departments';
            } else {
                const error = await response.json();
                showError('Error deleting department: ' + error.message);
            }
        } catch (error) {
            showError('Error deleting department: ' + error.message);
        }
    }
}
