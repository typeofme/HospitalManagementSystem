// Doctors Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const addDoctorForm = document.getElementById('addDoctorForm');
    const editDoctorForm = document.getElementById('editDoctorForm');
    
    if (addDoctorForm) {
        addDoctorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/doctors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showSuccess('Doctor added successfully!');
                    showSuccess('Operation completed successfully!'); location.reload();
                } else {
                    const error = await response.json();
                    showError('Error: ' + error.message);
                }
            } catch (error) {
                showError('Error: ' + error.message);
            }
        });
    }
    
    if (editDoctorForm) {
        editDoctorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const id = data.id;
            delete data.id;
            
            try {
                const response = await fetch(`/api/doctors/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showSuccess('Doctor updated successfully!');
                    showSuccess('Operation completed successfully!'); location.reload();
                } else {
                    const error = await response.json();
                    showError('Error: ' + error.message);
                }
            } catch (error) {
                showError('Error: ' + error.message);
            }
        });
    }
    
    // Event delegation for edit and delete buttons
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.edit-doctor-btn')) {
            const button = e.target.closest('.edit-doctor-btn');
            const id = button.getAttribute('data-doctor-id');
            await editDoctor(id);
        } else if (e.target.closest('.delete-doctor-btn')) {
            const button = e.target.closest('.delete-doctor-btn');
            const id = button.getAttribute('data-doctor-id');
            await deleteDoctor(id);
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const doctorRows = document.querySelectorAll('.doctor-row');
            
            doctorRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// Edit Doctor Function
async function editDoctor(id) {
    try {
        const response = await fetch(`/api/doctors/${id}`);
        const doctor = await response.json();
        
        document.getElementById('edit_id').value = doctor.id;
        document.getElementById('edit_employee_id').value = doctor.employee_id || '';
        document.getElementById('edit_first_name').value = doctor.first_name;
        document.getElementById('edit_last_name').value = doctor.last_name;
        document.getElementById('edit_email').value = doctor.email || '';
        document.getElementById('edit_phone').value = doctor.phone || '';
        document.getElementById('edit_specialization').value = doctor.specialization || '';
        document.getElementById('edit_department_id').value = doctor.department_id || '';
        document.getElementById('edit_license_number').value = doctor.license_number || '';
        document.getElementById('edit_address').value = doctor.address || '';
        document.getElementById('edit_status').value = doctor.status || 'active';
        
        new bootstrap.Modal(document.getElementById('editDoctorModal')).show();
    } catch (error) {
        showError('Error loading doctor: ' + error.message);
    }
}

// Delete Doctor Function
async function deleteDoctor(id) {
    const confirmed = await confirmAction({
        title: 'Delete Doctor',
        message: 'Are you sure you want to delete this doctor?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/doctors/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showSuccess('Doctor deleted successfully!');
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
