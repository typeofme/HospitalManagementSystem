// Departments Management JavaScript

// Add Department Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const addDepartmentForm = document.getElementById('addDepartmentForm');
    const editDepartmentForm = document.getElementById('editDepartmentForm');
    
    if (addDepartmentForm) {
        addDepartmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const formObject = Object.fromEntries(formData);
            
            // Map form fields to database columns
            const data = {
                name: formObject.name,
                description: formObject.description,
                head_doctor_name: formObject.head_of_department,
                location: formObject.location,
                phone: formObject.phone,
                is_active: formObject.status === 'active'
            };
            
            try {
                const response = await fetch('/api/departments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addDepartmentModal'));
                    modal.hide();
                    showSuccess('Operation completed successfully!'); location.reload();
                } else {
                    const error = await response.json();
                    showError('Error: ' + (error.message || error.error));
                }
            } catch (error) {
                showError('Error: ' + error.message);
            }
        });
    }
    
    if (editDepartmentForm) {
        editDepartmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const formObject = Object.fromEntries(formData);
            const id = formObject.id;
            
            // Map form fields to database columns
            const data = {
                name: formObject.name,
                description: formObject.description,
                head_doctor_name: formObject.head_of_department,
                location: formObject.location,
                phone: formObject.phone,
                is_active: formObject.status === 'active'
            };
            
            console.log('Updating department with ID:', id, 'Data:', data); // Debug log
            
            try {
                const response = await fetch(`/api/departments/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editDepartmentModal'));
                    modal.hide();
                    showSuccess('Operation completed successfully!'); location.reload();
                } else {
                    const errorData = await response.json();
                    console.error('Update error:', errorData); // Debug log
                    showError('Error: ' + (errorData.message || errorData.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Network error:', error); // Debug log
                showError('Error: ' + error.message);
            }
        });
    }
    
    // Event delegation for edit and delete buttons
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.edit-dept-btn')) {
            const button = e.target.closest('.edit-dept-btn');
            const id = button.getAttribute('data-dept-id');
            await editDepartment(id);
        } else if (e.target.closest('.delete-dept-btn')) {
            const button = e.target.closest('.delete-dept-btn');
            const id = button.getAttribute('data-dept-id');
            await deleteDepartment(id);
        }
    });
});

// Edit Department Function
async function editDepartment(id) {
    try {
        console.log('Editing department with ID:', id); // Debug log
        
        const response = await fetch(`/api/departments/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const department = await response.json();
        console.log('Department data received:', department); // Debug log
        
        if (!department) {
            throw new Error('Department data is empty');
        }
        
        // Populate form fields with null/undefined checks
        document.getElementById('edit_id').value = department.id || '';
        document.getElementById('edit_name').value = department.name || '';
        document.getElementById('edit_description').value = department.description || '';
        document.getElementById('edit_head_of_department').value = department.head_doctor_name || '';
        document.getElementById('edit_location').value = department.location || '';
        document.getElementById('edit_phone').value = department.phone || '';
        document.getElementById('edit_status').value = department.is_active ? 'active' : 'inactive';
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editDepartmentModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error in editDepartment:', error); // Debug log
        showError('Error loading department: ' + error.message);
    }
}

// Delete Department Function
async function deleteDepartment(id) {
    const confirmed = await confirmAction({
        title: 'Delete Department',
        message: 'Are you sure you want to delete this department?',
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
                showSuccess('Department deleted successfully!');
                showSuccess('Operation completed successfully!'); location.reload();
            } else {
                const error = await response.json();
                showError('Error: ' + error.message);
            }
        } catch (error) {
            showError('Error: ' + error.message);
        }
    }
}
