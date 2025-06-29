// Patients Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const addPatientForm = document.getElementById('addPatientForm');
    const editPatientForm = document.getElementById('editPatientForm');
    
    if (addPatientForm) {
        addPatientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/patients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
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
    
    if (editPatientForm) {
        editPatientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const id = data.id;
            delete data.id;
            
            try {
                const response = await fetch(`/api/patients/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
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
        if (e.target.closest('.edit-patient-btn')) {
            const button = e.target.closest('.edit-patient-btn');
            const id = button.getAttribute('data-patient-id');
            await editPatient(id);
        } else if (e.target.closest('.delete-patient-btn')) {
            const button = e.target.closest('.delete-patient-btn');
            const id = button.getAttribute('data-patient-id');
            await deletePatient(id);
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('patientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const patientRows = document.querySelectorAll('.patient-row');
            
            patientRows.forEach(row => {
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

// Edit Patient Function
async function editPatient(id) {
    try {
        const response = await fetch(`/api/patients/${id}`);
        const patient = await response.json();
        
        document.getElementById('edit_id').value = patient.id;
        document.getElementById('edit_first_name').value = patient.first_name;
        document.getElementById('edit_last_name').value = patient.last_name;
        document.getElementById('edit_email').value = patient.email || '';
        document.getElementById('edit_phone').value = patient.phone || '';
        document.getElementById('edit_date_of_birth').value = patient.date_of_birth ? patient.date_of_birth.split('T')[0] : '';
        document.getElementById('edit_gender').value = patient.gender || '';
        document.getElementById('edit_address').value = patient.address || '';
        document.getElementById('edit_emergency_contact_name').value = patient.emergency_contact_name || '';
        document.getElementById('edit_emergency_contact_phone').value = patient.emergency_contact_phone || '';
        document.getElementById('edit_blood_type').value = patient.blood_type || '';
        document.getElementById('edit_insurance_number').value = patient.insurance_number || '';
        document.getElementById('edit_medical_history').value = patient.medical_history || '';
        
        new bootstrap.Modal(document.getElementById('editPatientModal')).show();
    } catch (error) {
        showError('Error loading patient: ' + error.message);
    }
}

// Delete Patient Function
async function deletePatient(id) {
    const confirmed = await confirmAction({
        title: 'Confirm Action',
        message: 'Are you sure you want to delete this patient?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/patients/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
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
